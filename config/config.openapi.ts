import { getEnvBool } from './utils';

const enableOpenApi = getEnvBool('ENABLE_OPEN_API');
console.log('ENABLE_OPEN_API', enableOpenApi);

console.log('[OpenAPI]', enableOpenApi);

let openApiConfig = enableOpenApi
  ? {
      // @umijs/max-plugin-openapi
      openAPI: [
        {
          requestLibPath: 'import { request } from "@umijs/max"',
          schemaPath: 'http://localhost:15090/v3/api-docs',
          projectName: 'group_center',
        },
      ],
    }
  : {};

export default openApiConfig;
