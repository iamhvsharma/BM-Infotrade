import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { validateBody } from "@/middleware/validation.middleware";
import {
  loginSchema,
  signupSchema,
  changePasswordSchema,
} from "@/validators/auth.validator";
import { authenticateToken } from "@/middleware/auth.middleware";

const router: Router = Router();

// Public routes
router.post("/signup", validateBody(signupSchema), AuthController.signup);
router.post("/login", validateBody(loginSchema), AuthController.login);

// Protected routes
router.post("/logout", authenticateToken, AuthController.logout);
router.get("/profile", authenticateToken, AuthController.getProfile);
router.put("/profile", authenticateToken, AuthController.updateProfile);
router.put(
  "/change-password",
  authenticateToken,
  validateBody(changePasswordSchema),
  AuthController.changePassword
);

export default router;
