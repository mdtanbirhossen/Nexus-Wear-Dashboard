// actions/categories.ts
'use server';

import { revalidatePath } from 'next/cache';

// Define types
interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  // Add other fields as needed
}

interface CategoriesResponse {
  data: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getAllCategories(
  params: GetCategoriesParams = {}
): Promise<CategoriesResponse> {
  try {
    const { page = 1, limit = 10, search, status } = params;

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) queryParams.append('search', search);
    if (status && status !== 'all') queryParams.append('status', status);

    // Make API call - replace with your actual API endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/category?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization if needed
          // 'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store', // or 'force-cache' depending on your needs
      }
    );
    console.log(response)

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

// Optional: Create category action
export async function createCategory(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as string;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, status }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create category');
    }

    const data = await response.json();
    
    // Revalidate the categories page
    revalidatePath('/categories');
    
    return { success: true, data };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

// Optional: Update category action
export async function updateCategory(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as string;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, status }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update category');
    }

    const data = await response.json();
    
    revalidatePath('/categories');
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

// Optional: Delete category action
export async function deleteCategory(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete category');
    }

    revalidatePath('/categories');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}