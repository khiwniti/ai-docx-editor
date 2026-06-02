import { mcpClient, MCPToolCall, MCPToolResult } from './mcp-client';

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

  // Plan tool calls based on instruction analysis
  const toolCalls = planToolCalls(instructionLower, agentType);

  for (const toolCall of toolCalls) {
    const result = await mcpClient.callTool(sessionId, toolCall);
    actions.push({
      tool: toolCall.tool,
      description: describeToolCall(toolCall),
      result,
      timestamp: Date.now(),
    });
  }

  const message = generateResponse(instruction, actions, profile);

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
