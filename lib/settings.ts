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

// In-memory storage untuk hosting dengan read-only file system
let inMemorySettings: Settings | null = null;

const filePath = path.join(process.cwd(), 'data', 'settings.json');

async function tryReadFromFile(): Promise<Settings | null> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as Settings;
  } catch {
    return null;
  }
}

function getFromEnv(): Settings | null {
  try {
    const envData = process.env.JUDOL_SETTINGS;
    if (envData) {
      return JSON.parse(envData) as Settings;
    }
  } catch {
    return null;
  }
  return null;
}

function setEnv(s: Settings): void {
  try {
    process.env.JUDOL_SETTINGS = JSON.stringify(s);
  } catch {}
}

export async function getSettings(): Promise<Settings> {
  // 1. Cek in-memory cache dulu
  if (inMemorySettings) {
    return inMemorySettings;
  }

  // 2. Cek environment variable
  const envSettings = getFromEnv();
  if (envSettings) {
    inMemorySettings = envSettings;
    return envSettings;
  }

  // 3. Coba baca dari file (untuk local development)
  const fileSettings = await tryReadFromFile();
  if (fileSettings) {
    inMemorySettings = fileSettings;
    return fileSettings;
  }

  // 4. Return default
  inMemorySettings = defaultSettings;
  return defaultSettings;
}

export async function setSettings(s: Settings): Promise<void> {
  // Simpan ke in-memory
  inMemorySettings = s;
  
  // Simpan ke env variable (untuk persist di restart)
  setEnv(s);

  // Coba simpan ke file (akan gagal di read-only system tapi tidak error)
  const dir = path.dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(s, null, 2), 'utf-8');
  } catch (e) {
    // Silently fail untuk read-only file system
    console.warn('Could not write to file system (read-only)', (e as any)?.code);
  }
}
