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

  /* eslint-disable no-unused-vars */
  const { password: _, ...userWithoutPassword } = user;
  /* eslint-enable no-unused-vars */

  const token = generateToken({
    userId: user.id,
    role: user.role,
    companyId: user.companyId,
  });

  return { user: userWithoutPassword, company, token };
};

export const loginService = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { company: true }  // Include company details
  });
  if (!user) throw new Error("User not found");

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  /* eslint-disable no-unused-vars */
  const { password: _, ...userWithoutPassword } = user;
  /* eslint-enable no-unused-vars */

  const token = generateToken({
    userId: user.id,
    role: user.role,
    companyId: user.companyId,
  });

  return { token, user: userWithoutPassword };
};

export const acceptInviteService = async (data) => {
  const { token, name, password } = data;

  const invite = await prisma.invite.findUnique({ where: { token } });

  if (!invite) throw new Error("Invalid invite token");
  if (invite.status !== "PENDING") throw new Error("Invite is already used or expired");
  if (new Date() > invite.expiresAt) {
    await prisma.invite.update({ where: { id: invite.id }, data: { status: "EXPIRED" } });
    throw new Error("Invite token has expired");
  }

  const hashedPassword = await hashPassword(password);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email: invite.email,
        password: hashedPassword,
        role: invite.role,
        permissions: invite.permissions,
        companyId: invite.companyId,
      }
    });

    await tx.invite.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED" }
    });

    return user;
  });

  /* eslint-disable no-unused-vars */
  const { password: _, ...userWithoutPassword } = result;
  /* eslint-enable no-unused-vars */

  const jwtToken = generateToken({
    userId: result.id,
    role: result.role,
    companyId: result.companyId,
  });

  return { token: jwtToken, user: userWithoutPassword };
};
