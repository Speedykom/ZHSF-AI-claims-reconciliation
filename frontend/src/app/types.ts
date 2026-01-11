export interface Thread {
  thread_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  attachment_name?: string;
}
