export default () => ({
  app: {
    port: Number.parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
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
});
