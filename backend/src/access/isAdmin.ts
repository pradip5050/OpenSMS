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

export const isAdmin = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes("admin"));
};

export const isFaculty = ({ req: { user } }) => {
  return Boolean(user?.roles.includes("faculty"));
};

export const isAdminOrFaculty = ({ req: { user } }) => {
  return Boolean(
    user?.roles.includes("faculty") || user?.roles.includes("admin")
  );
};

export const isAdminFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({
  req: { user },
}) => {
  return Boolean(user?.roles?.includes("admin"));
};
