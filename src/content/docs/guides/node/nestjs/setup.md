---
title: Setup
slug: guides/node/nestjs/setup
description: Setup nest.js project
sidebar:
  order: 0
---

### Adding Alias

Update `tsconfig.json`

```json
// Remove baseURL as it is deprecated
"baseUrl": "./",

// Add paths
 "paths": {
      "@/*": ["./src/*"]
    }


```
