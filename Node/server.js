require("dotenv").config();

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorHandler");

const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." }
});

// Trust proxy (important for correct IP detection behind proxies)
app.set("trust proxy", 1);

app.use(cors({
  origin: "*", // later restrict this
}));

// Security headers
app.use(helmet());

app.use(globalLimiter);

// JSON body limit
app.use(express.json({ limit: "10kb" }));

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

app.use("/admin", express.static(path.join(__dirname, "client/dist")));

app.get("/admin/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

// Public site already served here
app.use(express.static(path.join(__dirname, "public")));

// Error handler LAST
app.use(errorHandler);

// Start server LAST
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});