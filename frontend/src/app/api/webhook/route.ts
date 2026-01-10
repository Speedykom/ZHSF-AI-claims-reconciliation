import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    let message = '';
    let threadId: string | null = null;
    let hasFile = false;
    let fileData: FormData | null = null;

    if (contentType.includes('application/json')) {
      // text only message
      const body = await request.json();
      message = body.message || '';
      threadId = body.thread_id || null;
      hasFile = false;
    } else if (contentType.includes('multipart/form-data')) {
      
      // file upload request
      const formData = await request.formData();
      message = formData.get('message') as string || '';
      threadId = formData.get('thread_id') as string || null;
      
      // check if file exists in form data
      const file = formData.get('file');
      hasFile = file !== null;
      
      if (hasFile) {
        fileData = formData;
      }
    } else {
      return NextResponse.json(
        { error: 'unsupported content type' },
        { status: 400 }
      );
    }

    // validation
    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let n8nResponse;

    if (hasFile && fileData) {
      // send as multipart/form-data with file
      const n8nFormData = new FormData();
      n8nFormData.append('message', message);
      n8nFormData.append('thread_id', threadId || '');
      n8nFormData.append('has_file', 'true');
      
      const file = fileData.get('file');
      if (file) {
        n8nFormData.append('file', file);
      }

      n8nResponse = await fetch('http://172.18.0.11:5678/webhook-test/RAG', {
        method: 'POST',
        body: n8nFormData,
      });
    } else {
      // send text only message
      n8nResponse = await fetch('http://172.18.0.11:5678/webhook-test/RAG', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          thread_id: threadId,
        }),
      });
    }

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      return NextResponse.json(
        { error: 'failed to trigger n8n workflow', details: errorText },
        { status: n8nResponse.status }
      );
    }

    const result = await n8nResponse.json();

    return NextResponse.json({
      success: true,
      thread_id: result.thread_id || threadId,
      response: result.response || result.output || result,
      has_file: hasFile,
    });

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