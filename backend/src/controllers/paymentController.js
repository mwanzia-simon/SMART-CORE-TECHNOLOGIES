export async function makePayment(req, res) {
  try {
    const { phoneNumber, amount } = req.body;
    const {id} = req.params

    if(!phoneNumber || !amount){
        return res.status(400).json({message:"All fields required!"})
    }

    console.log({ id,phoneNumber, amount });
    // This is where we make the payments am going to use swift wallet for the stk push

    res.status(200).json({ message: "Payment made succesifully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
}
