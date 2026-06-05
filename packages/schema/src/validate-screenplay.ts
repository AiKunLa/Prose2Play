import { Ajv2020, type ErrorObject, type ValidateFunction } from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";

import { loadScreenplayYaml } from "./load-screenplay-yaml.js";
import {
  defaultScreenplaySchemaPath,
  readSchema,
  type ScreenplaySchema,
} from "./read-schema.js";

export interface ScreenplayValidationIssue {
  readonly path: string;
  readonly pointer: string;
  readonly keyword: string;
  readonly message: string;
  readonly schemaPath: string;
  readonly params: Readonly<Record<string, unknown>>;
}

export interface ScreenplayValidationResult<TValue = unknown> {
  readonly ok: boolean;
  readonly errors: readonly ScreenplayValidationIssue[];
  readonly value?: TValue;
}

export interface ValidateScreenplayOptions {
  readonly schema?: ScreenplaySchema;
  readonly schemaPath?: string;
}

export interface ValidateScreenplayFileResult<TValue = unknown>
  extends ScreenplayValidationResult<TValue> {
  readonly filePath: string;
  readonly raw: string;
}

let defaultValidatorPromise: Promise<ValidateFunction> | undefined;
const addFormats = addFormatsModule as unknown as (ajv: Ajv2020) => void;

function escapeJsonPointerToken(value: string): string {
  return value.replaceAll("~", "~0").replaceAll("/", "~1");
}

function unescapeJsonPointerToken(value: string): string {
  return value.replaceAll("~1", "/").replaceAll("~0", "~");
}

function isIdentifierSegment(segment: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(segment);
}

function pointerToPath(pointer: string): string {
  if (pointer.length === 0) {
    return "$";
  }

  return pointer
    .split("/")
    .slice(1)
    .map(unescapeJsonPointerToken)
    .reduce((fullPath, segment) => {
      if (/^\d+$/.test(segment)) {
        return `${fullPath}[${segment}]`;
      }

      if (isIdentifierSegment(segment)) {
        return `${fullPath}.${segment}`;
      }

      return `${fullPath}[${JSON.stringify(segment)}]`;
    }, "$");
}

function toErrorPointer(error: ErrorObject): string {
  if (error.keyword === "required") {
    const missingProperty = error.params.missingProperty;
    if (typeof missingProperty === "string") {
      return `${error.instancePath}/${escapeJsonPointerToken(missingProperty)}`;
    }
  }

  if (error.keyword === "additionalProperties") {
    const additionalProperty = error.params.additionalProperty;
    if (typeof additionalProperty === "string") {
      return `${error.instancePath}/${escapeJsonPointerToken(additionalProperty)}`;
    }
  }

  return error.instancePath;
}

function formatValidationIssue(error: ErrorObject): ScreenplayValidationIssue {
  const pointer = toErrorPointer(error);

  return {
    path: pointerToPath(pointer),
    pointer,
    keyword: error.keyword,
    message: error.message ?? "Validation failed.",
    schemaPath: error.schemaPath,
    params: { ...error.params },
  };
}

async function buildValidator(schema: ScreenplaySchema): Promise<ValidateFunction> {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
  });

  addFormats(ajv);
  return ajv.compile(schema);
}

async function getDefaultValidator(): Promise<ValidateFunction> {
  if (defaultValidatorPromise === undefined) {
    defaultValidatorPromise = readSchema(defaultScreenplaySchemaPath).then(buildValidator);
  }

  return defaultValidatorPromise;
}

async function getValidator(options: ValidateScreenplayOptions): Promise<ValidateFunction> {
  if (options.schema !== undefined) {
    return buildValidator(options.schema);
  }

  if (options.schemaPath !== undefined && options.schemaPath !== defaultScreenplaySchemaPath) {
    const schema = await readSchema(options.schemaPath);
    return buildValidator(schema);
  }

  return getDefaultValidator();
}

export async function validateScreenplay<TValue = unknown>(
  value: TValue,
  options: ValidateScreenplayOptions = {},
): Promise<ScreenplayValidationResult<TValue>> {
  const validator = await getValidator(options);
  const isValid = validator(value);

  if (isValid) {
    return {
      ok: true,
      errors: [],
      value,
    };
  }

  return {
    ok: false,
    errors: (validator.errors ?? []).map(formatValidationIssue),
  };
}

export async function validateScreenplayFile<TValue = unknown>(
  filePath: string,
  options: ValidateScreenplayOptions = {},
): Promise<ValidateScreenplayFileResult<TValue>> {
  const loaded = await loadScreenplayYaml<TValue>(filePath);
  const result = await validateScreenplay(loaded.value, options);

  return {
    ...result,
    filePath: loaded.filePath,
    raw: loaded.raw,
    value: result.ok ? result.value : undefined,
  };
}
