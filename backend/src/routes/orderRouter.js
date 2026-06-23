import express from "express"
import { makeOrder } from "../controllers/orderController.js"
const router = express.Router()


router.post("/makeorder",makeOrder)
export default router