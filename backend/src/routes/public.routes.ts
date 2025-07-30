import { Router } from "express";
import { PublicController } from "@/controllers/public.controller";
import {
  validateBody,
  validateParams,
} from "@/middleware/validation.middleware";
import { formResponseSchema } from "@/validators/form.validator";
import { z } from "zod";

const router: Router = Router();

// Public form access
router.get(
  "/form/:formId",
  validateParams(z.object({ formId: z.string() })),
  PublicController.getForm
);

// Form submission
router.post(
  "/form/:formId/submit",
  validateParams(z.object({ formId: z.string() })),
  validateBody(formResponseSchema),
  PublicController.submitForm
);

export default router;
