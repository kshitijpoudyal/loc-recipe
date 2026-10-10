import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // React Compiler advisories. Kept visible as warnings while the affected
    // components (data loading in effects, refs read during render) are refactored.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/refs": "warn",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**", "next-env.d.ts", "public/sw.js"],
  },
];

export default eslintConfig;
