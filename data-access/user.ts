import db from "@/lib/db";


export async function createUser(id: string, email: string, name?: string) {
  return await db.user.create({
    data: {
      id,
      email,
      name
    }
  })
}

export async function getUserById(id: string) {
  return await db.user.findUnique({
    where: {
      id
    }
  })
}

export async function getUserByEmail(email: string) {
  return await db.user.findUnique({
    where: {
      email
    }
  })
}

export async function updateUser(id: string, data: { name?: string; email?: string }) {
  return await db.user.update({
    where: {
      id
    },
    data
  })
}

export async function deleteUser(id: string) {
  return await db.user.delete({
    where: {
      id
    }
  })
}
