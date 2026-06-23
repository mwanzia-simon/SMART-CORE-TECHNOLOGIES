import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    // Check if the user has provided all the fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // check if the user exists in the database
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(409).json({ message: "Email already exists!" });
    }

    // If all the checs were succesifull we create the user
    const hashedPassword = await bcrypt.hash(password, 10);

    const userObj = {
      username,
      email,
      password: hashedPassword,
    };

    const newUser = new User(userObj);
    const savedUser = await newUser.save();

    res.status(201).json({ message: "User registered succesifully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Invalid credentials.Please try again!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials.Please try again!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials.Please try again!" });
    }

    // If the request passes all the checks
    res.status(200).json({
      message: "Logged in succesifully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCartItems(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    res.status(200).json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function setCartItems(req, res) {
  try {
    const { id } = req.params;
    let cartItems = req.body;
    const user = await User.findOne({ _id: id });
    user.cartItems = [];
    user.cartItems = cartItems;
    await user.save();
    res.status(201).json({ message: "Cart items stored succesifully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
