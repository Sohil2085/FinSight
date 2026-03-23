import prisma from "../config/db.js";

export const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Allow ADMIN full access
      if (req.user.role === "ADMIN") {
        return next();
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { permissions: true }
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check specific permission
      const permissions = user.permissions || {};
      if (permissions[permissionName] === true) {
        return next();
      }

      return res.status(403).json({ message: "Access Denied" });
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
