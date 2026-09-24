import { sequelize } from '../config/database';

sequelize.options.logging = false;

async function main(): Promise<void> {
  try {
    await sequelize.authenticate();
    const { host, port, database } = sequelize.config;
    console.log(`Database connection established (${host}:${port}/${database})`);

    await sequelize.sync({ alter: false });
    console.log('Database schema synchronized (code-first)');
  } catch (error) {
    console.error('Failed to sync database schema:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

void main();