---
to: ui/tsconfig.json
---

{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "common/*": ["../common/src/*"]
    },
  },
}