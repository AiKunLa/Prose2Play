import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "yaml";

export interface LoadedScreenplayYaml<TValue = unknown> {
  readonly filePath: string;
  readonly raw: string;
  readonly value: TValue;
}

export class ScreenplayYamlLoadError extends Error {
  public readonly filePath: string;

  public constructor(filePath: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ScreenplayYamlLoadError";
    this.filePath = filePath;
  }
}

export const defaultLoadScreenplayYamlPath = fileURLToPath(
  new URL("../examples/screenplay-example.yaml", import.meta.url),
);

export async function loadScreenplayYaml<TValue = unknown>(
  filePath: string,
): Promise<LoadedScreenplayYaml<TValue>> {
  const resolvedPath = path.resolve(filePath);
  let raw: string;

  try {
    raw = await readFile(resolvedPath, "utf8");
  } catch (error) {
    throw new ScreenplayYamlLoadError(
      resolvedPath,
      `Failed to read screenplay YAML at '${resolvedPath}': ${
        error instanceof Error ? error.message : String(error)
      }`,
      { cause: error },
    );
  }

  const document = parseDocument(raw, {
    prettyErrors: true,
    uniqueKeys: true,
  });

  if (document.errors.length > 0) {
    const details = document.errors.map((issue) => issue.message).join("; ");
    throw new ScreenplayYamlLoadError(
      resolvedPath,
      `Failed to parse screenplay YAML at '${resolvedPath}': ${details}`,
    );
  }

  return {
    filePath: resolvedPath,
    raw,
    value: document.toJS() as TValue,
  };
}
