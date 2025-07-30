import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { authenticateToken } from "@/middleware/auth.middleware";

const router: Router = Router();

// All user routes require authentication
router.use(authenticateToken);

// User profile routes
router.get("/profile", UserController.getProfile);
router.put("/profile", UserController.updateProfile);

export default router;
