const { z } = require("zod");

const inviteCoachSchema = z.object({
  email: z.string().trim().email(),
});

const respondMembershipSchema = z.object({
  status: z.enum(["ACTIVE", "DECLINED"]),
});

module.exports = { inviteCoachSchema, respondMembershipSchema };