const cart = document.querySelector(".cart");
displayCartItems();
const numberOfCartItems = document.querySelector("#number-of-items");

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

//function to update the number of cart items
updateNumberOfCartItems();

function loadCartItems() {
  return JSON.parse(localStorage.getItem("CART-ITEMS") || "[]");
}

function updateNumberOfCartItems() {
  numberOfCartItems.textContent = loadCartItems().length;
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

      displayAlert(
        "ITEM REMOVED FROM CART!",
        "Item removed from cart succesifully!",
      );

      //Updating the number of cart item
      updateNumberOfCartItems();

      //Delete the element from the DOM
      e.target.parentElement.parentElement.remove();
    });
  });
}

//Helper function to load cart items
function loadCartItems() {
  return JSON.parse(localStorage.getItem("CART-ITEMS") || "[]");
}
