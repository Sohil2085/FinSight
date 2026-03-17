import { getMeService, updateUserService } from "./user.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";

export const getMe = async (req, res) => {
  const user = await getMeService(req.user.userId);
  successResponse(res, "User profile", user);
};

export const updateUser = async (req, res) => {
  try {
    const user = await updateUserService(req.user.userId, req.body);
    successResponse(res, "User profile updated", user);
  } catch (err) {
    errorResponse(res, err.message);
  }
};
