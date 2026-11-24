const express = require("express");
const requireAuth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../validators/validate");
const {
  createGroupSchema,
  updateGroupSchema,
} = require("../validators/group.validator");
const {
  createGroup,
  getMyGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
} = require("../controllers/group.controller");

const router = express.Router();

router.use(requireAuth, authorize("coach"));

router.post("/", validate(createGroupSchema), createGroup);
router.get("/", getMyGroups);
router.get("/:id", getGroupById);
router.patch("/:id", validate(updateGroupSchema), updateGroup);
router.delete("/:id", deleteGroup);

module.exports = router;