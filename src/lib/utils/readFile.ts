import fs from "fs/promises";

export async function readFile(filePath: string) {
  try {
    return fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}
