import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "@/types";
import { ApiResponse } from "@/types";
import prisma from "@/config/database";
import { JWT_SECRET, JWT_EXPIRES_IN } from "@/config/envConfig";


export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    console.log("🔍 Debug: Auth header:", authHeader);
    console.log(
      "🔍 Debug: Extracted token:",
      token ? `${token.substring(0, 20)}...` : "NO_TOKEN"
    );

    if (!token) {
      res.status(401).json({
        success: false,
        error: "Access token is required",
      });
      return;
    }

    console.log(
      "🔍 Debug: Attempting to verify token with secret:",
      JWT_SECRET
    );

    // Verify JWT token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      console.log("🔍 Debug: Token verified successfully, decoded:", {
        userId: decoded.userId,
        email: decoded.email,
      });
    } catch (jwtError) {
      console.error("🔍 Debug: JWT verification failed:", jwtError);
      res.status(401).json({
        success: false,
        error: "Invalid token",
      });
      return;
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      console.log(
        "🔍 Debug: User not found in database for userId:",
        decoded.userId
      );
      res.status(401).json({
        success: false,
        error: "Invalid token - user not found",
      });
      return;
    }

    console.log("🔍 Debug: User found in database:", {
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Attach user to request (password is excluded for security)
    req.user = user as any;
    next();
  } catch (error) {
    console.error("🔍 Debug: JWT Verification Error:", error);
    console.error("🔍 Debug: Error name:", (error as any).name);
    console.error("🔍 Debug: Error message:", (error as any).message);

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: "Invalid token",
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: "Token expired",
      });
      return;
    }

    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(["ADMIN"]);
export const requireUser = requireRole(["USER", "ADMIN"]);
