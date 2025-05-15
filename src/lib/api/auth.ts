const API_URL = 'http://localhost:5000/api';

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  countryCode: string;
  whatsappNumber: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  name: string;
}

export const authApi = {
  async signup(data: SignupData): Promise<{ user: User }> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to sign up');
    }

    return response.json();
  },

  async login(data: LoginData): Promise<{ user: User }> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to login');
    }

    return response.json();
  },
}; 