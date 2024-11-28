import { createUser, getUserById, getUserByEmail, updateUser, deleteUser } from "@/data-access/user";

export async function createUserUseCase(id: string, email: string, name?: string) {
    return await createUser(id, email, name);
}

export async function getUserByIdUseCase(id: string) {
    const user = await getUserById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

export async function getUserByEmailUseCase(email: string) {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

export async function updateUserUseCase(id: string, data: { name?: string; email?: string }) {
    const user = await getUserById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return await updateUser(id, data);
}

export async function deleteUserUseCase(id: string) {
    const user = await getUserById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return await deleteUser(id);
}
