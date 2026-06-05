export const schemaPackageName = "@prose2play/schema";

export {
  ScreenplayYamlLoadError,
  defaultLoadScreenplayYamlPath,
  loadScreenplayYaml,
} from "./load-screenplay-yaml.js";
export {
  ScreenplaySchemaReadError,
  defaultScreenplaySchemaPath,
  readSchema,
} from "./read-schema.js";
export {
  validateScreenplay,
  validateScreenplayFile,
} from "./validate-screenplay.js";
export type {
  LoadedScreenplayYaml,
} from "./load-screenplay-yaml.js";
export type {
  ScreenplaySchema,
} from "./read-schema.js";
export type {
  ScreenplayValidationIssue,
  ScreenplayValidationResult,
  ValidateScreenplayFileResult,
  ValidateScreenplayOptions,
} from "./validate-screenplay.js";
