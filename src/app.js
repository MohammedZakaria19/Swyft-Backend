const express = require("express");
const authRoutes = require("./routes/auth.routes");
const academyRoutes = require("./routes/academy.routes");
const coachRoutes = require("./routes/coach.routes");
const groupRoutes = require("./routes/group.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Swyft API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/academies", academyRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/groups", groupRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "حدث خطأ في الخادم" });
});

module.exports = app;