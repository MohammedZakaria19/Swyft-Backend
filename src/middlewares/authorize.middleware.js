// بيستخدم بعد requireAuth: authorize("academy_owner", "admin")
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "ليس لديك صلاحية لهذا الإجراء" });
  }
  next();
};

module.exports = authorize;