const cart = document.querySelector(".cart");
displayCartItems();

function loadCartItems() {
  return JSON.parse(localStorage.getItem("CART-ITEMS") || "[]");
}

function saveCartItems(items) {
  localStorage.setItem("CART-ITEMS", JSON.stringify(items));
}

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
              <div class="quantity-controls">
                <button class="decrement" data-id="${item.productID}">-</button>
                <p class="cart-item-quantity">1</p>
                <button class="increment" data-id="${item.productID}">+</button>
              </div>
            </div>
            <div class="remove-cart-item" >
              <i class="fa-solid fa-trash" data-id="${item.productID}"></i>
            </div>
          </div>
    `;
  });

  document.querySelectorAll(".remove-cart-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let items = loadCartItems();
      const id = e.target.dataset.id;
      items = items.filter((item) => item.productID !== id);

      //Function to save items to local storage
      saveCartItems(items);
      //Delete the element from the DOM
      e.target.parentElement.parentElement.remove();
    });
  });
}

//Helper function to load cart items
function loadCartItems() {
  return JSON.parse(localStorage.getItem("CART-ITEMS") || "[]");
}
