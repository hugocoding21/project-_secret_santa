import { Environment } from './environment.model';

//add url for prod when
export const environment: Environment = {
  production: true,
  baseApiUrl: 'https://secret-santa-project.onrender.com',
  baseUrl: 'https://frontend-seven-sigma-69.vercel.app',
  security: {
    allowedOrigins: 'https://frontend-seven-sigma-69.vercel.app', 
  },
};
