// Import essential modules
import rateLimit from "express-rate-limit";

// Limiter
const limiter = (minutes = 10, max = 3) =>
  rateLimit({
    windowMs: minutes * 60 * 1000, // Minutes in ms
    max, // Limit each IP to max requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      status: "error",
      error: { message: "Maximum attempts reached. Please try again later." },
    },
  });

// Export limiter
export default limiter;
