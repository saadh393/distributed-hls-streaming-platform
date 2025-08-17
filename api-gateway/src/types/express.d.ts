import { JwtPayload } from "jsonwebtoken";

export interface UserType {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserType | JwtPayload;
    }
  }
}

export {};
