import fastify from 'fastify'
import { env, title } from 'node:process'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)
app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app.listen({
    port: env.PORT ? parseInt(env.PORT, 10) : 3333,
})
    .then(() => {
    console.log('HTTP server running!')
})