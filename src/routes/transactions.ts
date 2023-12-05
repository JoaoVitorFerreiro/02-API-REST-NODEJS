import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { knex } from "../database"
import { randomUUID } from "node:crypto"
import { CheckSessionIdExists } from "../middlewares/check-session-id-exist"

export async function transactionsRoute(app : FastifyInstance) {
  app.get('/', {
    preHandler: [CheckSessionIdExists]
  }, async (request) => {

    const { SessionId } = request.cookies

    const transactions = await knex('transactions')
    .where('session_id', SessionId)
    .select()

    return {transactions}
  })

  app.get('/:id', {
    preHandler: [CheckSessionIdExists]
  }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid()
    })
    const { SessionId } = request.cookies 
    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions')
    .where({
      session_id: SessionId,
      id
    })
    .first()

    return {transaction}
  })

  app.get('/summary', {
    preHandler: [CheckSessionIdExists]
  }, async (request) => {
    const { SessionId } = request.cookies
    const summary = await knex('transactions')
    .where('session_id', SessionId)
    .sum('amount', {as : 'Amount'})
    .first()

    return {summary}
  })

  app.post('/', {
    preHandler: [CheckSessionIdExists]
  }, async (request, replay) => {
    const createTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    })

    const { title, amount, type } = createTransactionSchema.parse(request.body)


    let SessionId = request.cookies.SessionId

    if (!SessionId) {
      SessionId = randomUUID()

      replay.cookie("SessionId", SessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      })
    }
    
    await knex("transactions")
    .insert({ 
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: SessionId
    })

    return replay.status(201).send()
  })
}