import 'dotenv/config'
import path from 'path'
import { knex as setupKnex, Knex } from 'knex'
import { env } from 'process';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env not found')
}

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT === 'sqlite' ? 'sqlite3' : env.DATABASE_CLIENT,
  connection: env.DATABASE_CLIENT === 'sqlite' ? {
    filename: env.DATABASE_URL || '',
  } : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: path.resolve(__dirname, '..', 'database', 'migrations'),
  },

};
export const knex = setupKnex(config);
