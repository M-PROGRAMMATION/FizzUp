import { Environment, WebAppEnvironment } from '@shared';

export const environment: WebAppEnvironment = {
  environment: Environment.DEVELOPMENT,
  hostUrl: 'http://localhost:4200',
  apiUrl: 'http://localhost:3000/api/v1',
};