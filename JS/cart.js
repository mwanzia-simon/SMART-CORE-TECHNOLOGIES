const cart = document.querySelector(".cart");
displayCartItems();
const numberOfCartItems = document.querySelector("#number-of-items");
const totalMoney = document.querySelector(".total-money");
const payOutBtn = document.querySelector(".pay-out-btn");

//Calling the update the amount of money on page load
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

//Function to udate the amount of money
function updateTotalMoney() {
  const items = loadCartItems();
  const totalPrice = items.reduce((total, product) => {
    return total + product.currentPrice;
  }, 0); //Starting amount inorder to increment

  totalMoney.textContent = `Total: Ksh ${totalPrice.toLocaleString()}.00`;
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

      //Updating the total amount of money
      updateTotalMoney();

      //Delete the element from the DOM
      e.target.parentElement.parentElement.remove();
    });
  });
}

//Helper function to load cart items
function loadCartItems() {
  return JSON.parse(localStorage.getItem("CART-ITEMS") || "[]");
}
