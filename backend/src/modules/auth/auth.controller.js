import { registerService, loginService } from "./auth.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";

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
    const token = await loginService(req.body.email, req.body.password);
    successResponse(res, "Login successful", { token });
  } catch (err) {
    errorResponse(res, err.message, 401);
  }
};
