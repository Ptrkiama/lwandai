import { verifyToken } from "@/lib/auth"; // ✅ Import your token verifier
import connectDB from "@/lib/db";
import User from "@/models/User"; // or your MemberData model if separate

export default async function handler(req, res) {
  await connectDB();

  try {
    const user = verifyToken(req); // ✅ This checks if the user has a valid token
    // Now user.id is available — use it to fetch only the logged-in user's data

    // Example: fetch member data that matches the user's ID
    const memberData = await User.findById(user.id).select("-password"); // Remove password from output
    res.status(200).json({ member: memberData });

  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
