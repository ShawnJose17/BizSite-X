const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { submitContact, getContacts, deleteContact, toggleReadStatus } = require("../controllers/contactController");

// Public route
router.post("/", submitContact);

// Protected route
router.get("/", protect, getContacts);

router.delete("/:id", protect, deleteContact);

router.patch("/:id/read", protect, toggleReadStatus);

module.exports = router;
