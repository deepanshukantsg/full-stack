import "reflect-metadata";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { errorHandler } from "./middleware/errorHandler";
import { swaggerSpec } from "./config/swagger";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://full-stack-client-hhwg.onrender.com",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);

app.use(errorHandler);

export default app;
