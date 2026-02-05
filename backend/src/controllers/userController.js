import { getContainer, isConfigured } from "../config/cosmosClient.js";
import { updateUser as updateUserService, getUsersByTenant, getUserById as getUserByIdService, updateUserProfile as updateUserProfileService } from "../services/userService.js";
import { createOrg, getOrgById, updateOrg } from "../services/organizationService.js";
import { randomUUID } from "crypto";
import { ORG_TYPES, ORG_STATUS } from "../models/organization.js";
import { USER_ROLES } from "../models/user.js";
import { getProductsForUser } from "../services/licenseService.js";

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

    // // Use tenant-scoped query, optionally filtered by organization
    // // ClientAdmins can only see users in their organization
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
 * GET /api/users/:id/products
 * Get products the specified user has access to, based on assigned licenses.
 * Requires authentication; users can view their own products, and admins can view
 * products for users in their tenant (with organization checks for ClientAdmins).
 */
export async function getUserProducts(req, res) {
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

    const isSelf = id === req.currentUser.id;
    const isAdmin =
      currentUserRole === USER_ROLES.SUPER_ADMIN ||
      currentUserRole === USER_ROLES.CLIENT_ADMIN;

    if (!isSelf && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You can only view your own products or must be an admin",
      });
    }

    // Fetch products derived from license assignments for this user
    const products = await getProductsForUser(id, tenantId);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching user products:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user products",
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
    const profileData = req.body;

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
    const isSelf = id === currentUser.id;
    const isAdmin = currentUser.role === USER_ROLES.SUPER_ADMIN || currentUser.role === USER_ROLES.CLIENT_ADMIN;

    if (!isSelf && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You can only update your own profile or must be an admin",
      });
    }

    const updatedUser = await updateUserProfileService(id, tenantId, currentUser.id, profileData);

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user profile",
      message: error.message,
    });
  }
}

export async function updateUserStatus(req, res) {
  // TODO: Implement user status update
  res.status(501).json({
    success: false,
    error: "Not Implemented",
  });
}
