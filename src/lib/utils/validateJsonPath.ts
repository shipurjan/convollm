
export function validateJsonPath(
  filePath: string,
  fileType: "Input" | "Output",
): void {
  if (!filePath.toLowerCase().endsWith(".json")) {
    throw new Error(
      `${fileType} file must be a JSON file (with .json extension)`,
    );
  }
}