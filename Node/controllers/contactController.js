const pool = require("../config/db");
const validator = require("validator");
const disposableDomains = require("disposable-email-domains");
const sanitizeHtml = require("sanitize-html");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic presence validation
    if (
      !name ||
      !email ||
      !message ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Email format validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Disposable email check
    const domain = email.split("@")[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      return res.status(400).json({
        error: "Temporary email addresses are not allowed"
      });
    }

    // Sanitize inputs (protect against XSS)
    const cleanName = sanitizeHtml(name.trim(), {
      allowedTags: [],
      allowedAttributes: {}
    });

    const cleanEmail = sanitizeHtml(email.trim(), {
      allowedTags: [],
      allowedAttributes: {}
    });

    const cleanMessage = sanitizeHtml(message.trim(), {
      allowedTags: [],
      allowedAttributes: {}
    });

    const query = `
      INSERT INTO contacts (name, email, message, created_at)
      VALUES (?, ?, ?, NOW())
    `;

    await pool.execute(query, [cleanName, cleanEmail, cleanMessage]);

    return res.status(200).json({
      message: "Message stored successfully"
    });

  } catch (error) {
    console.error("Contact submission error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
