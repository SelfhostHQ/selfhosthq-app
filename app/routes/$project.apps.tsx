import { LoaderFunctionArgs, json } from '@remix-run/node'
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'
import prismaClient from 'prisma/prisma.server'
import { Page } from '~/components/Page.component'
import { PROJECT_PERMISSIONS } from '~/types'
import { checkProjectPermissionsAndReturnProjectId } from '~/utils/checkProjectPermissionsAndReturnProjectId.util'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const projectHandle = params.project
  if (!projectHandle) throw Error('Project not found')
  const projectId = await checkProjectPermissionsAndReturnProjectId(
    request,
    projectHandle,
    [PROJECT_PERMISSIONS.READ_ALL_APPS]
  )

  const apps = await prismaClient.apps.findMany({
    where: {
      projectId,
    },
  })
  return json({ apps })
}

export function ErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <div>{error.data || 'Oops! Something went wrong. Please try again'}</div>
    )
  }

  return 'Oops! Something went wrong. Please try again'
}
export default function Apps() {
  const { apps } = useLoaderData<typeof loader>()
  return (
    <Page title="Apps">
      {apps.length == 0 ? (
        <div className=" my-4">No apps found under this project</div>
      ) : null}
    </Page>
  )
}
