---
to: .husky/pre-commit
---

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint-staged