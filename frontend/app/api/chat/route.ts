import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.messages?.[body.messages.length - 1]?.content;
    const session = body.session;

    // if (!session) {
    //   return Response.json({
    //     error: 'session parameter is required'
    //   }, {
    //     status: 400
    //   });
    // }

    const response = await fetch("http://n8n:5678/webhook/claims-agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "session": "test123456",
        "message": message,
      }),
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      const responseText = await response.text();
      return Response.json({
        error: 'invalid response from webhook'
      }, {
        status: 502
      });
    }

    return Response.json([data], {
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
