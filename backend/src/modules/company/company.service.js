import prisma from "../../config/db.js";

export const getMyCompanyService = async (companyId) => {
  return prisma.company.findUnique({
    where: { id: companyId },
  });
};

export const updateMyCompanyService = async (companyId, data) => {
  const { name, gstNumber } = data;
  return prisma.company.update({
    where: { id: companyId },
    data: {
      name,
      gstNumber,
    },
  });
};
