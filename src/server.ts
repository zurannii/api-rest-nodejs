import { app } from './app'
import { env } from 'node:process'

app.listen({
    port: env.PORT ? parseInt(env.PORT, 10) : 3333,
})
    .then(() => {
    console.log('HTTP server running!')
})