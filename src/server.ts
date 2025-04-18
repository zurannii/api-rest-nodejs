import fastify from 'fastify'
import crypto from 'node:crypto'
import knex from 'knex'
import { env, title } from 'node:process'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(transactionsRoutes)

app.listen({
    port: env.PORT ? parseInt(env.PORT, 10) : 3000,
})
    .then(() => {
    console.log('HTTP server running!')
})