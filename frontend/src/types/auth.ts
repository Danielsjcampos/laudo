
export type UserRole = 'admin' | 'clinic' | 'doctor' | 'patient';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}
