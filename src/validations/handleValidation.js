// Import essential modules
import { validationResult } from "express-validator";

// Handle validation middleware
const handleValidation = (message) => async (req, res, next) => {
  try {
    const mappedErrors = validationResult(req).mapped();

    // Send response if there was any error/s
    if (Object.entries(mappedErrors).length > 0)
      return res.status(400).json({
        status: "error",
        error: {
          message,
          errors: mappedErrors,
        },
      });

    // Is no error/s exists
    next();
  } catch (err) {
    next(err);
  }
};

// Export handle validation middleware
export default handleValidation;
