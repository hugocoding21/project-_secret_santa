import { Environment } from './environment.model';

//add url for prod when
export const environment: Environment = {
  production: true,
  baseApiUrl: 'https://secret-santa-project.onrender.com',
  baseUrl: 'https://frontend-l2aj6ek9o-hugos-projects-f08ee255.vercel.app/',
  security: {
    allowedOrigins: 'https://frontend-l2aj6ek9o-hugos-projects-f08ee255.vercel.app/', 
  },
};
