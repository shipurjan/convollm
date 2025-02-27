import fs from "fs/promises";

async function isFileAsync(pathToCheck: string): Promise<boolean> {
  return fs.stat(pathToCheck).then((file) => file.isFile());
}
