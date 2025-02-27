import fs from "fs/promises";

export async function isDir(pathToCheck: string): Promise<boolean> {
  try {
    const stats = await fs.stat(pathToCheck);
    return stats.isDirectory();
  } catch {
    return false;
  }
}
