const { generateService } = require('@umijs/openapi');

// @umijs/openapi
generateService({
  requestLibPath: 'import { request } from "@umijs/max"',
  schemaPath: 'http://localhost:15090/v3/api-docs',
  serversPath: './src/services',
});
