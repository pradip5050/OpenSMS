export function isStudent(roles: string) {
  return roles === "student";
}

export function isFaculty(roles: string) {
  return roles === "faculty";
}

export function isAdmin(roles: string) {
  return roles === "admin";
}

export function isFacultyOrAdmin(roles: string) {
  return isFaculty(roles) || isAdmin(roles);
}
