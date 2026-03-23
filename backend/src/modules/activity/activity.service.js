import prisma from "../../config/db.js";

export const logActivity = async (userId, companyId, action, entity, entityId) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        companyId,
        action,
        entity,
        entityId
      }
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
