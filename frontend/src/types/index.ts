export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN"; // constrain role to known values
  createdAt: Date;
  updatedAt: Date;
}
