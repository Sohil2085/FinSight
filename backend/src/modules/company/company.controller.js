import { getMyCompanyService } from "./company.service.js";
import { successResponse } from "../../utils/response.js";

export const getMyCompany = async (req, res) => {
  const company = await getMyCompanyService(req.user.companyId);
  successResponse(res, "Company fetched", company);
};
