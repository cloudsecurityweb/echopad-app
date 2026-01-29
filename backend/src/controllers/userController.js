import { getContainer, isConfigured } from "../config/cosmosClient.js";
import { updateUser as updateUserService, getUsersByTenant, getUserById as getUserByIdService, updateUserStatus as updateUserStatusService } from "../services/userService.js";
import { createOrg, getOrgById, updateOrg } from "../services/organizationService.js";
import { randomUUID } from "crypto";
import { ORG_TYPES, ORG_STATUS } from "../models/organization.js";
import { USER_ROLES } from "../models/user.js";

/**
 * GET /api/users
 * List all users for the authenticated user's tenant
 * Requires: Authorization header with Bearer token
 */
export async function getAllUsers(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }
  
  try {
    // Get tenantId from current user (loaded by attachUserFromDb)
    if (!req.currentUser || !req.currentUser.tenantId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "User information not available",
      });
    }

    const tenantId = req.currentUser.tenantId;
    const userRole = req.currentUser.role;

    // Use tenant-scoped query, optionally filtered by organization
    // ClientAdmins can only see users in their organization
    const organizationId = (userRole === 'clientAdmin' && req.currentUser.organizationId) 
      ? req.currentUser.organizationId 
      : null;
    
    const users = await getUsersByTenant(tenantId, null, organizationId);
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
      message: error.message,
    });
  }
}

/**
 * GET /api/users/:id
 * Get a specific user by ID
 */
export async function getUserById(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }
  
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    if (!req.currentUser || !req.currentUser.tenantId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "User information not available",
      });
    }

    const tenantId = req.currentUser.tenantId;
    const currentUserRole = req.currentUser.role;

    // Check if user is trying to access their own profile or is an admin
    if (id !== req.currentUser.id && currentUserRole !== 'superAdmin' && currentUserRole !== 'clientAdmin') {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You can only view your own profile or must be an admin",
      });
    }

    // ClientAdmins can only see users in their organization
    if (currentUserRole === 'clientAdmin' && id !== req.currentUser.id) {
      // We'll check organization after fetching the user
    }

    // Try to find user across all role containers
    const USER_ROLES = (await import('../models/user.js')).USER_ROLES;
    const roles = [USER_ROLES.SUPER_ADMIN, USER_ROLES.CLIENT_ADMIN, USER_ROLES.USER];
    let user = null;
    
    for (const role of roles) {
      try {
        user = await getUserByIdService(id, tenantId, role);
        if (user) break;
      } catch (error) {
        if (error.code !== 404) {
          console.warn(`Error searching ${role} container:`, error.message);
        }
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Organization isolation check for ClientAdmins
    if (currentUserRole === 'clientAdmin' && id !== req.currentUser.id) {
      if (user.organizationId !== req.currentUser.organizationId) {
        return res.status(403).json({
          success: false,
          error: "Forbidden",
          message: "You can only view users in your organization",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
      message: error.message,
    });
  }
}

/**
 * GET /api/users/profile/:tenantId/:userId
 * Get a user profile by tenant and user ID
 */
export async function getUserProfile(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }

  try {
    const { tenantId, userId } = req.params;
    if (!tenantId || !userId) {
      return res.status(400).json({
        success: false,
        error: "tenantId and userId are required",
      });
    }

    const user = await getUserByIdService(userId, tenantId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user profile",
      message: error.message,
    });
  }
}

/**
 * POST /api/users
 * Create a new user
 */
export async function createUser(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }
  
  try {
    const userData = req.body;

    // Basic validation
    if (!userData.id) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const container = getContainer();
    if (!container) {
      return res.status(503).json({
        success: false,
        error: "CosmosDB not available",
      });
    }

    // Add timestamp if not provided
    if (!userData.createdAt) {
      userData.createdAt = new Date().toISOString();
    }
    userData.updatedAt = new Date().toISOString();

    // Create item in CosmosDB
    const { resource } = await container.items.create(userData);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: resource,
    });
  } catch (error) {
    if (error.code === 409) {
      return res.status(409).json({
        success: false,
        error: "User already exists",
        message: error.message,
      });
    }
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create user",
      message: error.message,
    });
  }
}

/**
 * PUT /api/users/:id
 * Update an existing user
 */
export async function updateUser(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }
  
  try {
    const { id } = req.params;
    const userData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const container = getContainer();
    if (!container) {
      return res.status(503).json({
        success: false,
        error: "CosmosDB not available",
      });
    }

    // Ensure the ID in the body matches the URL parameter
    if (userData.id && userData.id !== id) {
      return res.status(400).json({
        success: false,
        error: "User ID in body must match URL parameter",
      });
    }

    // Set the ID if not provided
    userData.id = id;
    userData.updatedAt = new Date().toISOString();

    // Replace the item in CosmosDB
    const { resource } = await container.item(id, id).replace(userData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: resource,
    });
  } catch (error) {
    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user",
      message: error.message,
    });
  }
}

/**
 * PUT /api/users/:id/profile
 * Update user profile including organization details
 * Body: { displayName?, email?, organizationName? }
 */
