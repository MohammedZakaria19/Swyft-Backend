const { z } = require("zod");

const createAcademySchema = z.object({
  name: z.string().trim().min(2).max(100),
  address: z.string().trim().max(255).optional(),
});

const updateAcademySchema = createAcademySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "لازم تبعت حقل واحد على الأقل للتعديل",
  });

module.exports = { createAcademySchema, updateAcademySchema };