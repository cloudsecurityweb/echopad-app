import express from "express";
import { createDummyInvite } from "../controllers/dummyController.js";
import { validateInvitation, acceptInvitationRoute, createUserInvite, acceptMagicInvitation } from "../controllers/invitationController.js";
import { verifyEntraToken, attachUserFromDb, requireRole } from "../middleware/entraAuth.js";
import { devOnly } from "../middleware/devOnly.js";

const router = express.Router();

/**
 * GET /api/invites/validate
 * Validate invitation token and email
 * Query: ?token=xxx&email=xxx
 * Note: Authentication optional - allows checking invite validity before sign-in
 */
router.get("/validate", validateInvitation);

/**
 * POST /api/invites/accept
 * Accept invitation and create user account
 * Body: { token, email, userId?, displayName?, authMethod }
 * 
 * For Microsoft auth (authMethod='microsoft'):
 * - Requires: Authorization header with Bearer token
 * - Validates: UserAdmin role in Entra ID token
 * 
 * For Google/email auth:
 * - Authentication optional (handled in controller)
 */
router.post("/accept", verifyEntraToken, attachUserFromDb, acceptInvitationRoute);

/**
 * POST /api/invites/accept-magic
 * Accept invitation via magic link (no authentication required)
 * Creates user account and returns magic session token
 * Body: { token, email }
 */
router.post("/accept-magic", acceptMagicInvitation);

/**
 * POST /api/invites/user
 * Create a user invitation (ClientAdmin only)
 * Body: { email, productId? }
 * Requires: Authorization header with Bearer token
 * Requires: ClientAdmin role
 */
router.post("/user", verifyEntraToken, attachUserFromDb, requireRole(['ClientAdmin'], ['clientAdmin']), createUserInvite);

/**
 * POST /api/invites/dummy
 * Create a dummy invite (dev only)
 */
router.post("/dummy", devOnly, createDummyInvite);

export default router;
