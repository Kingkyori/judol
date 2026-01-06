import { NextResponse } from 'next/server';
import { getSettings } from '../../../lib/settings';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    // Get global settings
    const globalSettings = await getSettings();
    
    // Try to get player ID from request (if authenticated)
    let playerSettings = null;
    try {
      const body = await req.json().catch(() => ({}));
      if (body.playerId) {
        const { data } = await supabase
          .from('player_settings')
          .select('*')
          .eq('player_id', body.playerId)
          .single();
        playerSettings = data;
      }
    } catch (e) {
      // No player ID or error fetching, use global only
    }

    // Determine effective settings (player-specific overrides global)
    const jackpotEnabled = playerSettings?.jackpotenabled !== undefined 
      ? playerSettings.jackpotenabled 
      : globalSettings.jackpotEnabled;
      
    const allowWin = playerSettings?.allowwin !== undefined 
      ? playerSettings.allowwin 
      : globalSettings.allowWin;
      
    const jackpotPercent = playerSettings?.jackpotpercent !== undefined 
      ? playerSettings.jackpotpercent 
      : globalSettings.jackpotPercent;

    if (!jackpotEnabled) {
      return NextResponse.json({ outcome: 'DISABLED' });
    }

    // If winning is not allowed, always return a normal loss.
    if (!allowWin) {
      return NextResponse.json({ outcome: 'LOSE' });
    }

    const roll = Math.random();
    const win = roll < jackpotPercent;
    return NextResponse.json({ outcome: win ? 'WIN' : 'LOSE' });
  } catch (e) {
    console.error('Simulate error:', e);
    // Fallback ke global settings jika ada error
    const s = await getSettings();
    if (!s.jackpotEnabled) {
      return NextResponse.json({ outcome: 'DISABLED' });
    }
    if (!s.allowWin) {
      return NextResponse.json({ outcome: 'LOSE' });
    }
    const roll = Math.random();
    const win = roll < s.jackpotPercent;
    return NextResponse.json({ outcome: win ? 'WIN' : 'LOSE' });
  }
}
