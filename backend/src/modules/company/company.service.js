import prisma from "../../config/db.js";
import { hashPassword } from "../../utils/hash.js";
import crypto from "crypto";
import { sendInviteEmail } from "../../utils/email.js";

export const getMyCompanyService = async (companyId) => {
  return prisma.company.findUnique({
    where: { id: companyId },
    include: { users: true, invites: true }
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

export const addMemberService = async (companyId, data) => {
  const { email, role, permissions } = data;
  
  // Temporary password logic
  const tempPassword = "password123";
  const hashedPassword = await hashPassword(tempPassword);

  return prisma.user.create({
    data: {
      name: email.split("@")[0],
      email,
      password: hashedPassword,
      role,
      permissions: permissions || {},
      companyId
    }
  });
};

export const inviteMemberService = async (companyId, data) => {
  const { email, role, permissions } = data;

  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { name: true }
  });

  const invite = await prisma.invite.create({
    data: {
      email,
      role,
      permissions: permissions || {},
      companyId,
      token,
      expiresAt,
    }
  });

  const appUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const inviteLink = `${appUrl}/invite?token=${token}`;

  // Fire and forget email logic
  sendInviteEmail(email, company.name, role, inviteLink).catch(err => console.error(err));

  return invite;
};
