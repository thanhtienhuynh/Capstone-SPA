export interface User {
  id?: number;
  fullname?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  roleId?: number;
  provinceName: string;
  gender: number;
  isActive?: boolean;
}
