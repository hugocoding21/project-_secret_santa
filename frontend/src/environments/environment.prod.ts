import { Environment } from './environment.model';

//add url for prod when
export const environment: Environment = {
  production: true,
  baseApiUrl: '',
  baseUrl: '',
  security: {
    allowedOrigins: '', 
  },
};
