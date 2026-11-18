import { mcpClient, MCPToolCall, MCPToolResult } from './mcp-client';
import { nimChat, extractJson } from './nim';

export type AgentType = 'reviewer' | 'writer' | 'analyst' | 'formatter';

export interface AgentProfile {
  id: AgentType;
  name: string;
  description: string;
  icon: string;
  systemPrompt: string;
}

export interface AgentAction {
  tool: string;
  description: string;
  result: MCPToolResult;
  timestamp: number;
}

export interface AgentResponse {
  message: string;
  actions: AgentAction[];
  agentType: AgentType;
}

export const AGENT_PROFILES: AgentProfile[] = [
  {
    id: 'reviewer',
    name: 'Document Reviewer',
    description: 'Reviews documents for clarity, consistency, and completeness',
    icon: '🔍',
    systemPrompt: 'You are a meticulous document reviewer. Analyze documents for clarity, grammar, consistency, and completeness.',
  },
  {
    id: 'writer',
    name: 'Content Writer',
    description: 'Writes and enhances document content',
    icon: '✍️',
    systemPrompt: 'You are a professional content writer. Help create, expand, and improve document content.',
  },
  {
    id: 'analyst',
    name: 'Legal Analyst',
    description: 'Analyzes legal language and contract terms',
    icon: '⚖️',
    systemPrompt: 'You are a legal document analyst. Review contracts and legal documents for risks, ambiguities, and compliance.',
  },
  {
    id: 'formatter',
    name: 'Format Fixer',
    description: 'Fixes formatting, styles, and document structure',
    icon: '🎨',
    systemPrompt: 'You are a document formatting expert. Fix styling, headings, spacing, alignment, and overall document structure.',
  },
];

const ALLOWED_TOOLS = new Set([
  'superdoc_get_content',
  'superdoc_search',
  'superdoc_edit',
  'superdoc_format',
  'superdoc_create',
  'superdoc_list',
  'superdoc_save',
]);

export async function executeAgentInstruction(
  sessionId: string,
  instruction: string,
  agentType: AgentType
): Promise<AgentResponse> {
  const profile = AGENT_PROFILES.find((p) => p.id === agentType);
  if (!profile) {
    return {
      message: 'Unknown agent type.',
      actions: [],
      agentType,
    };
  }

  const actions: AgentAction[] = [];
  const instructionLower = instruction.toLowerCase();

  // Always start by reading the document so the LLM can plan real edits.
  const readCall: MCPToolCall = { tool: 'superdoc_get_content', arguments: { format: 'text' } };
  const readResult = await mcpClient.callTool(sessionId, readCall);
  actions.push({
    tool: readCall.tool,
    description: describeToolCall(readCall),
    result: readResult,
    timestamp: Date.now(),
  });

  const readData = readResult.data as { content?: string } | undefined;
  const docContent =
    typeof readData?.content === 'string'
      ? readData.content
      : readResult.data
        ? JSON.stringify(readResult.data)
        : '';

  // Plan the tool calls via LLM; fall back to keyword rules if the LLM plan fails.
  let toolCalls: MCPToolCall[] = [];
  try {
    const planText = await nimChat(
      [
        {
          role: 'system',
          content:
            'You are an AI document agent planner. Given a document and an instruction, reply with ONLY a JSON object: { "tools": [ { "tool": string, "arguments": object } ] }. ' +
            'Allowed tools: superdoc_search, superdoc_edit, superdoc_format, superdoc_create, superdoc_list. ' +
            'Tool argument hints: superdoc_edit { action: "replace", content: string } — the content MUST be the real replacement text derived from the instruction and document. ' +
            'superdoc_create { type: "paragraph", content: string } — the content MUST be real text to insert. ' +
            'superdoc_search { query: string } — superdoc_format { formatting: object } — superdoc_list { action: "create", type: "bullet" }. ' +
            'Only include tools that are actually needed. Do NOT invent other tool names.',
        },
        {
          role: 'user',
          content: `Document content (may be truncated):\n${docContent.slice(0, 4000)}\n\nInstruction: ${instruction}`,
        },
      ],
      { temperature: 0.2, maxTokens: 1200 }
    );
    const parsed = extractJson(planText);
    if (parsed && Array.isArray(parsed.tools)) {
      toolCalls = parsed.tools
        .filter((t: any) => typeof t?.tool === 'string' && ALLOWED_TOOLS.has(t.tool))
        .map((t: any) => ({ tool: t.tool, arguments: t.arguments || {} }));
    }
  } catch (err) {
    console.warn('LLM planning failed, falling back to rule-based plan:', err);
  }

  if (toolCalls.length === 0) {
    toolCalls = planToolCalls(instructionLower, agentType);
  }

  for (const toolCall of toolCalls) {
    const result = await mcpClient.callTool(sessionId, toolCall);
    actions.push({
      tool: toolCall.tool,
      description: describeToolCall(toolCall),
      result,
      timestamp: Date.now(),
    });
  }

  // Always save after modifications
  if (actions.length > 1) {
    const saveCall: MCPToolCall = { tool: 'superdoc_save', arguments: {} };
    const saveResult = await mcpClient.callTool(sessionId, saveCall);
    actions.push({
      tool: saveCall.tool,
      description: describeToolCall(saveCall),
      result: saveResult,
      timestamp: Date.now(),
    });
  }

  // Final user-facing message via LLM; fall back to the canned summary.
  let message = generateResponse(instruction, actions, profile);
  try {
    const resultsSummary = actions
      .map((a) => `- ${a.tool}: ${a.result.success ? 'ok' : `error: ${a.result.error}`}`)
      .join('\n');
    const llmMessage = await nimChat(
      [
        {
          role: 'system',
          content: `${profile.systemPrompt} You just executed document operations for the user. Write a concise, friendly summary (2-4 sentences) of what you did and what changed. Use Markdown bullets if helpful.`,
        },
        {
          role: 'user',
          content: `User instruction: ${instruction}\n\nExecuted operations:\n${resultsSummary}\n\nDocument excerpt:\n${docContent.slice(0, 2000)}`,
        },
      ],
      { temperature: 0.5, maxTokens: 500 }
    );
    if (llmMessage.trim()) message = llmMessage.trim();
  } catch (err) {
    console.warn('LLM summary failed, using canned response:', err);
  }

  return {
    message,
    actions,
    agentType,
  };
}

