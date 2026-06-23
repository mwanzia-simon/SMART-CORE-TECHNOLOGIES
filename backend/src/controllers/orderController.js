import Order from "../models/orderModel.js";

export async function makeOrder(req, res) {
  try {
    const { userId, userOrders } = req.body;

    if (!userId || !userOrders) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // check if the user had made previous orders
    const previousOrders = await Order.findOne({ userId });

    // if the orders exist we update the userOrders array
    if (previousOrders) {
      previousOrders.userOrders = [...userOrders, ...previousOrders.userOrders];
      await previousOrders.save()
      return res.status(201).json({ message: "Order made succesifully!" });
    }

    // If we have no existing orders on the same user we create a new order
    const newOrder = new Order({ userId, userOrders });
    const savedOrder = await newOrder.save();


    res.status(201).json({ message: "Order made succesifully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
}
