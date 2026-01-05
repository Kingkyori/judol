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

export async function getSettings(): Promise<Settings> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as Settings;
  } catch {
    return defaultSettings;
  }
}

export async function setSettings(s: Settings): Promise<void> {
  const dir = path.dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {}
  await fs.writeFile(filePath, JSON.stringify(s, null, 2), 'utf-8');
}
