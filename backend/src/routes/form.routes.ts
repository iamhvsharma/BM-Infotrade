import { Router } from "express";
import {
  createFormController,
  getFormsController,
  getFormController,
  updateFormController,
  deleteFormController,
  duplicateFormController,
  getFormResponsesController,
  getFormStatisticsController,
  exportResponsesController,
} from "@/controllers/form.controller";
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
router.post("/", validateBody(createFormSchema), createFormController);

router.get(
  "/",
  validateQuery(paginationSchema),
  validateQuery(formSearchSchema),
  getFormsController
);

router.get(
  "/:formId",
  validateParams(z.object({ formId: z.string() })),
  getFormController
);

router.put(
  "/:formId",
  validateParams(z.object({ formId: z.string() })),
  validateBody(updateFormSchema),
  updateFormController
);

router.delete(
  "/:formId",
  validateParams(z.object({ formId: z.string() })),
  deleteFormController
);

router.post(
  "/:formId/duplicate",
  validateParams(z.object({ formId: z.string() })),
  duplicateFormController
);

// Form responses
router.get(
  "/:formId/responses",
  validateParams(z.object({ formId: z.string() })),
  validateQuery(paginationSchema),
  validateQuery(formResponseSearchSchema),
  getFormResponsesController
);

// Form statistics
router.get(
  "/:formId/statistics",
  validateParams(z.object({ formId: z.string() })),
  getFormStatisticsController
);

// Export responses
router.post(
  "/:formId/export",
  validateParams(z.object({ formId: z.string() })),
  validateBody(exportOptionsSchema),
  exportResponsesController
);

export default router;