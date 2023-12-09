'use server';

import {
  Prisma,
  asset,
  checklist,
  maintenance,
  subtask,
  task,
  user,
} from '@prisma/client';
import { UpdateTask } from '@/app/api/task/[uid]/route';
import { UpdateSubtask } from '@/app/api/subtask/[uid]/route';

import { cookies, headers } from 'next/headers';
import { MetadataUser, SignUpUser } from '@/utils/model/user';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Result } from '@/utils/function/result';
import { prisma } from '@/prisma/prisma';

export async function signIn(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      return redirect('/sign-in?message=Could not authenticate user');
    }

    redirect('/dashboard');
  } catch (error) {
    console.error(error, 'here?');
    return redirect('/dashboard');
  }
}

export async function signOut() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  supabase.auth.signOut();
  return redirect('/');
}

export async function signUp(newUser: SignUpUser) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const originSignUp = headers().get('origin');

  const { error } = await supabase.auth.signUp({
    email: newUser.email,
    password: newUser.password,
    phone: newUser.phone ?? '',
    options: {
      emailRedirectTo: `${originSignUp}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    redirect('/sign-in?message=Could not authenticate user');
  }

  const signUpResult = await signUpUser(newUser.name, originSignUp);
  if (signUpResult.statusCode !== 201) {
    redirect('/sign-in?message=Could not register user');
  }

  return redirect('/sign-in?message=Check email to continue sign in process');
}

async function signUpUser(name: string, originSignup: string | null) {
  if (!originSignup) alert('Origin is null');

  try {
    const response: Response = await fetch(`${originSignup}/api/sign-up`, {
      method: 'POST',
      body: JSON.stringify({ name: name }),
    });
    const result: Result<user> = await response.json();

    if (result.statusCode !== 201) {
      console.error(result.message);
      throw new Error(result.message);
    }

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function readUserSession() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  return supabase.auth.getSession();
}

export async function readUserInfo(): Promise<MetadataUser | null> {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      const user = await prisma.user.findUnique({
        where: { user_id: data.user.id },
      });

      if (user) {
        return {
          ...data.user,
          name: user.name,
          role: user.role ?? 'maintainer',
          department: user.department ?? 'management',
          email: data.user.email,
          userId: data.user.id,
        };
      }

      console.error('User not found in [public.user]');
      return null;
    } else {
      console.error('User not found [auth.user]');
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// asset

export async function fetchAssetList(): Promise<asset[]> {
  try {
    return await prisma.asset.findMany({
      orderBy: {
        updated_on: 'desc',
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

// maintenance

export async function fetchMaintenanceItemById(uid: string) {
  try {
    return await prisma.maintenance.findUnique({
      where: { uid },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchMaintenanceList(
  assetUid?: string,
): Promise<maintenance[]> {
  try {
    const filters: Prisma.maintenanceWhereInput[] = [];
    const orderBy: Prisma.maintenanceOrderByWithRelationInput[] = [];

    if (assetUid) {
      filters.push({
        asset_uid: assetUid,
      });
    }

    orderBy.push({
      date: 'desc',
    });

    return await prisma.maintenance.findMany({
      orderBy,
      where: {
        AND: filters,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// checklist

export async function createChecklist(data: checklist) {
  try {
    const newChecklist: checklist = await prisma.checklist.create({
      data,
    });

    return newChecklist;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchChecklistList(maintenance_uid?: string) {
  try {
    const filters: Prisma.checklistWhereInput[] = [];
    const orderBy: Prisma.checklistOrderByWithRelationInput[] = [];

    if (maintenance_uid) {
      filters.push({
        maintenance_uid,
      });
    }

    orderBy.push({
      title: 'asc',
    });

    return await prisma.checklist.findMany({
      orderBy,
      where: {
        AND: filters,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// checklist use

/**
 * fetch checklist use by asset
 * @param assetUid
 * @returns item of checklist
 */
export async function fetchChecklistUseList(uid: string) {
  try {
    return await prisma.checklist_use.findMany({
      where: { uid },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// checklist library

export async function fetchChecklistLibraryList() {
  try {
    return await prisma.checklist_library.findMany();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// task

export async function createTask(task: task): Promise<task | null> {
  try {
    const filters: Prisma.taskWhereInput[] = [
      { checklist_uid: task.checklist_uid },
    ];
    const orderBy: Prisma.taskOrderByWithRelationInput[] = [
      { task_order: 'desc' },
    ];

    const tasks: task[] = await prisma.task.findMany({
      orderBy: orderBy,
      where: {
        AND: filters,
      },
    });

    if (tasks.length === 0) {
      task.task_order = 1;
    } else {
      task.task_order = tasks[0].task_order + 1;
    }

    return await prisma.task.create({
      data: task,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * fetch task list
 * @returns @type {Result<task[]>} of task list
 */
export async function fetchTaskList(checklist_uid?: string): Promise<task[]> {
  try {
    const filters: Prisma.taskWhereInput[] = [];
    const orderBy: Prisma.taskOrderByWithRelationInput[] = [];

    orderBy.push({
      task_order: 'asc',
    });

    if (checklist_uid) {
      filters.push({
        checklist_uid,
      });
    }

    return await prisma.task.findMany({
      orderBy,
      where: {
        AND: filters,
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateTask(uid: string, data: UpdateTask) {
  try {
    return await prisma.task.update({
      where: { uid },
      data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// subtask

/**
 * fetch subtask list
 * @param task_uid
 * @returns @type {Result<subtask[]>} of subtask list
 */
export async function fetchSubtaskListByTaskUid(
  task_uid?: string,
): Promise<subtask[]> {
  try {
    const filters: Prisma.subtaskWhereInput[] = [];
    const orderBy: Prisma.subtaskOrderByWithRelationInput[] = [];

    if (task_uid) {
      filters.push({
        task_uid,
      });
    }

    orderBy.push({
      task_order: 'asc',
    });

    return await prisma.subtask.findMany({
      orderBy,
      where: {
        AND: filters,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateSubtask(uid: string, data: UpdateSubtask) {
  try {
    return await prisma.subtask.update({
      where: { uid },
      data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
