import fs from "fs/promises";
import { readFile } from "./readFile";

export async function readJsonFile(filePath: string) {
  try {
  const content = await readFile(filePath)
  return content ? JSON.parse(content) : null;
  } catch {
    throw new Error("Error reading JSON file");
  }
}
