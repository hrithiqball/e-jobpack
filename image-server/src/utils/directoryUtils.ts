import fs from 'fs';

export function createDirectories(...dirs: string[]): void {
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}
