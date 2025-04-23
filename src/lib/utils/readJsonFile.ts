import { parseJsonFile } from "./parseJsonFile";

export async function readJsonFile(filePath: string) {
  try {
    return parseJsonFile(filePath);
  } catch {
    throw new Error("Error reading JSON file");
  }
}
