const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiOptions extends RequestInit {
  token?: string;
}

export class ApiClient {
  private static getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private static async handleResponse(response: Response) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  static async get(endpoint: string, options?: ApiOptions) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(options?.token),
      ...options,
    });

    return this.handleResponse(response);
  }

  static async post(endpoint: string, body?: any, options?: ApiOptions) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(options?.token),
      body: JSON.stringify(body),
      ...options,
    });

    return this.handleResponse(response);
  }

  static async put(endpoint: string, body?: any, options?: ApiOptions) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(options?.token),
      body: JSON.stringify(body),
      ...options,
    });

    return this.handleResponse(response);
  }

  static async delete(endpoint: string, options?: ApiOptions) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(options?.token),
      ...options,
    });

    return this.handleResponse(response);
  }
}

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string; level?: string }) =>
    ApiClient.post('/auth/register', data),

  login: (email: string, password: string) =>
    ApiClient.post('/auth/login', { email, password }),

  logout: (token: string) =>
    ApiClient.post('/auth/logout', {}, { token }),

  getUser: (token: string) =>
    ApiClient.get('/auth/user', { token }),
};

// Verbs API
export const verbsApi = {
  getAll: (token: string, page = 1) =>
    ApiClient.get(`/verbs?page=${page}`, { token }),

  getRandom: (token: string) =>
    ApiClient.get('/verbs/random', { token }),

  conjugate: (token: string, verbId: number, tense = 'presente') =>
    ApiClient.get(`/verbs/${verbId}/conjugate?tense=${tense}`, { token }),

  check: (token: string, data: { infinitive: string; tense: string; person: string; answer: string }) =>
    ApiClient.post('/verbs/check', data, { token }),
};

// Books API
export const booksApi = {
  getAll: (token: string, level?: string) =>
    ApiClient.get(`/books${level ? `?level=${level}` : ''}`, { token }),

  getById: (token: string, id: number) =>
    ApiClient.get(`/books/${id}`, { token }),

  translate: (token: string, bookId: number, word: string) =>
    ApiClient.post(`/books/${bookId}/translate`, { word }, { token }),
};

// Notes API
export const notesApi = {
  getAll: (token: string) =>
    ApiClient.get('/notes', { token }),

  getById: (token: string, id: number) =>
    ApiClient.get(`/notes/${id}`, { token }),

  create: (token: string, data: { title: string; content: string }) =>
    ApiClient.post('/notes', data, { token }),

  update: (token: string, id: number, data: { title?: string; content?: string }) =>
    ApiClient.put(`/notes/${id}`, data, { token }),

  delete: (token: string, id: number) =>
    ApiClient.delete(`/notes/${id}`, { token }),
};

// Vocabulary API
export const vocabularyApi = {
  getAll: (token: string) =>
    ApiClient.get('/vocabulary', { token }),

  add: (token: string, data: { word: string; translation: string; source_book_id?: number }) =>
    ApiClient.post('/vocabulary', data, { token }),

  getDue: (token: string, limit = 20) =>
    ApiClient.get(`/vocabulary/due?limit=${limit}`, { token }),

  review: (token: string, id: number, correct: boolean) =>
    ApiClient.post(`/vocabulary/${id}/review`, { correct }, { token }),

  getStats: (token: string) =>
    ApiClient.get('/vocabulary/stats', { token }),
};
