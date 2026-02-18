const express = require("express");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const contactRoutes = require("./routes/contactRoutes");

// Security headers
app.use(helmet());

// Rate limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: "Too many requests, please try again later."
  }
});

app.use(limiter);

// Limit JSON body size
app.use(express.json({ limit: "10kb" }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API route
app.use("/contact", contactRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
