export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'admin' | 'profesor' | 'estudiante';
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}