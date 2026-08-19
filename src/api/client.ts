/**
 * API client for the Book Store backend (FastAPI) - admin endpoints.
 */

// ---- API model types ----
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: number;
  title: string;
  description: string | null;
  price: number;
  duration: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface DashboardStats {
  total_users: number;
  total_products: number;
  total_services: number;
  total_contacts: number;
  active_products: number;
  active_services: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface MessageResponse {
  message: string;
}

export interface Paginated<T> {
  total: number;
  items: T[];
}

export interface BackupFile {
  database: string;
  exported_at: string;
  tables: Record<string, unknown[]>;
}

// ---- Request helper ----
const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/v1';

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
  isForm?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, isForm = false } = options;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: string | undefined;
  if (body !== undefined) {
    if (isForm) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      payload = new URLSearchParams(body as Record<string, string>).toString();
    } else {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { method, headers, body: payload });
  } catch (err) {
    throw new Error('Cannot reach the server. Is the backend running on port 8000?');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    let message: string = data.detail;
    if (Array.isArray(message)) {
      message = message.map((e: { msg: string }) => e.msg).join(', ');
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { username: email, password },
      isForm: true,
    }),
  getMe: (token: string | null) => request<User>('/auth/me', { token }),

  // Dashboard
  getStats: (token: string | null) => request<DashboardStats>('/dashboard/stats', { token }),

  // Products CRUD
  listProducts: (token: string | null) => request<Paginated<Product>>('/products', { token }),
  createProduct: (payload: Omit<Product, 'id' | 'created_at' | 'is_active'>, token: string | null) =>
    request<Product>('/products', { method: 'POST', body: payload, token }),
  updateProduct: (id: number, payload: Partial<Product>, token: string | null) =>
    request<Product>(`/products/${id}`, { method: 'PUT', body: payload, token }),
  deleteProduct: (id: number, token: string | null) =>
    request<MessageResponse>(`/products/${id}`, { method: 'DELETE', token }),

  // Services CRUD
  listServices: (token: string | null) => request<Paginated<Service>>('/services', { token }),
  createService: (payload: Omit<Service, 'id' | 'created_at' | 'is_active'>, token: string | null) =>
    request<Service>('/services', { method: 'POST', body: payload, token }),
  updateService: (id: number, payload: Partial<Service>, token: string | null) =>
    request<Service>(`/services/${id}`, { method: 'PUT', body: payload, token }),
  deleteService: (id: number, token: string | null) =>
    request<MessageResponse>(`/services/${id}`, { method: 'DELETE', token }),

  // Users
  listUsers: (token: string | null) => request<Paginated<User>>('/users', { token }),
  updateUser: (id: number, payload: { role?: string; is_active?: boolean }, token: string | null) =>
    request<User>(`/users/${id}`, { method: 'PATCH', body: payload, token }),

  // Contacts
  listContacts: (token: string | null) => request<Paginated<Contact>>('/contacts', { token }),
  deleteContact: (id: number, token: string | null) =>
    request<MessageResponse>(`/contacts/${id}`, { method: 'DELETE', token }),

  // Database backup / import
  backupDatabase: (token: string | null) => request<BackupFile>('/admin/backup', { token }),
  importDatabase: (payload: BackupFile, token: string | null) =>
    request<MessageResponse>('/admin/import', { method: 'POST', body: payload, token }),
};

export default api;
