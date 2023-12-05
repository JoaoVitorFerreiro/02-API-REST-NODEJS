import { FastifyReply, FastifyRequest } from "fastify"

export async function CheckSessionIdExists(request :FastifyRequest,reply : FastifyReply){
  const SessionId = request.cookies.SessionId

  if(!SessionId) {
    return reply.status(401).send({error: "Unauthorized"})
  }
}