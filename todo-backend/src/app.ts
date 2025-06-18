import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";
import todoRoutes from "./routes/todoRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/todos", todoRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
