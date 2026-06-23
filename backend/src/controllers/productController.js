
import Product from "../models/productModel.js"
export async function getProducts(req,res) {
    try {
       const products = await Product.find({})
        res.status(200).json(products)
    } catch (error) {
      res.status(500).json({message:"Internal server error!"})  
    }
}




