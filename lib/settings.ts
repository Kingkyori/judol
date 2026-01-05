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
let lastSource: 'edge' | 'kv' | 'file' | 'memory' | 'default' = 'default';

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


async function getEdgeConfig() {
  try {
    if (process.env.EDGE_CONFIG) {
      const mod = await import('@vercel/edge-config');
      return mod as { get: (key: string) => Promise<any> };
    }
  } catch {}
  return null;
}

function getEdgeConfigWriteContext(): { id: string; token: string } | null {
  const id = process.env.EDGE_CONFIG;
  if (!id) return null;
  // Try common env names first
  const candidates = [
    'EDGE_CONFIG_TOKEN',
    'EDGE_CONFIG_RW_TOKEN',
    'EDGE_CONFIG_WRITE_TOKEN',
    'EDGE_CONFIG_MANAGEMENT_TOKEN',
  ];
  for (const name of candidates) {
    const val = process.env[name];
    if (val) return { id, token: val };
  }
  // Fallback: scan env keys containing both 'edge' and 'token'
  for (const key of Object.keys(process.env)) {
    const lower = key.toLowerCase();
    if (lower.includes('edge') && lower.includes('token')) {
      const val = process.env[key];
      if (val) return { id, token: val };
    }
  }
  // As last resort: scan keys containing 'config' and 'token'
  for (const key of Object.keys(process.env)) {
    const lower = key.toLowerCase();
    if (lower.includes('config') && lower.includes('token')) {
      const val = process.env[key];
      if (val) return { id, token: val };
    }
  }
  return null;
}

export async function getSettings(): Promise<Settings> {
  // Prefer Edge Config if available
  try {
    const ec = await getEdgeConfig();
    if (ec) {
      const v = await ec.get('judol:settings');
      if (v) {
        lastSource = 'edge';
        return v as Settings;
      }
    }
  } catch {}

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
  // Try Edge Config first if available (requires management token)
  try {
    const ctx = getEdgeConfigWriteContext();
    if (ctx) {
      const res = await fetch(`https://api.vercel.com/v1/edge-config/${ctx.id}/items`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${ctx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            { operation: 'upsert', key: 'judol:settings', value: s },
          ]
        }),
      });
      if (res.ok) {
        memorySettings = s; // keep memory in sync
        return;
      }
    }
  } catch {}

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

export function getSettingsSource(): 'edge' | 'kv' | 'file' | 'memory' | 'default' {
  return lastSource;
}
