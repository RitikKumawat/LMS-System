export default () => ({
  app: {
    port: Number.parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    baseUrl: process.env.BASE_URL || 'http://localhost:4000',
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [],
  },

  graphql: {
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number.parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  certificate: {
    uploadsPath: './uploads/certificates',
    emailSubject: 'Your Course Completion Certificate',
  },
});
