import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');
    const session = searchParams.get('session');

    let query = supabase
      .from('n8n_chat_histories')
      .select('*')
      .order('id', { ascending: true });

    if (user && session) {
      query = query.eq('session_id', session);
    } else if (user) {
      query = query.like('session_id', `${user}_%`);
    }

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return Response.json({}, { status: 200 });
    }

    const threads = data.reduce((acc, message) => {
      const sessionId = message.session_id;
      if (!acc[sessionId]) {
        acc[sessionId] = [];
      }
      acc[sessionId].push(message);
      return acc;
    }, {});

    return Response.json(threads);
  } catch (error) {
    return Response.json({
      error: 'failed to fetch threads'
    }, {
      status: 500
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const timestamp = Date.now();
    const sessionId = `user1_session${timestamp}`;

    return Response.json({
      session_id: sessionId,
      message: 'New session created successfully'
    });
  } catch (error) {
    return Response.json({
      error: 'failed to create new session'
    }, {
      status: 500
    });
  }
}
