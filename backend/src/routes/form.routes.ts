import { Router } from "express";
import { FormController } from "@/controllers/form.controller";
import {
  validateBody,
  validateQuery,
  validateParams,
} from "@/middleware/validation.middleware";
import {
  createFormSchema,
  updateFormSchema,
  formResponseSchema,
  paginationSchema,
  formSearchSchema,
  formResponseSearchSchema,
  exportOptionsSchema,
} from "@/validators/form.validator";
import { authenticateToken, requireUser } from "@/middleware/auth.middleware";
import { z } from "zod";

const router: Router = Router();

// Protected routes - require authentication
router.use(authenticateToken, requireUser);

// Form CRUD operations
router.post("/", validateBody(createFormSchema), FormController.createForm);
router.get(
  "/",
  validateQuery(paginationSchema),
  validateQuery(formSearchSchema),
  FormController.getForms
);
router.get(
  "/:formId",
  validateParams(z.object({ formId: z.string() })),
  FormController.getForm
);
router.put(
  "/:formId",
  validateParams(z.object({ formId: z.string() })),
  validateBody(updateFormSchema),
  FormController.updateForm
);
router.delete(
  "/:formId",
  validateParams(z.object({ formId: z.string() })),
  FormController.deleteForm
);
router.post(
  "/:formId/duplicate",
  validateParams(z.object({ formId: z.string() })),
  FormController.duplicateForm
);

// Form responses
router.get(
  "/:formId/responses",
  validateParams(z.object({ formId: z.string() })),
  validateQuery(paginationSchema),
  validateQuery(formResponseSearchSchema),
  FormController.getFormResponses
);

// Form statistics
router.get(
  "/:formId/statistics",
  validateParams(z.object({ formId: z.string() })),
  FormController.getFormStatistics
);

// Export responses
router.post(
  "/:formId/export",
  validateParams(z.object({ formId: z.string() })),
  validateBody(exportOptionsSchema),
  FormController.exportResponses
);

export default router;
