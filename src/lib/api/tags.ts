const API_URL = 'http://localhost:5000/api';

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export const tagsApi = {
  async getTags(): Promise<Tag[]> {
    const response = await fetch(`${API_URL}/tags`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch tags');
    }

    const data = await response.json();
    return data.tags;
  },

  async createTag(data: { name: string; color?: string }): Promise<Tag> {
    const response = await fetch(`${API_URL}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create tag');
    }

    return response.json();
  },

  async updateTag(id: number, data: { name?: string; color?: string }): Promise<void> {
    const response = await fetch(`${API_URL}/tags/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update tag');
    }
  },

  async deleteTag(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/tags/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete tag');
    }
  },
}; 