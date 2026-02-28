const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const MAX_ATTEMPTS = 5;
const BLOCK_TIME_MINUTES = 15;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress
  );
};

exports.loginAdmin = async (req, res, next) => {
  const { username, password } = req.body || {};
  const ip = getClientIp(req);

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    // 1️⃣ Check login attempts for this IP
    const [attemptRows] = await db.execute(
      "SELECT * FROM login_attempts WHERE ip_address = ?",
      [ip]
    );

    if (attemptRows.length > 0) {
      const attemptData = attemptRows[0];
      const lastAttemptTime = new Date(attemptData.last_attempt).getTime();
      const currentTime = Date.now();
      const diffMinutes = (currentTime - lastAttemptTime) / (1000 * 60);

      if (
        attemptData.attempts >= MAX_ATTEMPTS &&
        diffMinutes < BLOCK_TIME_MINUTES
      ) {
        return res.status(429).json({
          error: "Too many failed login attempts. Try again later."
        });
      }
    }

    // 2️⃣ Check admin credentials
    const [rows] = await db.execute(
      "SELECT * FROM admin WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      await recordFailedAttempt(ip);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      await recordFailedAttempt(ip);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3️⃣ Reset attempts on success
    await resetAttempts(ip);

    res.json({
      message: "Login successful",
      token: generateToken(admin.id)
    });

  } catch (error) {
    next(error);
  }
};

async function recordFailedAttempt(ip) {
  const [rows] = await db.execute(
    "SELECT * FROM login_attempts WHERE ip_address = ?",
    [ip]
  );

  if (rows.length === 0) {
    await db.execute(
      "INSERT INTO login_attempts (ip_address, attempts) VALUES (?, 1)",
      [ip]
    );
  } else {
    await db.execute(
      "UPDATE login_attempts SET attempts = attempts + 1 WHERE ip_address = ?",
      [ip]
    );
  }
}

async function resetAttempts(ip) {
  await db.execute(
    "UPDATE login_attempts SET attempts = 0 WHERE ip_address = ?",
    [ip]
  );
}