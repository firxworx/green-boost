{
  "extends": "@{{GB_APP_ID}}/tsconfig/tsconfig.node.json",
  "compilerOptions": {
    "paths": {
      "@adapters/*": ["./src/adapters/*"],
      "@errors/*": ["./src/domain/errors/*"],
      "@models/*": ["./src/domain/models/*"],
      "@schemas/*": ["./src/domain/schemas/*"],
      "@services/*": ["./src/services/*"],
    }
  }
}
