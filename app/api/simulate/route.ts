import { NextResponse } from 'next/server';
import { getSettings } from '../../../lib/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  const s = await getSettings();
  if (!s.jackpotEnabled) {
    return NextResponse.json({ outcome: 'DISABLED' });
  }
  // If winning is not allowed, always return a normal loss.
  if (!s.allowWin) {
    return NextResponse.json({ outcome: 'LOSE' });
  }
  const roll = Math.random();
  const win = roll < s.jackpotPercent;
  return NextResponse.json({ outcome: win ? 'WIN' : 'LOSE' });
}
