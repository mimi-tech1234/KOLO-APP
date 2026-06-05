import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "6mb" }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "kolo-api" }));
app.use("/api", routes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Kolo API listening on ${PORT}`);
});
