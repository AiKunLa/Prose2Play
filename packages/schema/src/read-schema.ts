import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export type ScreenplaySchema = Record<string, unknown>;

export class ScreenplaySchemaReadError extends Error {
  public readonly filePath: string;

  public constructor(filePath: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ScreenplaySchemaReadError";
    this.filePath = filePath;
  }
}

export const defaultScreenplaySchemaPath = fileURLToPath(
  new URL("../schemas/screenplay.schema.json", import.meta.url),
);

export async function readSchema(schemaPath: string = defaultScreenplaySchemaPath): Promise<ScreenplaySchema> {
  let raw: string;

  try {
    raw = await readFile(schemaPath, "utf8");
  } catch (error) {
    throw new ScreenplaySchemaReadError(
      schemaPath,
      `Failed to read screenplay schema at '${schemaPath}': ${
        error instanceof Error ? error.message : String(error)
      }`,
      { cause: error },
    );
  }

  try {
    return JSON.parse(raw) as ScreenplaySchema;
  } catch (error) {
    throw new ScreenplaySchemaReadError(
      schemaPath,
      `Failed to parse screenplay schema JSON at '${schemaPath}': ${
        error instanceof Error ? error.message : String(error)
      }`,
      { cause: error },
    );
  }
}
