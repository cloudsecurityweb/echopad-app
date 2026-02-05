import express from "express";
import { createDummyInvite } from "../controllers/dummyController.js";
import { validateInvitation, acceptInvitationRoute, createUserInvite, acceptMagicInvitation, getPendingInvites, resendUserInvite } from "../controllers/invitationController.js";
import { requireRole } from "../middleware/entraAuth.js";
import { verifyAnyAuth, optionalAuth } from "../middleware/auth.js";
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
 * 
 * Note: Authentication is optional - if a token is provided, it will be verified.
 * The controller handles Microsoft auth requirements separately.
 */
router.post("/accept", optionalAuth, acceptInvitationRoute);

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
 * Supports: Microsoft, Google, Magic Link, and Email/Password authentication
 */
router.post("/user", verifyAnyAuth, requireRole(['ClientAdmin'], ['clientAdmin']), createUserInvite);

/**
 * GET /api/invites/pending
 * Get pending invitations for the current user's organization (ClientAdmin only)
 * Requires: Authorization header with Bearer token
 * Requires: ClientAdmin role
 */
router.get("/pending", verifyAnyAuth, requireRole(['ClientAdmin'], ['clientAdmin']), getPendingInvites);

/**
 * POST /api/invites/:inviteId/resend
 * Resend an invitation email (ClientAdmin only)
 * Requires: Authorization header with Bearer token
 * Requires: ClientAdmin role
 */
router.post("/:inviteId/resend", verifyAnyAuth, requireRole(['ClientAdmin'], ['clientAdmin']), resendUserInvite);

/**
 * POST /api/invites/dummy
 * Create a dummy invite (dev only)
 */
router.post("/dummy", devOnly, createDummyInvite);

export default router;
