const prisma = require("../config/prisma");

const academySelect = {
  id: true,
  name: true,
  address: true,
  createdAt: true,
  updatedAt: true,
};

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const createAcademy = async (req, res, next) => {
  try {
    const { name, address } = req.body;

    const academy = await prisma.academy.create({
      data: { name, address, ownerId: req.user.userId },
      select: academySelect,
    });

    return res.status(201).json({ message: "تم إنشاء الأكاديمية بنجاح", academy });
  } catch (error) {
    next(error);
  }
};

const getMyAcademies = async (req, res, next) => {
  try {
    const academies = await prisma.academy.findMany({
      where: { ownerId: req.user.userId },
      select: academySelect,
      orderBy: { createdAt: "desc" },
    });

    return res.json({ academies });
  } catch (error) {
    next(error);
  }
};

const getAcademyById = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "رقم الأكاديمية غير صحيح" });

    const academy = await prisma.academy.findFirst({
      where: { id, ownerId: req.user.userId },
      select: academySelect,
    });

    if (!academy) return res.status(404).json({ message: "الأكاديمية غير موجودة" });

    return res.json({ academy });
  } catch (error) {
    next(error);
  }
};

const updateAcademy = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "رقم الأكاديمية غير صحيح" });

    const existing = await prisma.academy.findFirst({
      where: { id, ownerId: req.user.userId },
      select: { id: true },
    });

    if (!existing) return res.status(404).json({ message: "الأكاديمية غير موجودة" });

    const academy = await prisma.academy.update({
      where: { id },
      data: req.body,
      select: academySelect,
    });

    return res.json({ message: "تم تعديل الأكاديمية بنجاح", academy });
  } catch (error) {
    next(error);
  }
};

module.exports = { createAcademy, getMyAcademies, getAcademyById, updateAcademy };
