'use server';

import { db } from '@/lib/db';
import { CreateContractorForm } from '@/lib/schemas/contractor.schema';
import { ServerResponseSchema } from '@/lib/schemas/server-response';
import { baseServerUrl } from '@/public/constant/url';

export async function createContractor(
  contractorData: CreateContractorForm,
  formData?: FormData,
) {
  try {
    let icon = null;

    if (formData) {
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

      icon = validateResponse.data.path;
    }

    return await db.contractor.create({
      data: {
        name: contractorData.name,
        icon,
        contractorTypeId: contractorData.contractorTypeId,
        contact: contractorData.contact,
        company: contractorData.company,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

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
