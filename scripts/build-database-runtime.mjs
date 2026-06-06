import path from "node:path";
import { execFileSync } from "node:child_process";

export function compileDatabaseRuntime(root = process.cwd()) {
  const tscEntrypoint = path.join(root, "node_modules", "typescript", "bin", "tsc");

  execFileSync(process.execPath, [tscEntrypoint, "-b", "packages/config/tsconfig.json", "packages/providers/tsconfig.json"], {
    cwd: root,
    stdio: "pipe",
  });
}
