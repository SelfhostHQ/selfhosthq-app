import {} from 'bun'
import prismaClient from 'prisma/prisma.server'
import bcrypt from 'bcrypt'
const readInput = async (cmd?: string, required?: boolean) => {
  if (cmd) process.stdout.write(cmd)
  for await (const line of console) {
    if (required && !line) {
      {
        console.warn(`${cmd} is required`)
        continue
      }
    }
    return line
  }
}

console.log("Let's setup a user on your SelfhostHQ instance!")

const name = await readInput('Name: ', true)
const email = await readInput('Email: ', true)
const password = await readInput('Password: ', true)

const hashedPassword = bcrypt.hashSync(password!, 10)

//create a user
await prismaClient.users.create({
  data: {
    name: name!,
    password: hashedPassword,
    email: email!,
  },
})
