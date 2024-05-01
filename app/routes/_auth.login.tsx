import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import prismaClient from 'prisma/prisma.server'
import { Button, TextInputField } from '~/components'

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

  //setup session and redirect

  return redirect('/')
}

export default function LoginPage() {
  const navigation = useNavigation()
  const data = useActionData<typeof action>()
  console.log('actiond ata:', data)
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
