'use server';

import { db } from '@/lib/db';
import { ServerResponseSchema } from '@/lib/schemas/server-response';
import { baseServerUrl } from '@/public/constant/url';

export async function getContractors() {
  try {
    return await db.contractor.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        contractorType: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadContractorImage(id: string, formData: FormData) {
  try {
    const url = `${baseServerUrl}/contractor/upload`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    const validateResponse = ServerResponseSchema.safeParse(data);

    if (!validateResponse.success || !validateResponse.data.success) {
      throw new Error('Failed to upload image');
    }

    const icon = validateResponse.data.path;

    const updatedContractor = await db.contractor.update({
      where: { id },
      data: { icon },
    });

    return updatedContractor;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
