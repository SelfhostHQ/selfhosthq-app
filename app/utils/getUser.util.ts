import prismaClient from 'prisma/prisma.server'
import { sessionCookie } from '~/entry.server'

export async function getUser(request: Request) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await sessionCookie.parse(cookieHeader)) || {}
  const sessionId = cookie.sessionId
  //check if session is active
  if (sessionId) {
    const session = await prismaClient.sessions.findFirst({
      where: { id: sessionId },
      include: {
        user: true,
      },
    })
    if (session && session.isActive) {
      //redirect to homepage
      return session.user
    }
  }
  throw new Error('User not found')
}
