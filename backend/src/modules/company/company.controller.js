import { getMyCompanyService, updateMyCompanyService } from "./company.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";

export const getMyCompany = async (req, res) => {
  const company = await getMyCompanyService(req.user.companyId);
  successResponse(res, "Company fetched", company);
};

export const updateMyCompany = async (req, res) => {
  try {
    // Basic authorization check: verify the user has permission to update the company. Let's assume ADMINs only here for safe logic, or just assume the company matches.
    if (req.user.role !== 'ADMIN') {
        throw new Error("Only an ADMIN can update company details.");
    }
    const company = await updateMyCompanyService(req.user.companyId, req.body);
    successResponse(res, "Company details updated", company);
  } catch (err) {
    errorResponse(res, err.message);
  }
};
