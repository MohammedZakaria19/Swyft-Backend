const prisma = require("../config/prisma");

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const groupSelect = {
  id: true,
  name: true,
  academyId: true,
  createdAt: true,
  updatedAt: true,
};

// المدرب: إنشاء مجموعة
const createGroup = async (req, res, next) => {
  try {
    const { name, academyId } = req.body;
    const coachId = req.user.userId;

    if (academyId) {
      const membership = await prisma.coachMembership.findFirst({
        where: { coachId, academyId, status: "ACTIVE" },
        select: { id: true },
      });

      if (!membership) {
        return res
          .status(404)
          .json({ message: "الأكاديمية غير موجودة أو لست عضوًا فعّالًا فيها" });
      }
    }

    const group = await prisma.group.create({
      data: { name, coachId, academyId: academyId ?? null },
      select: groupSelect,
    });

    return res.status(201).json({ message: "تم إنشاء المجموعة بنجاح", group });
  } catch (error) {
    next(error);
  }
};

// المدرب: مجموعاتي
const getMyGroups = async (req, res, next) => {
  try {
    const groups = await prisma.group.findMany({
      where: { coachId: req.user.userId },
      select: { ...groupSelect, academy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ groups });
  } catch (error) {
    next(error);
  }
};

// المدرب: تفاصيل مجموعة
const getGroupById = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "رقم المجموعة غير صحيح" });

    const group = await prisma.group.findFirst({
      where: { id, coachId: req.user.userId },
      select: { ...groupSelect, academy: { select: { id: true, name: true } } },
    });

    if (!group) return res.status(404).json({ message: "المجموعة غير موجودة" });

    return res.json({ group });
  } catch (error) {
    next(error);
  }
};

// المدرب: تعديل اسم المجموعة
const updateGroup = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "رقم المجموعة غير صحيح" });

    const existing = await prisma.group.findFirst({
      where: { id, coachId: req.user.userId },
      select: { id: true },
    });

    if (!existing) return res.status(404).json({ message: "المجموعة غير موجودة" });

    const group = await prisma.group.update({
      where: { id },
      data: { name: req.body.name },
      select: groupSelect,
    });

    return res.json({ message: "تم تعديل المجموعة بنجاح", group });
  } catch (error) {
    next(error);
  }
};

// المدرب: مسح مجموعة
const deleteGroup = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "رقم المجموعة غير صحيح" });

    const existing = await prisma.group.findFirst({
      where: { id, coachId: req.user.userId },
      select: { id: true },
    });

    if (!existing) return res.status(404).json({ message: "المجموعة غير موجودة" });

    await prisma.group.delete({ where: { id } });

    return res.json({ message: "تم مسح المجموعة" });
  } catch (error) {
    next(error);
  }
};

// المالك: مجموعات أكاديميته
const listAcademyGroups = async (req, res, next) => {
  try {
    const academyId = parseId(req.params.academyId);
    if (!academyId) return res.status(400).json({ message: "رقم الأكاديمية غير صحيح" });

    const academy = await prisma.academy.findFirst({
      where: { id: academyId, ownerId: req.user.userId },
      select: { id: true },
    });

    if (!academy) return res.status(404).json({ message: "الأكاديمية غير موجودة" });

    const groups = await prisma.group.findMany({
      where: { academyId },
      select: {
        ...groupSelect,
        coach: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ groups });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  listAcademyGroups,
};