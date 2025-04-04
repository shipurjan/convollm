import fs from "fs/promises";

export async function isFile(pathToCheck: string): Promise<boolean> {
  try {
    const stats = await fs.stat(pathToCheck);
    return stats.isFile();
  } catch {
    return false;
  }
}
