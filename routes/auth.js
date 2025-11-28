import express from "express";

const router = express.Router();

router.post("/staff-login", (req, res) => {
  const { pin } = req.body;

  if (pin === "1111") return res.json({ role: "admin" });
  if (pin === "2222") return res.json({ role: "staff" });

  return res.status(401).json({ error: "Invalid PIN" });
});

// Firebase customer login validation happens in frontend only

export default router;
