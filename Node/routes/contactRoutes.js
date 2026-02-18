const express = require("express");
const router = express.Router();
const { submitContact, getContacts } = require("../controllers/contactController");
const protect = require("../middleware/authMiddleware");

// Public route
router.post("/", submitContact);

// Protected route
router.get("/", protect, getContacts);

module.exports = router;
