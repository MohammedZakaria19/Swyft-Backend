const { z } = require("zod");

const createGroupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  academyId: z.number().int().positive().optional(),
});

const updateGroupSchema = z.object({
  name: z.string().trim().min(2).max(100),
});

module.exports = { createGroupSchema, updateGroupSchema };