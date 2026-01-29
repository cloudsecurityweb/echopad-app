import * as clientService from "../services/clients.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getClients = asyncHandler(async (req, res) => {
  try {
    const { limit = 20, token } = req.query;
    const data = await clientService.getClients(Number(limit), token);
    res.status(200).json(
      new ApiResponse(200, { clients: data }, "clients fetched successfully")
    )
  } catch (err) {
    throw new ApiError(500, 'Failed to fetch clients');
  }
})

export const addClient = asyncHandler(async (req, res) => {
  try {
    const client = await clientService.addClient(req.body);
    res.status(201).json(
      new ApiResponse(201, { client }, "client added successfully")
    );
  } catch (err) {
    throw new ApiError(400, err.message);
  }
})
