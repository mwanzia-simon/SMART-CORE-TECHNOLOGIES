import express from "express"
import { getDiscount, setDiscount } from "../controllers/discountController.js"
const router = express.Router()

router.get("/getdiscount",getDiscount)
router.post("/setdiscount",setDiscount)
export default router