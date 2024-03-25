'use server';

import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { AdminUpdateUser, CreateUserAdminForm } from '@/lib/schemas/user';

import {
  ResultSchema,
  ServerResponseSchema,
} from '@/lib/schemas/server-response';
import { RegisterForm } from '../lib/schemas/auth';
import { Department, Role } from '@prisma/client';
import { baseServerUrl } from '@/public/constant/url';

export async function createUser(
  name: string,
  email: string,
  unhashedPassword: string,
) {
  try {
    const password = await hash(unhashedPassword, 10);

    return await db.user.create({
      data: {
        name,
        email,
        password,
        phone: '',
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function adminCreateUser(
  createUser: CreateUserAdminForm,
  role: Role,
  department: Department,
) {
  try {
    const password = await hash(createUser.password, 10);

    return await db.user.create({
      data: {
        name: createUser.name,
        email: createUser.email,
        phone: createUser.phone,
        password,
        department,
        role,
        emailVerified: new Date(),
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function adminApproveUser(id: string, adminId: string) {
  try {
    await db.history.create({
      data: {
        actionBy: adminId,
        activity: `Approved ${id}`,
        historyMeta: 'USER',
      },
    });

    return await db.user.update({
      where: { id },
      data: { emailVerified: new Date() },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function adminRejectUser(id: string, adminId: string) {
  try {
    await db.history.create({
      data: {
        actionBy: adminId,
        activity: `Rejected ${id}`,
        historyMeta: 'USER',
      },
    });

    return await db.user.update({
      where: { id },
      data: {
        isRejected: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function adminBlockUser(id: string) {
  try {
    return await db.user.update({
      where: { id },
      data: {
        isBlocked: true,
        emailVerified: undefined,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function adminUpdateUser(data: AdminUpdateUser) {
  try {
    const { id, departmentId, role } = data;

    return await db.user.update({
      where: { id },
      data: {
        departmentId,
        role,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function registerUser(registerForm: RegisterForm) {
  try {
    const { password, email, phone, name } = registerForm;
    const hashedPassword = await hash(password, 10);

    return await db.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchUserList() {
  try {
    return await db.user.findMany({
      orderBy: {
        name: 'asc',
      },
      where: {
        id: {
          not: '-99',
        },
        role: {
          not: 'ADMIN',
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadUserImage(userId: string, formData: FormData) {
  try {
    const url = `${baseServerUrl}/user/upload`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    const validateResponse = ServerResponseSchema.safeParse(data);

    if (!validateResponse.success || !validateResponse.data.success) {
      throw new Error('Failed to upload image');
    }

    const image = validateResponse.data.path;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { image },
    });

    revalidatePath(`/user/${userId}`);
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUserImage(userId: string) {
  try {
    const userImage = await db.user.findUniqueOrThrow({
      where: { id: userId },
      select: { image: true },
    });

    if (!userImage.image) {
      throw new Error('User does not have an image');
    }

    const url = new URL('/user/delete', baseServerUrl);
    url.searchParams.append('filename', userImage.image);

    const response = await (await fetch(url, { method: 'DELETE' })).json();
    const validateResponse = ResultSchema.safeParse(response);

    if (!validateResponse.success) {
      throw new Error(validateResponse.error.message);
    }

    const { success, message } = validateResponse.data;

    if (!success) {
      console.error(message);
      throw new Error(message);
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { image: null },
    });

    revalidatePath(`/user/${userId}`);
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
