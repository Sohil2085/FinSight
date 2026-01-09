import prisma from "../../config/db.js";

export const getMyCompanyService = async (companyId) => {
  return prisma.company.findUnique({
    where: { id: companyId },
  });
};
