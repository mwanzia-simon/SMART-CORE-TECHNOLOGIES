import Newsletter from "../models/newsletterModel.js";

export async function subscribeToNewsletter(req, res) {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required!" });

    // Check if the email exists
    const emailExists = await Newsletter.findOne({ email });

    if (emailExists)
      return res.status(409).json({ message: "You have already subscribed to our newsletter!" });

    const newsletter = new Newsletter({ email });
    await newsletter.save();
    res
      .status(201)
      .json({ message: "Succesifully subscribed to our newsletter!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
}
