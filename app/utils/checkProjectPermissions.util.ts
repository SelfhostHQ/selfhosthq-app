import prismaClient from 'prisma/prisma.server'
import { getUser } from './getUser.util'
import { PROJECT_PERMISSIONS } from '~/types'
import { ERROR_CODES } from '~/constants'

export async function checkProjectPermissions(
  request: Request,
  projectHandle: string,
  permissions: string[]
) {
  const user = await getUser(request)
  const project = await prismaClient.projects.findFirst({
    where: {
      handle: projectHandle,
    },
    include: {
      accesses: {
        where: {
          userId: user.id,
        },
      },
    },
  })

  console.log('Project:', project)
  if (!project)
    throw new Response('Project not found', { status: ERROR_CODES.NOT_FOUND })

  //check if any requested permission is allowed for this project
  let allowAccess = false
  const availablePermissions = project.accesses[0].permissions.split(',')

  if (!availablePermissions)
    throw new Response('Insufficient permissions to view this page', {
      status: ERROR_CODES.NOT_FOUND,
    })
  if (availablePermissions[0] == PROJECT_PERMISSIONS.FULL_ACCESS) return true
  for (let index = 0; index < permissions.length; index++) {
    const permission = permissions[index]
    if (availablePermissions?.indexOf(permission) != -1) allowAccess = true
  }

  return allowAccess
}