function planToolCalls(instruction: string, agentType: AgentType): MCPToolCall[] {
  const calls: MCPToolCall[] = [];

  // Always start by reading the document
  calls.push({
    tool: 'superdoc_get_content',
    arguments: { format: 'text' },
  });

  if (instruction.includes('search') || instruction.includes('find')) {
    const searchTerm = instruction.replace(/.*(?:search|find)\s+(?:for\s+)?/i, '').trim();
    calls.push({
      tool: 'superdoc_search',
      arguments: { query: searchTerm || 'keyword' },
    });
  }

  if (instruction.includes('replace') || instruction.includes('edit') || instruction.includes('change')) {
    calls.push({
      tool: 'superdoc_edit',
      arguments: { action: 'replace', content: 'Updated content' },
    });
  }

  if (instruction.includes('format') || instruction.includes('style') || instruction.includes('bold') || instruction.includes('heading')) {
    calls.push({
      tool: 'superdoc_format',
      arguments: { formatting: { bold: true } },
    });
  }

  if (instruction.includes('add') || instruction.includes('insert') || instruction.includes('write')) {
    calls.push({
      tool: 'superdoc_create',
      arguments: { type: 'paragraph', content: 'New content added by AI agent' },
    });
  }

  if (instruction.includes('list') || instruction.includes('bullet')) {
    calls.push({
      tool: 'superdoc_list',
      arguments: { action: 'create', type: 'bullet' },
    });
  }

  if (agentType === 'reviewer') {
    calls.push({
      tool: 'superdoc_search',
      arguments: { query: 'error|typo|inconsistent', type: 'regex' },
    });
  }

  // Always save after modifications
  if (calls.length > 1) {
    calls.push({
      tool: 'superdoc_save',
      arguments: {},
    });
  }

  return calls;
}

function describeToolCall(toolCall: MCPToolCall): string {
  const descriptions: Record<string, string> = {
    superdoc_open: 'Opening document session',
    superdoc_get_content: 'Reading document content',
    superdoc_search: `Searching for "${toolCall.arguments.query || 'content'}"`,
    superdoc_edit: `Applying ${toolCall.arguments.action || 'edit'} operation`,
    superdoc_format: 'Applying formatting changes',
    superdoc_save: 'Saving document',
    superdoc_close: 'Closing session',
    superdoc_create: `Creating new ${toolCall.arguments.type || 'element'}`,
    superdoc_list: 'Modifying list structure',
  };
  return descriptions[toolCall.tool] || `Executing ${toolCall.tool}`;
}

function generateResponse(
  instruction: string,
  actions: AgentAction[],
  profile: AgentProfile
): string {
  const successCount = actions.filter((a) => a.result.success).length;
  const totalCount = actions.length;

  if (successCount === 0) {
    return `I encountered issues processing your request. Please try again or rephrase your instruction.`;
  }

  const actionSummary = actions
    .filter((a) => a.result.success)
    .map((a) => `• ${a.description}`)
    .join('\n');

  return `**${profile.name}** completed ${successCount}/${totalCount} operations:\n\n${actionSummary}\n\nYour document has been updated. The changes are reflected in the editor.`;
}
