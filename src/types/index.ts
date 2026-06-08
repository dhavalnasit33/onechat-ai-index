// ─── User & Auth Types ───
export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface SingleResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// ─── Admin API Response Types ───
export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  total?: number;
  message?: string;
}

export interface ApiSingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
