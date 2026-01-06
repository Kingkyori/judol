import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('users')
      .select('id, username, full_name, email, account_number, bank_type, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase query error:', error);
      throw error;
    }

    console.log('✅ Players fetched from Supabase:', data?.length, 'records');
    
    const response = NextResponse.json(data || []);
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (e: any) {
    console.error('Players GET error:', e);
    return NextResponse.json({ error: 'Gagal membaca daftar pemain', details: e.message }, { status: 500 });
  }
}
