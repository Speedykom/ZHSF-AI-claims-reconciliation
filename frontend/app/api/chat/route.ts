import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.messages?.[body.messages.length - 1]?.content;

    const response = await fetch("http://n8n:5678/webhook/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "user_id": "user_123",
        "thread_id": "thread_49594",
        "message": message,
        "session_id": "session_567"
      }),
    });

    const data = await response.json();

    return Response.json(data, {
      status: 200
    });

  } catch (error) {
    return Response.json({
      error: 'failed to process the request'
    }, {
      status: 500
    })
  }
}
