import { Router } from "express";
import { signupController, loginController, logoutController, getProfileController, updateProfileController, changePasswordController } from "@/controllers/auth.controller";
import { validateBody } from "@/middleware/validation.middleware";
import {
  loginSchema,
  signupSchema,
  changePasswordSchema,
} from "@/validators/auth.validator";
import { authenticateToken } from "@/middleware/auth.middleware";

const router: Router = Router();

// Public routes
router.post("/signup", validateBody(signupSchema), signupController);
router.post("/login", validateBody(loginSchema), loginController);

// Protected routes
router.post("/logout", authenticateToken, logoutController);
router.get("/profile", authenticateToken, getProfileController);
router.put("/profile", authenticateToken, updateProfileController);
router.put(
  "/change-password",
  authenticateToken,
  validateBody(changePasswordSchema),
  changePasswordController
);

export default router;
