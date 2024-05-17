import { Access, FieldAccess } from "payload/types";

export interface User {
  id: string;
  name: string;
  roles: ("admin" | "student" | "faculty")[];
  email?: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  loginAttempts?: number;
  lockUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export const isAdmin: Access<any, User> = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes("admin"));
};

export const isFaculty: Access<any, User> = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes("faculty"));
};

export const isAdminFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({
  req: { user },
}) => {
  return Boolean(user?.roles?.includes("admin"));
};
