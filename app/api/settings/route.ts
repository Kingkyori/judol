import { NextResponse } from 'next/server';
import { getSettings, setSettings, Settings } from '../../../lib/settings';

export async function GET() {
  try {
    const s = await getSettings();
    const response = NextResponse.json(s);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (e: any) {
    console.error('Settings GET error:', e);
    return NextResponse.json({ error: 'Gagal membaca pengaturan' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Basic validation
    const s: Settings = {
      jackpotEnabled: Boolean(body.jackpotEnabled),
      allowWin: Boolean(body.allowWin),
      jackpotPercent: Number(body.jackpotPercent),
    };
    if (isNaN(s.jackpotPercent) || s.jackpotPercent < 0 || s.jackpotPercent > 1) {
      return NextResponse.json({ error: 'jackpotPercent harus 0.0 - 1.0' }, { status: 400 });
    }
    await setSettings(s);
    const response = NextResponse.json(s);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (e: any) {
    console.error('Settings POST error:', e);
    return NextResponse.json(
      { error: e.message || 'Gagal menyimpan pengaturan' },
      { status: 500 }
    );
  }
}
