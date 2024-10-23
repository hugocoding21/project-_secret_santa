import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  baseApiUrl: 'http://localhost:3001',
  baseUrl: 'http://localhost:4200',
  security: {
    allowedOrigins: 'http://localhost:4200',
  },
};
