import fastify from 'fastify'
import crypto from 'node:crypto'
import knex from 'knex'
import { env, title } from 'node:process'

const app = fastify()

app.get('/hello', async () => { 
  const transactions = await knex('transactions')
  .where('amount', 1000)
  .select('*')

  return transactions
})

app.listen({
    port: env.PORT ? parseInt(env.PORT, 10) : 3000,
})
    .then(() => {
    console.log('HTTP server running!')
})