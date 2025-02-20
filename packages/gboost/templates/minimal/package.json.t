{
  "name": "@{{GB_APP_ID}}/monorepo",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "pnpm --recursive --parallel build",
    "lint": "pnpm --recursive --parallel lint",
    "test": "pnpm --recursive --parallel test",
    "typecheck": "pnpm --recursive --parallel typecheck",
    "prepare": "husky install",
    "preinstall": "npx only-allow pnpm"
  },
  "devDependencies": {
    "@types/node": "^18.16.19",
    "eslint": "^8.44.0",
    "husky": "^8.0.3",
    "lint-staged": "^13.2.3",
    "typescript": "^5.1.6"
  },
  "dependencies": {
    "esbuild": "^0.17.16"
  },
  "pnpm": {
    "overrides": {},
    "peerDependencyRules": {}
  }
}