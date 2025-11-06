---
title: Scalar API
slug: guides/node/nestjs/scalar-api
description: Scalar API
sidebar:
  order: 1
---

### Adding Scalar API documentation to Nest.js project

- Add required dependencies

```bash
pnpm add @nestjs/swagger @scalar/nestjs-api-reference
```

- Update main.ts file

```javascript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
...
const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('Nest API description')
    .setVersion('1.0')
    .addTag('nest')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const OpenApiSpecification = app.use(
    '/reference',
    apiReference({
      content: document,
    }),
  );
```
