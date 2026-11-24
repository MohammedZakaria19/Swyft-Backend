const prisma = require("../config/prisma");

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const findOwnedAcademy = (academyId, ownerId) =>
  prisma.academy.findFirst({
    where: { id: academyId, ownerId },
    select: { id: true },
  });

// المالك: دعوة مدرب
const inviteCoach = async (req, res, next) => {
  try {
    const academyId = parseId(req.params.academyId);
    if (!academyId) return res.status(400).json({ message: "رقم الأكاديمية غير صحيح" });

    const academy = await findOwnedAcademy(academyId, req.user.userId);
    if (!academy) return res.status(404).json({ message: "الأكاديمية غير موجودة" });

    const coach = await prisma.user.findUnique({
      where: { email: req.body.email },
      select: { id: true, role: true },
    });

    if (!coach || coach.role !== "coach") {
      return res.status(404).json({ message: "لا يوجد مدرب مسجّل بهذا البريد" });
    }

    const existing = await prisma.coachMembership.findUnique({
      where: { coachId_academyId: { coachId: coach.id, academyId } },
    });

    if (existing && existing.status !== "DECLINED") {
      const message =
        existing.status === "ACTIVE"
          ? "المدرب عضو بالفعل في الأكاديمية"
          : "تم إرسال دعوة لهذا المدرب بالفعل";
      return res.status(409).json({ message });
    }

    const select = { id: true, status: true, coachId: true, academyId: true, createdAt: true };

    const membership = existing
      ? await prisma.coachMembership.update({
          where: { id: existing.id },
          data: { status: "PENDING" },
          select,
        })
      : await prisma.coachMembership.create({
          data: { coachId: coach.id, academyId },
          select,
        });

    return res.status(201).json({ message: "تم إرسال الدعوة بنجاح", membership });
  } catch (error) {
    next(error);
  }
};

// المالك: عرض مدربين أكاديميته
const listAcademyCoaches = async (req, res, next) => {
  try {
    const academyId = parseId(req.params.academyId);
    if (!academyId) return res.status(400).json({ message: "رقم الأكاديمية غير صحيح" });

    const academy = await findOwnedAcademy(academyId, req.user.userId);
    if (!academy) return res.status(404).json({ message: "الأكاديمية غير موجودة" });

    const memberships = await prisma.coachMembership.findMany({
      where: { academyId },
      select: {
        id: true,
        status: true,
        createdAt: true,
        coach: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ memberships });
  } catch (error) {
    next(error);
  }
};

// المدرب: دعواتي وأكاديمياتي
const getMyMemberships = async (req, res, next) => {
  try {
    const memberships = await prisma.coachMembership.findMany({
      where: { coachId: req.user.userId },
      select: {
        id: true,
        status: true,
        createdAt: true,
        academy: { select: { id: true, name: true, address: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ memberships });
  } catch (error) {
    next(error);
  }
};

// المدرب: قبول أو رفض دعوة
const respondToMembership = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "رقم الدعوة غير صحيح" });

    const membership = await prisma.coachMembership.findFirst({
      where: { id, coachId: req.user.userId },
      select: { id: true, status: true },
    });

    if (!membership) return res.status(404).json({ message: "الدعوة غير موجودة" });

    if (membership.status !== "PENDING") {
      return res.status(409).json({ message: "تم الرد على هذه الدعوة من قبل" });
    }

    const updated = await prisma.coachMembership.update({
      where: { id },
      data: { status: req.body.status },
      select: { id: true, status: true, academyId: true, updatedAt: true },
    });

    return res.json({ message: "تم تسجيل ردك على الدعوة", membership: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  inviteCoach,
  listAcademyCoaches,
  getMyMemberships,
  respondToMembership,
};