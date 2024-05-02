import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import prismaClient from 'prisma/prisma.server'
import { Button, TextInputField } from '~/components'
import { TextAreaInputField } from '~/components/TextAreaInputField.component'
import { PROJECT_ACCESS_TYPE } from '~/types'
import { getUser } from '~/utils/getUser.util'

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUser(request)
  const formData = await request.formData()
  const name = formData.get('name')?.toString()
  const description = formData.get('description')?.toString()
  const handle = formData.get('handle')?.toString()
  if (!name || !handle) {
    return json({ errors: ['Required params missing'] })
  }

  //create the project
  await prismaClient.projects.create({
    data: {
      name,
      description,
      handle,
      accesses: {
        create: {
          userId: user.id,
          role: PROJECT_ACCESS_TYPE.OWNER,
        },
      },
    },
  })
  return redirect('/')
}

export default function CreateNewProjectPage() {
  const navigation = useNavigation()
  const isFormSubmitting = navigation.state == 'submitting'
  const actionData = useActionData<typeof action>()
  console.log('action data: ', actionData)
  return (
    <div className="bg-secondary min-h-screen flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white  rounded-2xl p-10">
        <h3 className=" text-center mb-9">Create a new project</h3>

        <Form method="POST">
          <div className="space-y-6">
            <TextInputField
              id="name"
              type="text"
              label="Name"
              name="name"
              required
              disabled={isFormSubmitting}
            />
            <TextAreaInputField
              disabled={isFormSubmitting}
              id="description"
              label="Description"
              name="description"
              required
            />
            <TextInputField
              id="handle"
              type="text"
              label="Handle"
              disabled={isFormSubmitting}
              required
              name="handle"
              helpText="Must be unique across all your projects"
            />
            <Button
              label="Create project"
              type="submit"
              fullWidth
              loading={isFormSubmitting}
            />
          </div>
        </Form>
      </div>
    </div>
  )
}
