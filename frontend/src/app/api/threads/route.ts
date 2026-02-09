import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    let n8nUrl = 'http://n8n:5678/webhook/threads';
    if (username) {
      n8nUrl += `?username=${encodeURIComponent(username)}`;
    }

    const n8nResponse = await fetch(n8nUrl, {
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
