import jwt from "jsonwebtoken";

export function verifyToken(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) throw new Error("Unauthorized");
  const token = auth.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}
