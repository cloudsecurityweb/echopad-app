import * as licenseService from "../services/licenseAssignments.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const inviteUser = asyncHandler(async (req, res) => {
  try {
    console.log("Invite request body:", req.body);
    const data = await licenseService.sendInvite({
      tenantId: req.body.tenantId,
      ...req.body
    });
    res.status(201).json(
      new ApiResponse(201, { assignment: data }, "invite sent successfully")
    );
  } catch (err) {
    throw new ApiError(400, err.message);
  }
})

export const activate = asyncHandler(async (req, res) => {
  const {
    tenantId,
    licenceId,
    userId,
    email
  } = req.params;

  const assignment = await licenseService.activateLicense(
    licenceId,
    tenantId,
    {
      userId,
      email
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      { assignment },
      "license activated successfully"
    )
  );
});


export const revoke = asyncHandler(async (req, res) => {
  const { licenceId, tenantId } = req.params;
  console.log("Revoke license:", typeof licenceId, typeof tenantId);
  const data = await licenseService.revokeLicense(licenceId, tenantId);
  res.status(200).json(
    new ApiResponse(200, { assignment: data }, "license revoked successfully")
  );
})

export const getAssignmentsByTenant = asyncHandler(async (req, res) => {
  try {
    const data = await licenseService.getAssignmentsByTenant(req.params.tenantId);
    res.status(200).json(
      new ApiResponse(200, { assignments: data }, "license assignments fetched successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Failed to fetch license assignments");
  }
})