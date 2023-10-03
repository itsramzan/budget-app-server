// Import essential modules
import mongoose from "mongoose";

// Database connection function
const dbConnection = async (cb) => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    cb();
  } catch (err) {
    console.log(`⚠️ Database connection failed`);
  }
};

// Export database connection function
export default dbConnection;
