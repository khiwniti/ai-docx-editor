import { NextRequest, NextResponse } from 'next/server';
import { executeAgentInstruction, AgentType } from '@/lib/agent-orchestrator';
import { mcpClient } from '@/lib/mcp-client';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow AI agents to run longer on Vercel Pro/Hobby (up to tier limits)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { instruction, agentType = 'reviewer', filePath } = body as {
      instruction: string;
      agentType?: AgentType;
      filePath?: string;
    };

    if (!instruction) {
      return NextResponse.json(
        { error: 'Instruction is required' },
        { status: 400 }
      );
    }

    // Open or reuse session
    const sessionId = await mcpClient.openSession(
      filePath || 'current-document.docx'
    );

    const response = await executeAgentInstruction(
      sessionId,
      instruction,
      agentType
    );

    return NextResponse.json({
      success: true,
      ...response,
      sessionId,
    });
  } catch (error) {
    console.error('Agent execution error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
