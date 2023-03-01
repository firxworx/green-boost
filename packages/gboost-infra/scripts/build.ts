import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { cpSync, rmSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { buildWebDeploymentCr } from "./build-web-deployment-cr.js";

const thisFilePath = fileURLToPath(import.meta.url);

const libDir = resolve(thisFilePath, "../../lib");
const srcDir = resolve(thisFilePath, "../../src");
rmSync(libDir, { recursive: true, force: true });
execSync("pnpm exec tsc -p tsconfig.build.json", { stdio: "inherit" });
// bundle and minify WebDeployment custom resource lambda with esbuild
// (./src/web-deployment/custom-resource-handler)
// Note, tsconfig.build.json ignores these files so tsc transpiled js files
// don't overrwrite esbuild built files
await buildWebDeploymentCr();
// needed for vtl and js files that aren't built with tsc
cpSync(srcDir, libDir, {
  filter(source: string, destination: string) {
    // must return true for directories to recursively get to files
    if (statSync(source).isDirectory()) return true;
    const fileExt = destination.split(".").pop();
    return fileExt === "vtl" || fileExt === "js";
  },
  recursive: true,
});
