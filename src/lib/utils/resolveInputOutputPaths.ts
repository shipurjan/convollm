import path from "node:path";
import { validateJsonPath } from "@/lib/utils/validateJsonPath";

export function resolveInputOutputPaths(
    input: string,
    output?: string,
  ): { inputPath: string; outputPath: string } {
    const inputPath = path.resolve(input);
    validateJsonPath(inputPath, "Input");
  
    const outputPath = output
      ? path.resolve(output)
      : path.join(
          path.dirname(input),
          path.basename(input, ".json") + ".out.json",
        );
    validateJsonPath(outputPath, "Output");
  
    return { inputPath, outputPath };
  }
  