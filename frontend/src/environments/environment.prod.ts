import { Environment } from './environment.model';

//add url for prod when
export const environment: Environment = {
  production: true,
  baseApiUrl: 'https://secret-santa-project.onrender.com',
  baseUrl: 'https://secret-santa-6q4v60h5a-froggys974s-projects.vercel.app/',
  security: {
    allowedOrigins: 'https://secret-santa-6q4v60h5a-froggys974s-projects.vercel.app/', 
  },
};
