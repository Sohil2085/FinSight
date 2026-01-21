import prisma from "../../config/db.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { generateToken } from "../../utils/jwt.js";

export const registerService = async (data) => {
  const { name, email, password, companyName, gstNumber } = data;

  const hashedPassword = await hashPassword(password);

  const company = await prisma.company.create({
    data: {
      name: companyName,
      gstNumber,
    },
  });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      companyId: company.id,
    },
  });

  return { user, company };
};

export const loginService = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const token = generateToken({
    userId: user.id,
    role: user.role,
    companyId: user.companyId,
  });

  return token;
};
