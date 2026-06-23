import Discount from "../models/discountModel.js";

export async function getDiscount(req, res) {
  try {
    const discount = await Discount.find();
    res.status(200).json(discount);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
}

export async function setDiscount(req, res) {
  try {
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
}
