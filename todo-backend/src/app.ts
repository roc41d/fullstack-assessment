import express, { Request, Response } from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
