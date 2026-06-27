export interface Role {
  id: string;
  name: string;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  activeRole: Role;
  roles: Role[];
}
