import { getMyCompanyService, updateMyCompanyService, addMemberService, inviteMemberService } from "./company.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import { logActivity } from "../activity/activity.service.js";

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

export const addMember = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return errorResponse(res, "Only ADMIN can add members.", 403);
    }
    const newMember = await addMemberService(req.user.companyId, req.body);
    successResponse(res, "Member added successfully", newMember);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

export const inviteMember = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return errorResponse(res, "Only ADMIN can invite members.", 403);
    }
    const invite = await inviteMemberService(req.user.companyId, req.body);
    
    await logActivity(req.user.userId, req.user.companyId, "INVITE_SENT", "USER", invite.id);

    successResponse(res, "Invite sent successfully", { id: invite.id, email: invite.email, status: invite.status });
  } catch (err) {
    errorResponse(res, err.message);
  }
};
