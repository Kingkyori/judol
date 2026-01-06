import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, full_name, email, account_number, bank_type, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const response = NextResponse.json(data || []);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (e: any) {
    console.error('Players GET error:', e);
    return NextResponse.json({ error: 'Gagal membaca daftar pemain' }, { status: 500 });
  }
}
