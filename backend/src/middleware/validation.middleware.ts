import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError, ZodSchema } from "zod";
import { ApiResponse } from "@/types";

export const validateRequest = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate request body, query, and params
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Replace request data with validated data
      req.body = validatedData.body || req.body;
      req.query = validatedData.query || req.query;
      req.params = validatedData.params || req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errorMessages,
        });
        return;
      }

      console.error("Validation error:", error);
      res.status(500).json({
        success: false,
        error: "Validation processing failed",
      });
    }
  };
};

export const validateBody = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedBody = await schema.parseAsync(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errorMessages,
        });
        return;
      }

      console.error("Body validation error:", error);
      res.status(500).json({
        success: false,
        error: "Validation processing failed",
      });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedQuery = await schema.parseAsync(req.query);
      req.query = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          error: "Query validation failed",
          details: errorMessages,
        });
        return;
      }

      console.error("Query validation error:", error);
      res.status(500).json({
        success: false,
        error: "Validation processing failed",
      });
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedParams = await schema.parseAsync(req.params);
      req.params = validatedParams;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          error: "Parameter validation failed",
          details: errorMessages,
        });
        return;
      }

      console.error("Params validation error:", error);
      res.status(500).json({
        success: false,
        error: "Validation processing failed",
      });
    }
  };
};
