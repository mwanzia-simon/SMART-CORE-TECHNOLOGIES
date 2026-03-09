
const numberOfCartItems = document.querySelector("#number-of-items");

function loadCartItems() {
  return JSON.parse(localStorage.getItem("CART-ITEMS") || "[]");
}

function updateNumberOfCartItems() {
  numberOfCartItems.textContent = loadCartItems().length;
}

updateNumberOfCartItems()