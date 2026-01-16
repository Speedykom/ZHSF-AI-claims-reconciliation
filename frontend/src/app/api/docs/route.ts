import { NextResponse } from 'next/server';
import { getApiDocs } from '@/lib/swagger';

export const GET = async () => {
  const spec = await getApiDocs();
  return NextResponse.json(spec);
};
