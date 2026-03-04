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

exports.deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM contacts WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.toggleReadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      "SELECT is_read FROM contacts WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }

    const newStatus = !rows[0].is_read;

    await db.execute(
      "UPDATE contacts SET is_read = ? WHERE id = ?",
      [newStatus, id]
    );

    res.json({ message: "Status updated", is_read: newStatus });
  } catch (error) {
    next(error);
  }
};