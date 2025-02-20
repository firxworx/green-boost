// @ts-check
import { removeIgnoredFiles } from "@{{GB_APP_ID}}/utils";

export default {
  "*.ts": async (files) => {
    const filesToLint = await removeIgnoredFiles(files);
    return [`eslint --fix --max-warnings=0 ${filesToLint}`, `vitest related --run ${files}`, "tsc --noEmit"];
  }
}