const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", loginAdmin);

router.get("/dashboard-data", protect, (req, res) => {
  res.json({
    message: "Secret dashboard data",
    adminId: req.adminId
  });
});

module.exports = router;
