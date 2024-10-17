export interface Environment {
  production: boolean;
  baseUrl: string;
  baseApiUrl: string;
  security: {
    allowedOrigins: string;
  };
}
