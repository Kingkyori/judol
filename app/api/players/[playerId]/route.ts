import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface PlayerSettings {
  player_id: string;
  jackpotenabled?: boolean;
  jackpotpercent?: number;
  allowwin?: boolean;
}

export async function GET(req: Request, { params }: { params: { playerId: string } }) {
  try {
    const playerId = params.playerId;

    const { data, error } = await supabase
      .from('player_settings')
      .select('*')
      .eq('player_id', playerId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const response = NextResponse.json(data || {});
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (e: any) {
    console.error('Player settings GET error:', e);
    return NextResponse.json({ error: 'Gagal membaca setting pemain' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { playerId: string } }) {
  try {
    const playerId = params.playerId;
    const body = await req.json();

    // Validasi
    const settings: PlayerSettings = {
      player_id: playerId,
    };

    if (body.jackpotEnabled !== undefined || body.jackpotenabled !== undefined) {
      settings.jackpotenabled = Boolean(body.jackpotEnabled ?? body.jackpotenabled);
    }

    if (body.jackpotPercent !== undefined || body.jackpotpercent !== undefined) {
      const percent = Number(body.jackpotPercent ?? body.jackpotpercent);
      if (isNaN(percent) || percent < 0 || percent > 1) {
        return NextResponse.json({ error: 'jackpotPercent harus 0.0 - 1.0' }, { status: 400 });
      }
      settings.jackpotpercent = percent;
    }

    if (body.allowWin !== undefined || body.allowwin !== undefined) {
      settings.allowwin = Boolean(body.allowWin ?? body.allowwin);
    }

    // Upsert
    const { data, error } = await supabase
      .from('player_settings')
      .upsert({ ...settings, updated_at: new Date().toISOString() }, {
        onConflict: 'player_id',
      })
      .select()
      .single();

    if (error) throw error;

    const response = NextResponse.json(data);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (e: any) {
    console.error('Player settings POST error:', e);
    return NextResponse.json(
      { error: e.message || 'Gagal menyimpan setting pemain' },
      { status: 500 }
    );
  }
}
