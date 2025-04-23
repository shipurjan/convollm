import fs from "fs";
import { decodeUTF8 } from "./decodeUTF8";

export function parseJsonFile(filepath: string) {
  const value = fs.readFileSync(filepath) as any as string;
  return decodeUTF8(JSON.parse(value));
}
