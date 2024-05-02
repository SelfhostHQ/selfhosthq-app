import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node'
import { Form, MetaFunction, useNavigation } from '@remix-run/react'
import prismaClient from 'prisma/prisma.server'
import { Button, TextInputField } from '~/components'
import { getClientIPAddress } from 'remix-utils/get-client-ip-address'
import UAParser from 'ua-parser-js'
import { sessionCookie } from '~/entry.server'

export const meta: MetaFunction = () => {
  return [{ title: 'SelfhostHQ Login' }]
}

export async function action({ request }: ActionFunctionArgs) {
  const bcrypt = await import('bcrypt')
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  //check login
  const email = data.email.toString()
  const password = data.password.toString()
  if (!email) {
    return json({ errors: [{ msg: 'Email is required' }] })
  }
  if (!password) {
    return json({ errors: [{ msg: 'Password is required' }] })
  }
  //get the user
  const user = await prismaClient.users.findFirst({
    where: {
      email,
    },
  })

  if (!user) {
    return json({ errors: [{ msg: 'User not found' }] })
  }

  //now check if password is correct
  if (!bcrypt.compareSync(password, user.password)) {
    return json({ errors: [{ msg: 'Incorrect password. Please try again' }] })
  }

  const parser = new UAParser(request.headers.get('user-agent') || '')
  const parserResults = parser.getResult()
  //get client location
  const getLocationData = await fetch(
    `https://ipapi.co/${getClientIPAddress(request)}/json/`
  )
  const locationData = (await getLocationData.json()) as {
    city: string
    region: string
    country: string
  }

  //setup session and redirect

  const newSession = await prismaClient.sessions.create({
    data: {
      userId: user.id,
      browserName: parserResults.browser.name,
      deviceType: parserResults.device.vendor,
      os: parserResults.os.name,
      ipAddress: getClientIPAddress(request),
      location: `${locationData.city || ''} ${locationData.region || ''} ${
        locationData.country || ''
      }`,
    },
  })

  //set this session as a http only cookie on the header

  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await sessionCookie.parse(cookieHeader)) || {}
  cookie.sessionId = newSession.id

  const { searchParams } = new URL(request.url)
  const returnUrl = searchParams.get('return')
  return redirect(returnUrl || '/', {
    headers: {
      'Set-Cookie': await sessionCookie.serialize(cookie),
    },
  })
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await sessionCookie.parse(cookieHeader)) || {}
  const sessionId = cookie.sessionId
  //check if session is active
  if (sessionId) {
    const session = await prismaClient.sessions.findFirst({
      where: { id: sessionId },
    })
    if (session && session.isActive) {
      //redirect to homepage
      return redirect('/')
    }
  }
  return json({})
}

export default function LoginPage() {
  const navigation = useNavigation()

  return (
    <div className=" min-h-screen flex align-middle justify-center bg-[#FFFAE1]">
      <div className=" px-6 py-12 lg:px-8 bg-white m-auto rounded-2xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-30 w-auto"
            src="/selfhost-icon-with-label.png"
            alt="SelfhostHQ logo"
          />
          <h2 className=" text-center">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form className="space-y-6" method="POST">
            <TextInputField
              id="email"
              name="email"
              label="Email address"
              required
              autocomplete="email"
            />
            <TextInputField
              id="password"
              type="password"
              name="password"
              label="Password"
              autocomplete="auto"
              required
              action={{
                label: 'Forgot password?',
                link: '/forgot-password',
              }}
            />

            <Button
              label="Login"
              type="submit"
              loading={navigation.state == 'submitting'}
            />
          </Form>
        </div>
      </div>
    </div>
  )
}
