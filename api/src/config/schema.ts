import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().default(4000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  CORS_ORIGIN: Joi.string().required(),
  PLAYGROUND: Joi.boolean().required(),
  BASE_URL: Joi.string().default('http://localhost:4000'),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  MAIL_HOST: Joi.string().optional(),
  MAIL_PORT: Joi.number().optional(),
  MAIL_USER: Joi.string().optional(),
  MAIL_PASS: Joi.string().optional(),
  MAIL_FROM: Joi.string().optional(),
});
