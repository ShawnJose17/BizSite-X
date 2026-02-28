const db = require("../config/db");

exports.submitContact = async (req, res, next) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    await db.execute(
      "INSERT INTO contacts (name, email, message, ip_address) VALUES (?, ?, ?, ?)",
      [name.trim(), email.trim(), message.trim(), ip]
    );

    res.status(201).json({ message: "Message stored successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getContacts = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM contacts ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};