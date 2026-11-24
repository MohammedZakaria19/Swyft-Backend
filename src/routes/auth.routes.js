const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const validate = require("../validators/validate");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const requireAuth = require("../middlewares/auth.middleware");
const { getMe } = require("../controllers/user.controller");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", requireAuth, getMe);

module.exports = router;
