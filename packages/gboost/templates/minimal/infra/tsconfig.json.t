{
  "extends": "@{{GB_APP_ID}}/tsconfig/tsconfig.node.json",
  "exclude": ["cdk.out"],
  "compilerOptions": {
    "exactOptionalPropertyTypes": false
  },
  "ts-node": {
    "esm": true,
    "swc": true,
  }
}
