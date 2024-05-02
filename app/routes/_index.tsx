import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import prismaClient from 'prisma/prisma.server'
import { getUser } from '~/utils/getUser.util'

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  //get all projects linked to this user
  const accesses = await prismaClient.projectAccess.findMany({
    where: {
      userId: user.id,
    },
    include: {
      project: true,
    },
  })
  const projects = accesses.map((access) => access.project)
  return json({ projects })
}
export default function Index() {
  const { projects } = useLoaderData<typeof loader>()
  return (
    <div className="bg-secondary min-h-screen flex justify-center items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between">
          <h2>Select a project</h2>

          <Link to="/new-project" className="text-primary">
            + Create a new project
          </Link>
        </div>
        {projects.length == 0 ? (
          <div className="text-center my-20">--No projects found--</div>
        ) : (
          <div className=" grid grid-cols-1 gap-4 my-10 lg:grid-cols-2">
            {projects.map((project) => (
              <Link key={project.id} to={`/${project.handle}`}>
                <div className=" py-3 px-2 bg-white rounded-lg">
                  <span className=" font-bold">{project.name}</span>
                  <br />
                  <span>{project.description}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
