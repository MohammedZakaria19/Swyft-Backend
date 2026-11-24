const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(" ") || [];

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "يلزم تسجيل الدخول" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // token قديم من قبل إضافة الأدوار
    if (!payload.role) {
      return res.status(401).json({ message: "الرجاء تسجيل الدخول من جديد" });
    }

    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: "رمز الدخول غير صالح أو منتهي" });
  }
};

module.exports = requireAuth;