import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "kolo-dev-secret-change-in-production";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing auth token." });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}
