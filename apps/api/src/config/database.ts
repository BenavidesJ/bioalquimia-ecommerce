import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import { config } from './config';
import { models, setupAssociations } from '../models';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  username: config.db.user,
  password: config.db.password,
  models,
  dialectOptions: config.db.ssl ? { ssl: { require: true, rejectUnauthorized: false } } : undefined,
  define: {
    underscored: true,
    freezeTableName: true,
  },
});

setupAssociations();

export { models, setupAssociations };