import express from "express";
import cors from "cors";
import "./config/env.js";
import moduleRoutes from "./modules/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "FinSight Backend Running 🚀" });
});

app.use("/api", moduleRoutes);

export default app;
