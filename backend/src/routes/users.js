import express from "express";
import {
  getAllUsers,
  getUserById,
  getUserProfile,
  getUserProducts,
  createUser,
  updateUser,
  deleteUser,
  updateUserProfile,
  updateUserStatus,
} from "../controllers/userController.js";
import { createDummyUser } from "../controllers/dummyController.js";
import { devOnly } from "../middleware/devOnly.js";
import { verifyAnyAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/entraAuth.js";

const router = express.Router();

/**
 * GET /api/users
 * List all users for the authenticated user's tenant
 * Requires: Authorization header with Bearer token
 * Requires: ClientAdmin or SuperAdmin role
 * Supports: Microsoft, Google, Magic Link, and Email/Password authentication
 */
router.get("/", verifyAnyAuth, requireRole(['ClientAdmin', 'SuperAdmin'], ['clientAdmin', 'superAdmin']), getAllUsers);

/**
z * GET /api/users/profile/:tenantId/:userId
 * Get a user profile by tenant and user ID
 */
router.get("/profile/:tenantId/:userId", getUserProfile);

/**
 * GET /api/users/:id/products
 * Get products assigned to a specific user (license-based access)
 * Requires authentication; users can view their own products, admins can view
 * products for users in their tenant.
 * Supports: Microsoft, Google, Magic Link, and Email/Password authentication
 */
router.get(
  "/:id/products",
  verifyAnyAuth,
  getUserProducts
);

/**
 * GET /api/users/:id
 * Get a specific user by ID
 * Requires: Authorization header with Bearer token
 * Requires: ClientAdmin or SuperAdmin role
 * Supports: Microsoft, Google, Magic Link, and Email/Password authentication
 */
router.get("/:id", verifyAnyAuth, requireRole(['ClientAdmin', 'SuperAdmin'], ['clientAdmin', 'superAdmin']), getUserById);

/**
 * POST /api/users
 * Create a new user
 * Requires: Authorization header with Bearer token
 * Requires: ClientAdmin or SuperAdmin role
 * Supports: Microsoft, Google, Magic Link, and Email/Password authentication
 */
router.post("/", verifyAnyAuth, requireRole(['ClientAdmin', 'SuperAdmin'], ['clientAdmin', 'superAdmin']), createUser);

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
 * Supports: Microsoft, Google, Magic Link, and Email/Password authentication
 */
router.put("/:id", verifyAnyAuth, requireRole(['ClientAdmin', 'SuperAdmin'], ['clientAdmin', 'superAdmin']), updateUser);

/**
 * PUT /api/users/:id/profile
 * Update user profile including organization details
 * Requires: Authorization header with Bearer token
 * Note: Users can update their own profile, admins can update any profile
 * Supports: Microsoft, Google, Magic Link, and Email/Password authentication
 */
router.put("/:id/profile", verifyAnyAuth, updateUserProfile);

router.patch("/:userId/status", updateUserStatus);

/**
 * DELETE /api/users/:id
 * Delete a user by ID
 * Requires: Authorization header with Bearer token
 * Requires: SuperAdmin role
 * Supports: Microsoft, Google, Magic Link, and Email/Password authentication
 */
router.delete("/:id", verifyAnyAuth, requireRole(['SuperAdmin'], ['superAdmin']), deleteUser);

export default router;
