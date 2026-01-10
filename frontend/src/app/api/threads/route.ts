import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const n8nResponse = await fetch('http://172.18.0.11:5678/webhook/threads', {
      method: 'GET',
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      return NextResponse.json(
        { error: 'failed to fetch threads from n8n workflow', details: errorText },
        { status: n8nResponse.status }
      );
    }

    const result = await n8nResponse.json();

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json(
      {
        error: 'internal server error',
        details: error instanceof Error ? error.message : 'error'
      },
      { status: 500 }
    );
  }
}
