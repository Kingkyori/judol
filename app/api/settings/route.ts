import { NextResponse } from 'next/server';
import { getSettings, setSettings, Settings, getSettingsSource } from '../../../lib/settings';

// Ensure Node.js runtime (for fs) and disable caching for dynamic values
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await getSettings();
  return NextResponse.json(s, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Settings-Source': getSettingsSource()
    }
  });
}

export async function POST(req: Request) {
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
  try {
    await setSettings(s);
    const latest = await getSettings();
    return NextResponse.json(latest, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Settings-Source': getSettingsSource()
      }
    });
  } catch (e: any) {
    // Should not usually throw if lib handles fallback,
    // but return a clear error if something unexpected occurs.
    return NextResponse.json({ error: e?.message || 'Gagal menyimpan pengaturan' }, { status: 500 });
  }
}
