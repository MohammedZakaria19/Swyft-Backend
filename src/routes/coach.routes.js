const express = require("express");
const requireAuth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../validators/validate");
const { respondMembershipSchema } = require("../validators/membership.validator");
const {
  getMyMemberships,
  respondToMembership,
} = require("../controllers/membership.controller");

const router = express.Router();

router.use(requireAuth, authorize("coach"));

router.get("/me/memberships", getMyMemberships);
router.patch(
  "/me/memberships/:id",
  validate(respondMembershipSchema),
  respondToMembership
);

module.exports = router;