import dotenv from 'dotenv';

dotenv.config();

interface DbConfig {
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
  ssl: boolean;
  sync: boolean;
  logging: boolean;
}

function parseDatabaseUrl(url: string): Omit<DbConfig, 'sync' | 'logging'> {
  const parsed = new URL(url);
  const ssl =
    parsed.searchParams.get('sslmode') === 'require' ||
    parsed.searchParams.get('ssl') === 'true';

  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || '5432', 10),
    name: decodeURIComponent(parsed.pathname.replace(/^\//, '')),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    ssl,
  };
}

function resolveDbConfig(): DbConfig {
  const sync = process.env.DB_SYNC === 'true';
  const logging = process.env.DB_LOGGING === 'true';

  if (process.env.DATABASE_URL) {
    return { ...parseDatabaseUrl(process.env.DATABASE_URL), sync, logging };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'bioalquimia',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: false,
    sync,
    logging,
  };
}

interface Config {
  env: string;
  port: number;
  corsOrigin: string | string[];
  apiPrefix: string;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  db: DbConfig;
}

export const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  apiPrefix: process.env.API_PREFIX || '/api',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  db: resolveDbConfig(),
};

Object.keys(config).forEach((key) => {
  if (config[key as keyof Config] === undefined ) {
    throw new Error(`Missing configuration for ${key}`);
  }
});