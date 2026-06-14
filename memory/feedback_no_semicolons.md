---
name: feedback_no_semicolons
description: User prefers TypeScript/JavaScript code without semicolons
metadata:
  type: feedback
---

Write all TypeScript and JavaScript code without semicolons and use arrow functions throughout.

**Why:** User explicitly requested this style preference.

**How to apply:** Never add semicolons at end of statements in .ts or .js files for this project. A .prettierrc with `"semi": false` is configured to enforce this.
