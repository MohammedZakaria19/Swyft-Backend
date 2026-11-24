const express = require("express");
const requireAuth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../validators/validate");
const {
  createAcademySchema,
  updateAcademySchema,
} = require("../validators/academy.validator");
const { inviteCoachSchema } = require("../validators/membership.validator");
const {
  createAcademy,
  getMyAcademies,
  getAcademyById,
  updateAcademy,
} = require("../controllers/academy.controller");
const {
  inviteCoach,
  listAcademyCoaches,
} = require("../controllers/membership.controller");
const { listAcademyGroups } = require("../controllers/group.controller");

const router = express.Router();

// كل المسارات هنا: لازم تسجيل دخول + دور academy_owner
router.use(requireAuth, authorize("academy_owner"));

router.post("/", validate(createAcademySchema), createAcademy);
router.get("/", getMyAcademies);
router.get("/:id", getAcademyById);
router.patch("/:id", validate(updateAcademySchema), updateAcademy);

router.post("/:academyId/coaches", validate(inviteCoachSchema), inviteCoach);
router.get("/:academyId/coaches", listAcademyCoaches);
router.get("/:academyId/groups", listAcademyGroups);

module.exports = router;