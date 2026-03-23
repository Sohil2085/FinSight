import { registerService, loginService, acceptInviteService } from "./auth.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import { logActivity } from "../activity/activity.service.js";

export const register = async (req, res) => {
  try {
    const result = await registerService(req.body);
    successResponse(res, "Company & Admin created", result);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginService(req.body.email, req.body.password);
    successResponse(res, "Login successful", result);
  } catch (err) {
    errorResponse(res, err.message, 401);
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const result = await acceptInviteService(req.body);
    await logActivity(result.user.id, result.user.companyId, "INVITE_ACCEPTED", "USER", result.user.id);
    successResponse(res, "Invite accepted and account created successfully", result);
  } catch (err) {
    errorResponse(res, err.message, 400);
  }
};
