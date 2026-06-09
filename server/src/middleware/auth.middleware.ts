import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check header first, then cookie as fallback
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.token;

  if (!token) {
    throw new AppError(401, "No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; email: string };
    (req as any).user = decoded;
    next();
  } catch (error) {
    throw new AppError(401, "Invalid or expired token");
  }
};
