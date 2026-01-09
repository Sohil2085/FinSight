import { getMeService } from "./user.service.js";
import { successResponse } from "../../utils/response.js";

export const getMe = async (req, res) => {
  const user = await getMeService(req.user.userId);
  successResponse(res, "User profile", user);
};
