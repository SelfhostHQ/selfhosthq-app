import { ActionFunctionArgs } from '@remix-run/node'
import { Form, useNavigation } from '@remix-run/react'
import prismaClient from 'prisma/prisma.server'
import { json } from 'react-router'
import { Button, TextInputField } from '~/components'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = formData.get('email')?.toString()
  console.log('email: ', email)
  if (!email) {
    return json({ errors: ['email not provided'] })
  }
  //check if we have the user in our db
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = await prismaClient.users.findFirst({
    where: {
      email,
    },
  })

  return json([])
}

export default function ForgotPasswordPage() {
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
          <h2 className=" text-center">Forgot password</h2>
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

            <Button
              label="Send OTP"
              type="submit"
              loading={navigation.state == 'submitting'}
            />
          </Form>
        </div>
      </div>
    </div>
  )
}
