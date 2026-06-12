import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : true;
app.use(cors({ origin: corsOrigins }));
app.use(express.json({ limit: "6mb" }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "kolo-api" }));
app.get("/", (_req, res) => {
  res.json({
    service: "kolo-api",
    message: "This is the Kolo API. Use the web app for the frontend.",
    webApp: process.env.WEB_APP_URL || "https://kolo-app-web-virid.vercel.app",
    health: "/health",
    api: "/api"
  });
});
app.use("/api", routes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Kolo API listening on ${PORT}`);
});