export async function updateUserProfile(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }
  
  try {
    const { id } = req.params;
    const { displayName, email, organizationName } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    if (!req.currentUser) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "User information not available",
      });
    }

    // Verify the user is updating their own profile or is an admin
    const currentUser = req.currentUser;
    const isOwnProfile = id === currentUser.id;
    const isAdmin = currentUser.role === USER_ROLES.SUPER_ADMIN || currentUser.role === USER_ROLES.CLIENT_ADMIN;
    
    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You can only update your own profile or must be an admin",
      });
    }

    // Get the user being updated (use currentUser if updating own profile, otherwise fetch)
    let user = isOwnProfile ? currentUser : null;
    
    if (!isOwnProfile) {
      // Admin updating another user - fetch that user
      const tenantId = currentUser.tenantId;
      const roles = [USER_ROLES.SUPER_ADMIN, USER_ROLES.CLIENT_ADMIN, USER_ROLES.USER];
      for (const role of roles) {
        try {
          user = await getUserByIdService(id, tenantId, role);
          if (user) break;
        } catch (error) {
          // Continue searching
        }
      }
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // ClientAdmins can only update users in their organization
      if (currentUser.role === USER_ROLES.CLIENT_ADMIN) {
        if (user.organizationId !== currentUser.organizationId) {
          return res.status(403).json({
            success: false,
            error: "Forbidden",
            message: "You can only update users in your organization",
          });
        }
      }
    }

    // Only ClientAdmin can update organization name
    if (organizationName && user.role !== USER_ROLES.CLIENT_ADMIN && user.role !== USER_ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "Only Client Admins can update organization name",
      });
    }

    const updates = {};
    let organization = null;

    // Update display name if provided
    if (displayName && displayName.trim()) {
      updates.displayName = displayName.trim();
    }

    // Update email if provided (only for non-OAuth users or if allowed)
    if (email && email.trim()) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          error: "Invalid email format",
        });
      }
      updates.email = email.toLowerCase().trim();
    }

    // Handle organization update/creation
    if (organizationName && organizationName.trim()) {
      if (user.organizationId) {
        // Update existing organization
        organization = await updateOrg(
          user.organizationId,
          user.tenantId,
          { name: organizationName.trim() },
          id
        );
      } else {
        // Create new organization
        const orgId = `org_${randomUUID()}`;
        organization = await createOrg({
          id: orgId,
          tenantId: user.tenantId,
          name: organizationName.trim(),
          type: ORG_TYPES.CLIENT,
          status: ORG_STATUS.ACTIVE,
        }, id);
        updates.organizationId = orgId;
      }
    }

    // Update user if there are any changes
    if (Object.keys(updates).length > 0) {
      await updateUserService(id, user.tenantId, updates, id, user.role);
    }

    // Get updated user (use the role we already know)
    const updatedUser = await getUserByIdService(id, user.tenantId, user.role);
    
    // Get organization if it exists
    if (updatedUser.organizationId) {
      organization = await getOrgById(updatedUser.organizationId, user.tenantId);
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          displayName: updatedUser.displayName,
          role: updatedUser.role,
          status: updatedUser.status,
          organizationId: updatedUser.organizationId,
        },
        organization: organization ? {
          id: organization.id,
          name: organization.name,
          type: organization.type,
          status: organization.status,
        } : null,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update profile",
      message: error.message,
    });
  }
}

/**
 * PATCH /api/users/:userId/status
 * Update user status (requires tenant context)
 */
export async function updateUserStatus(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }

  try {
    const { userId } = req.params;
    const { status, tenantId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const effectiveTenantId = req.currentUser?.tenantId || tenantId;
    if (!effectiveTenantId) {
      return res.status(400).json({
        success: false,
        error: "tenantId is required",
      });
    }

    if (req.currentUser) {
      const isAdmin = req.currentUser.role === USER_ROLES.SUPER_ADMIN || req.currentUser.role === USER_ROLES.CLIENT_ADMIN;
      const isSelf = req.currentUser.id === userId;
      if (!isAdmin && !isSelf) {
        return res.status(403).json({
          success: false,
          error: "Forbidden",
          message: "You can only update your own status or must be an admin",
        });
      }
    }

    const updatedUser = await updateUserStatusService(effectiveTenantId, userId, status);

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: {
        id: updatedUser.id,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    console.error("Error updating user status:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update user status",
      message: error.message,
    });
  }
}

/**
 * DELETE /api/users/:id
 * Delete a user by ID
 */
export async function deleteUser(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }
  
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    if (!req.currentUser) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "User information not available",
      });
    }

    const currentUser = req.currentUser;
    const tenantId = currentUser.tenantId;

    // Only SuperAdmin can delete users
    if (currentUser.role !== USER_ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "Only SuperAdmins can delete users",
      });
    }

    // Get user to find which container they're in
    const roles = [USER_ROLES.SUPER_ADMIN, USER_ROLES.CLIENT_ADMIN, USER_ROLES.USER];
    let user = null;
    let userRole = null;
    
    for (const role of roles) {
      try {
        user = await getUserByIdService(id, tenantId, role);
        if (user) {
          userRole = role;
          break;
        }
      } catch (error) {
        // Continue searching
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Delete from the appropriate container
    const { getContainerNameByRole } = await import('../models/user.js');
    const containerName = getContainerNameByRole(userRole);
    const container = getContainer(containerName);
    
    if (!container) {
      return res.status(503).json({
        success: false,
        error: "CosmosDB not available",
      });
    }

    // Delete the item from CosmosDB
    await container.item(id, tenantId).delete();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete user",
      message: error.message,
    });
  }
}
