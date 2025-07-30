import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "@/types";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string; // Add code property for Prisma errors
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";

  // Handle Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        statusCode = 409;
        message = "A record with this unique field already exists";
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;
      case "P2003":
        statusCode = 400;
        message = "Foreign key constraint failed";
        break;
      default:
        statusCode = 400;
        message = "Database operation failed";
    }
  } else if (error instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data provided";
  } else if (error instanceof PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Database operation failed";
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Handle validation errors
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
  }

  // Handle cast errors (usually from MongoDB, but keeping for consistency)
  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      statusCode,
      url: req.url,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};

// Custom error class
export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes
export class BadRequestError extends CustomError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = "Validation Failed") {
    super(message, 400);
  }
}
