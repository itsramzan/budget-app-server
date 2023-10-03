// Import essential modules
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Import databaseConnection function
import dbConnection from "./configs/db.config.js";

// Import rate limiter
import limiter from "./middlewares/common/limiter.js";

// Import essential routes
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import budgetRoute from "./routes/budget.route.js";

// Import notFound & errorHandling middlewares
import notFound from "./middlewares/notFound.js";
import errorHandling from "./middlewares/errorHandling.js";

// Initialize app
const app = express();

// Configure dotenv
config();

// Use essential middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter(1, 100));

// Set view engine
app.set("view engine", "ejs");

// Use essential routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/budget", budgetRoute);

// Use notFound & errorHandling middlewares
app.use(notFound);
app.use(errorHandling);

// Establish database connection
dbConnection(() => {
  // Listening to server
  app.listen(process.env.PORT, (err) => {
    if (!err) {
      console.log(`🙌 Database successfully connected`);
      console.log(`🚀 Server running at port ${process.env.PORT}`);
    }
  });
});
