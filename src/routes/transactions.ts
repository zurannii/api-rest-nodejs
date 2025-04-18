import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z } from "zod"
import crypto from "node:crypto"
import { request } from "node:http"
import { error } from "node:console"
import { checkSessionIdExists } from "../middleware/check-session-id-exists"
import { console } from "node:inspector"

export async function transactionsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request, reply) => {
        console.log(`[${request.method}] ${request.url}`)
    })

    app.get('/',
         {
        preHandler: [checkSessionIdExists]
         },
     async (request, reply) => {
        const { sessionId } = request.cookies

        const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()
        return { transactions }
    })

    app.get('/summary', 
        {
        preHandler: [checkSessionIdExists]
         },
          async (request, reply) => {
            const { sessionId } = request.cookies
        const summary = await knex('transactions')
            .sum('amount', { as: 'amount' })
            .where('session_id', sessionId)
            .first()

        return { summary }
    })

    app.get('/:id', 
        {
        preHandler: [checkSessionIdExists]
        },
          async (request, reply) => {
            const { sessionId } = request.cookies
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getTransactionParamsSchema.parse(request.params)

        const transaction = await knex('transactions')
            .where({
                session_id: sessionId,
                id,
            })
            .first()

        return { transaction }
    })

    app.post('/', async (request, reply) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        })

        const { title, amount, type } = createTransactionBodySchema.parse(
            request.body
        )

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = crypto.randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            })
        }

        await knex('transactions').insert({
            id: crypto.randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id: sessionId,
        })

        return reply.status(201).send()
    })
}
