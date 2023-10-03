// Import essential modules
import jwt from "jsonwebtoken";

// Check auth middleware
const checkAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.payload = decode;
    next();
  } catch (err) {
    err.status = 401;
    err.message = "Authentication failed";
    next(err);
  }
};

// Export check auth middleware
export default checkAuth;
