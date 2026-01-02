import { NextResponse } from 'next/server';
import { getSettings, setSettings, Settings } from '../../../lib/settings';

export async function GET() {
  const s = await getSettings();
  return NextResponse.json(s);
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
  await setSettings(s);
  return NextResponse.json(s);
}
