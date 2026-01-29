import express from "express";
import {
  getAllUsers,
  getUserById,
  getUserProfile,
  createUser,
  updateUser,
  updateUserProfile,
  updateUserStatus,
  deleteUser,
} from "../controllers/userController.js";
import { createDummyUser } from "../controllers/dummyController.js";
import { devOnly } from "../middleware/devOnly.js";
import { verifyEntraToken, attachUserFromDb, requireRole } from "../middleware/entraAuth.js";

const router = express.Router();

/**
 * GET /api/users
 * List all users for the authenticated user's tenant
 * Requires: Authorization header with Bearer token
 * Requires: ClientAdmin or SuperAdmin role
 */
router.get("/", verifyEntraToken, attachUserFromDb, requireRole(['ClientAdmin', 'SuperAdmin'], ['clientAdmin', 'superAdmin']), getAllUsers);

/**
 * GET /api/users/profile/:tenantId/:userId
 * Get a user profile by tenant and user ID
 */
router.get("/profile/:tenantId/:userId", getUserProfile);

/**
 * GET /api/users/:id
 * Get a specific user by ID
 * Requires: Authorization header with Bearer token
 * Requires: ClientAdmin or SuperAdmin role
 */
router.get("/:id", verifyEntraToken, attachUserFromDb, requireRole(['ClientAdmin', 'SuperAdmin'], ['clientAdmin', 'superAdmin']), getUserById);

/**
 * POST /api/users
 * Create a new user
 * Requires: Authorization header with Bearer token
 * Requires: ClientAdmin or SuperAdmin role
 */
router.post("/", verifyEntraToken, attachUserFromDb, requireRole(['ClientAdmin', 'SuperAdmin'], ['clientAdmin', 'superAdmin']), createUser);

/**
 * POST /api/users/dummy
 * Create a dummy user (dev only)
 */
router.post("/dummy", devOnly, createDummyUser);

/**
 * PUT /api/users/:id
 * Update an existing user
 * Requires: Authorization header with Bearer token
 * Requires: ClientAdmin or SuperAdmin role
 */
router.put("/:id", verifyEntraToken, attachUserFromDb, requireRole(['ClientAdmin', 'SuperAdmin'], ['clientAdmin', 'superAdmin']), updateUser);

/**
 * PUT /api/users/:id/profile
 * Update user profile including organization details
 * Requires: Authorization header with Bearer token
 * Note: Users can update their own profile, admins can update any profile
 */
router.put("/:id/profile", verifyEntraToken, attachUserFromDb, updateUserProfile);

router.patch("/:userId/status", updateUserStatus);

/**
 * DELETE /api/users/:id
 * Delete a user by ID
 * Requires: Authorization header with Bearer token
 * Requires: SuperAdmin role
 */
router.delete("/:id", verifyEntraToken, attachUserFromDb, requireRole(['SuperAdmin'], ['superAdmin']), deleteUser);

export default router;
