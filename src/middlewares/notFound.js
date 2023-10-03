// Import essential modules
import createError from "http-errors";

// Middleware for handling not found route
const notFound = async (req, res, next) => {
  try {
    next(createError(404, "Your requested enpoint not found"));
  } catch (err) {
    next(err);
  }
};

// Export notFound middleware
export default notFound;
