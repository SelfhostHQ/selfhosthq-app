import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import prismaClient from 'prisma/prisma.server'
import { sessionCookie } from '~/entry.server'

export async function loader({ request }: LoaderFunctionArgs) {
  //check if we have a session active
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await sessionCookie.parse(cookieHeader)) || {}
  const sessionId = cookie.sessionId
  //check if session is active
  if (sessionId) {
    const session = await prismaClient.sessions.findFirst({
      where: { id: sessionId },
    })
    if (session && session.isActive) {
      //make the session inactive and redirect to login page
      await prismaClient.sessions.update({
        where: { id: sessionId },
        data: { isActive: false },
      })
      cookie.sessionId = null
      return redirect('/login', {
        headers: {
          'Set-Cookie': await sessionCookie.serialize(cookie),
        },
      })
    }
  }
  return redirect('/')
}
