const API_URL = 'http://localhost:5000/api';

export interface Contact {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  country_code?: string;
  whatsapp_number?: string;
  company?: string;
  avatar_url?: string;
  notes?: string;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface ContactsResponse {
  contacts: Contact[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export const contactsApi = {
  async getContacts(params: {
    page?: number;
    per_page?: number;
    search?: string;
    tag_id?: number;
  } = {}): Promise<ContactsResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.tag_id) searchParams.append('tag_id', params.tag_id.toString());

    const response = await fetch(`${API_URL}/contacts?${searchParams.toString()}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch contacts');
    }

    return response.json();
  },

  async getContact(id: number): Promise<Contact> {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch contact');
    }

    return response.json();
  },

  async createContact(data: Partial<Contact> & { name: string }): Promise<Contact> {
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create contact');
    }

    return response.json();
  },

  async updateContact(id: number, data: Partial<Contact>): Promise<Contact> {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update contact');
    }

    return response.json();
  },

  async deleteContact(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete contact');
    }
  },
}; 