import { LoaderFunctionArgs, json } from '@remix-run/node'
import { isRouteErrorResponse, useRouteError } from '@remix-run/react'
import { PROJECT_PERMISSIONS } from '~/types'
import { checkProjectPermissions } from '~/utils/checkProjectPermissions.util'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const projectHandle = params.project
  if (!projectHandle) throw Error('Project not found')
  await checkProjectPermissions(request, projectHandle, [
    PROJECT_PERMISSIONS.READ_ALL_APPS,
  ])

  return json({})
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
  return <div>This is where we need to show all apps for this project</div>
}
