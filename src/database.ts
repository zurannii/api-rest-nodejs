import 'dotenv/config'
import path from 'path'
import { knex as setupKnex, Knex } from 'knex'
import { env } from 'process';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env not found')
}

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: env.DATABASE_URL || './default-database.sqlite',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: path.resolve(__dirname, '..', 'database', 'migrations'),
  },

};
export const knex = setupKnex(config);
