import { getDiscount, makePayment, setCartItems } from "./utils.js";

const cart = document.querySelector(".cart");
const numberOfCartItems = document.querySelector("#number-of-items");
const orderSummaryContainer = document.querySelector(".order-summary");
const paymentMethods = document.querySelectorAll(".p-methods");
const mpesaBox = document.querySelector(".mpesa-box");
const mpesaNumber = document.querySelector("#mpesa-number");
const checkoutBtn = document.querySelector("#checkout-btn");

let totalOrderCost = 0;
let selectedPaymentMethod = "";

// Load cart on page start
displayCartItems();
updateNumberOfCartItems();
updateOrderSummary();

paymentMethods.forEach((pMethod) => {
  pMethod.addEventListener("change", (e) => {
    let mode = e.target.dataset.method;
    if (mode == "mpesa") {
      mpesaBox.style.display = "flex";
      selectedPaymentMethod = "mpesa";
    } else {
      mpesaBox.style.display = "none";
      selectedPaymentMethod = "cod";
      mpesaNumber.value = "";
    }
  });
});

// The checkout btn
checkoutBtn.addEventListener("click", () => {
  const amount = totalOrderCost;
  const phoneNumber = mpesaNumber.value.trim();

  if (!selectedPaymentMethod) {
    alert("Please select a payment method!");
    return;
  }

  if (selectedPaymentMethod == "mpesa") {
    if (!phoneNumber) {
      alert("Please provide a phone number!");
      return;
    }
    makePayment(phoneNumber,amount)
  } else {
  }
});

// Function to display an alert box
function displayAlert(title, message) {
  const alertBox = document.querySelector(".alert");
  const alertTitle = document.querySelector("#alert-title");
  const alertMessage = document.querySelector("#alert-message");

  alertTitle.textContent = title;
  alertMessage.textContent = message;

  alertBox.classList.add("active");

  setTimeout(() => {
    alertBox.classList.remove("active");
  }, 2000);
}

// Load cart items from localStorage
function loadCartItems() {
  return JSON.parse(localStorage.getItem("cart_items") || "[]");
}

// Save cart items
function saveCartItems(items) {
  localStorage.setItem("cart_items", JSON.stringify(items));
}

// Update number of cart items
function updateNumberOfCartItems() {
  numberOfCartItems.textContent = loadCartItems().length;
}

// Display cart items
function displayCartItems() {
  const items = loadCartItems();

  cart.innerHTML = "";

  items.forEach((item) => {
    cart.innerHTML += `
      <div class="cart-item" data-id=${item._id}>
        <img src="${item.imageURL}" alt="img" />
        <div class="cart-item-info">
          <h3 class="cart-item-name">${item.productName}</h3>
          <p class="cart-item-price">ksh ${item.currentPrice.toLocaleString()}.00 </p>
          <p>Quantity</p>
          <div class="quantity-controls">
          <button class="decrement-btn" data-id="${item._id}">-</button>
          <span class="item-quantity"  data-id="${item._id}">${item.quantity}</span>
          <button class="increment-btn" data-id="${item._id}">+</button>
          </div>
        </div>
        <div class="remove-cart-item">
          <i class="fa-solid fa-trash" data-id="${item._id}">delete</i>
        </div>
      </div>
    `;
  });
}

const incrementBtn = document.querySelectorAll(".increment-btn");
const decrementBtn = document.querySelectorAll(".decrement-btn");
const itemQuantity = document.querySelectorAll(".item-quantity");

// This is the increment button to increment the quantity of the item in the cart
incrementBtn.forEach((btn) => {
  btn.onclick = (e) => {
    let items = loadCartItems();
    const id = e.target.dataset.id;
    let editedItem = items.find((item) => item._id === id);
    editedItem.quantity = editedItem.quantity + 1;

    itemQuantity.forEach((itemQty) => {
      if (itemQty.dataset.id == id) {
        itemQty.textContent = editedItem.quantity;
      }
    });

    saveCartItems(items);
    updateOrderSummary();
    setCartItems();
  };
});

// This is the decrement button to increment the quantity of the item in the cart
decrementBtn.forEach((btn) => {
  btn.onclick = (e) => {
    let items = loadCartItems();
    const id = e.target.dataset.id;
    let editedItem = items.find((item) => item._id === id);
    editedItem.quantity = editedItem.quantity - 1;

    // If the quantity goes below 1 we remove it from cart
    if (editedItem.quantity < 1) {
      items = items.filter((item) => item._id !== id);
      saveCartItems(items);
      setCartItems();
      displayAlert(
        "ITEM REMOVED FROM CART!",
        "Item removed from cart succesifully!",
      );

      const deletedItem = cart.querySelectorAll(".cart-item");
      deletedItem.forEach((deletedItm) => {
        if (deletedItm.dataset.id === id) {
          deletedItm.remove();
        }
      });

      updateNumberOfCartItems();
      updateOrderSummary();
      setCartItems();
      return;
    }

    itemQuantity.forEach((itemQty) => {
      if (itemQty.dataset.id == id) {
        itemQty.textContent = editedItem.quantity;
      }
    });

    saveCartItems(items);
    updateOrderSummary();
  };
});

// Remove item using event delegation
cart.addEventListener("click", (e) => {
  if (!e.target.classList.contains("fa-trash")) return;

  let items = loadCartItems();

  const id = e.target.dataset.id;

  items = items.filter((item) => item._id !== id);

  saveCartItems(items);
  setCartItems();

  displayAlert(
    "ITEM REMOVED FROM CART!",
    "Item removed from cart succesifully!",
  );

  updateNumberOfCartItems();
  updateOrderSummary();

  const deletedItem = cart.querySelectorAll(".cart-item");
  deletedItem.forEach((deletedItm) => {
    if (deletedItm.dataset.id === id) {
      deletedItm.remove();
    }
  });
});

async function updateOrderSummary() {
  const subtotal = document.querySelector("#subtotal");
  const totalItems = document.querySelector("#total-items");
  const discountLabel = document.querySelector("#discount-label");
  const discountText = document.querySelector(".discount-text");
  const deliveryFee = document.querySelector("#delivery-fee");
  const totalOrderMoney = document.querySelector("#total-order-money");
  const items = loadCartItems();

  // Later get the delivery fee from the server
  let dFee = 500;

  const totalPrice = items.reduce((total, product) => {
    return total + product.currentPrice * product.quantity;
  }, 0);

  let discount = await getDiscount();
  let discountedAmount = Math.floor((discount / 100) * totalPrice);

  subtotal.textContent = `Ksh ${totalPrice.toLocaleString()}`;
  totalItems.textContent = loadCartItems().length;

  discountLabel.textContent = `Discount (-${discount}%)`;

  discountText.textContent = `ksh ${discountedAmount.toLocaleString()}`;

  deliveryFee.textContent = `Ksh ${dFee}`;

  totalOrderCost = totalPrice + dFee - discountedAmount;

  totalOrderMoney.textContent = `Total cost: ksh ${totalOrderCost.toLocaleString()}`;
}
