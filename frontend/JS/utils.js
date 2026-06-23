const API = "http://localhost:5050/api/v1";

export async function getDiscount() {
  try {
    const res = await fetch(`${API}/discount/getdiscount`);
    const data = await res.json();
    const discount = data[0].discount;
    return discount;
  } catch (error) {
    console.log(error);
  }
}

export async function getProducts() {
  try {
    const res = await fetch(`${API}/product/getproducts`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getCartItems() {
  let userID = JSON.parse(localStorage.logged_user).id;
  try {
    const res = await fetch(`${API}/user/cartitems/${userID}`);
    const data = await res.json();
    if (data.length == 0) return;
    localStorage.setItem("cart_items", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
}
export async function setCartItems() {
  let userID = JSON.parse(localStorage.logged_user).id;
  let cartItems = JSON.parse(localStorage.cart_items || "[]");

  try {
    const res = await fetch(`${API}/user/cartitems/${userID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItems),
    });

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
export async function makePayment(phoneNumber, amount) {
  let userID = JSON.parse(localStorage.logged_user).id;
  let cartItems = JSON.parse(localStorage.cart_items);

  if (cartItems.length == 0) {
    alert("Please add items to cart!");
    return;
  }

  const payload = {
    phoneNumber,
    amount,
  };

  try {
    const res = await fetch(`${API}/payment/makepayment/${userID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    alert(data.message);
  } catch (error) {
    console.log(error);
  }
}
