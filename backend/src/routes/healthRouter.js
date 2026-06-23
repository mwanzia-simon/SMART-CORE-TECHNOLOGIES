import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "The server is running." });
});
export default router;
