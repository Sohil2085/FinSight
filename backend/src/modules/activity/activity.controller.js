import prisma from "../../config/db.js";
import { successResponse, errorResponse } from "../../utils/response.js";

export const getActivityLogs = async (req, res) => {
  try {
    // Only Admin visibility is required by prompt: "Admin should be able to... View all activity logs"
    // Wait, the prompt says "Admin Visibility System... Create APIs: GET /activity", but also "Admin should be able to ... View all activity logs".
    if (req.user.role !== 'ADMIN') {
      return errorResponse(res, "Access Denied: Admins only", 403);
    }

    const logs = await prisma.activityLog.findMany({
      where: { companyId: req.user.companyId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });
    successResponse(res, "Activity logs fetched successfully", logs);
  } catch (error) {
    errorResponse(res, error.message);
  }
};
