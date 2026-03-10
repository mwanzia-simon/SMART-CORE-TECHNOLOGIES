const cart = document.querySelector(".cart");
const numberOfCartItems = document.querySelector("#number-of-items");
const totalMoney = document.querySelector(".total-money");
const payOutBtn = document.querySelector(".pay-out-btn");

// Load cart on page start
displayCartItems();
updateNumberOfCartItems();
updateTotalMoney();

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
  return JSON.parse(localStorage.getItem("CART-ITEMS") || "[]");
}

// Save cart items
function saveCartItems(items) {
  localStorage.setItem("CART-ITEMS", JSON.stringify(items));
}

// Update total money
function updateTotalMoney() {
  const items = loadCartItems();

  const totalPrice = items.reduce((total, product) => {
    return total + product.currentPrice;
  }, 0);

  totalMoney.textContent = `Total: Ksh ${totalPrice.toLocaleString()}.00`;
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
      <div class="cart-item">
        <img src="${item.imageURL}" alt="img" />
        <div class="cart-item-info">
          <h3 class="cart-item-name">${item.productName}</h3>
          <p class="cart-item-price">ksh ${item.currentPrice.toLocaleString()}.00</p>
        </div>
        <div class="remove-cart-item">
          <i class="fa-solid fa-trash" data-id="${item.productID}"></i>
        </div>
      </div>
    `;
  });
}

// Remove item using event delegation
cart.addEventListener("click", (e) => {
  if (!e.target.classList.contains("fa-trash")) return;

  let items = loadCartItems();

  const id = e.target.dataset.id;

  items = items.filter((item) => item.productID !== id);

  saveCartItems(items);

  displayAlert(
    "ITEM REMOVED FROM CART!",
    "Item removed from cart succesifully!",
  );

  updateNumberOfCartItems();
  updateTotalMoney();
  displayCartItems();
});

//Redirecting the user to the checkout page
payOutBtn.addEventListener("click", () => {
  const items = loadCartItems();
  if (items.length <= 0) {
    displayAlert("CART EMPTY!", "Your cart is empty!");
    return;
  }
  window.location.href = "checkout.html";
});
