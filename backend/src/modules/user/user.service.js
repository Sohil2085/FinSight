import prisma from "../../config/db.js";

export const getMeService = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      company: {
        select: {
          id: true,
          name: true,
          gstNumber: true,
        },
      },
    },
  });
};
