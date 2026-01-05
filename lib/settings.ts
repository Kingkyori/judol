import { promises as fs } from 'fs';
import path from 'path';

export type Settings = {
  jackpotEnabled: boolean;
  jackpotPercent: number; // 0.0 - 1.0
  allowWin: boolean;
};

const defaultSettings: Settings = {
  jackpotEnabled: true,
  jackpotPercent: 0.3,
  allowWin: true,
};

const filePath = path.join(process.cwd(), 'data', 'settings.json');
let memorySettings: Settings | null = null;
let lastSource: 'kv' | 'file' | 'memory' | 'default' = 'default';

async function getKV() {
  try {
    // Use KV only if env hints are present
    if (process.env.KV_URL || process.env.KV_REST_API_URL) {
      const mod = await import('@vercel/kv');
      return mod.kv as { get: (key: string) => Promise<any>; set: (key: string, value: any) => Promise<any> };
    }
  } catch {}
  return null;
}

export async function getSettings(): Promise<Settings> {
  // Prefer KV if available
  try {
    const kv = await getKV();
    if (kv) {
      const v = await kv.get('judol:settings');
      if (v) {
        lastSource = 'kv';
        return v as Settings;
      }
    }
  } catch {}

  // Fallback to file
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    lastSource = 'file';
    return JSON.parse(data) as Settings;
  } catch {}

  // Final fallback: memory or default
  if (memorySettings) {
    lastSource = 'memory';
    return memorySettings;
  }
  lastSource = 'default';
  return defaultSettings;
}

export async function setSettings(s: Settings): Promise<void> {
  const dir = path.dirname(filePath);
  // Try KV first if available
  try {
    const kv = await getKV();
    if (kv) {
      await kv.set('judol:settings', s);
      memorySettings = s; // keep memory in sync for this instance
      return;
    }
  } catch {}

  // Fallback to file write
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {}
  try {
    await fs.writeFile(filePath, JSON.stringify(s, null, 2), 'utf-8');
  } catch {
    memorySettings = s; // as last resort, keep in memory
  }
}

export function getSettingsSource(): 'kv' | 'file' | 'memory' | 'default' {
  return lastSource;
}
