const productsContainer = document.querySelector(".products-container");
const quickOverViewDialog = document.querySelector("#quick-overview");
const closeDialogBtn = document.querySelector(".close-dialog");
const numberOfCartItems = document.querySelector("#number-of-items");

const PRODUCT_FILE = "products.json";

loadProducts();
updateNumberOfCartItems();



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

function updateNumberOfCartItems() {
  numberOfCartItems.textContent = loadCartItems().length;
}

//Helper functions for dialog
function displayDialog(dialog) {
  dialog.showModal();
}

function hideDialog(dialog) {
  dialog.close();
}

// displayDialog(quickOverViewDialog);

//Local storage helper functions
function saveCartItems(items) {
  localStorage.setItem("CART-ITEMS", JSON.stringify(items));
}

function loadCartItems() {
  return JSON.parse(localStorage.getItem("CART-ITEMS") || "[]");
}

async function loadProducts() {
  const res = await fetch(PRODUCT_FILE);
  const data = await res.json();

  // Clearing the products container
  productsContainer.innerHTML = "";

  //Looping through the products to display them
  data.forEach((product) => {
    productsContainer.innerHTML += `
        <div class="product">
          <div class="saved-amount">saved Ksh ${product.savedAmount.toLocaleString()}.00</div>
          <img
            src="${product.imageURL}"
            alt="product"
          />
          <p class="product-name">${product.productName}</p>
          <div class="ratings">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-regular fa-star"></i>
          </div>
          <h3 class="product-price">Ksh ${product.currentPrice.toLocaleString()}.00</h3>
          <s class="old-price">ksh ${(product.currentPrice + product.savedAmount).toLocaleString()}.00</s>
          <div class="buttons-container">
            <button class="add-to-cart" data-id="${product.productID}">Add to cart</button>
            <button class="quick-overview" data-id="${product.productID}">Quick overview</button>
          </div>
        </div>
        
        `;
  });

  //Adding an event listener to add to cart button
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const items = loadCartItems();
      const id = e.target.dataset.id;

      const itemExists = items.find((item) => item.productID === id);

      const item = data.find((item) => item.productID === id);

      items.push(item);
      console.log(itemExists);
      displayAlert("ITEM ADDED TO CART!", "Item added to cart succesifully!");
      saveCartItems(items);
      //Updating the number of cart item
      updateNumberOfCartItems();
    });
  });

  //the quick overview button
  document.querySelectorAll(".quick-overview").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const item = data.find((item) => item.productID === id);

      //Display quick overview dialog
      displayDialog(quickOverViewDialog);

      // changing the dialog content
      quickOverViewDialog.innerHTML = `
         <div class="close-dialog">
        <i class="fa-solid fa-x"></i>
      </div>
      <div class="row">
        <div class="col-1">
          <h3>Quick overview</h3>
          <img src="${item.imageURL}" alt="img" />
        </div>
        <div class="col-1">
          <h3>Laptop Specifications</h3>
          <p class="laptop-name">${item.productName}</p>
          <ul>
            <li><strong>Processor</strong> ${item.specs.processor}</li>
            <li><strong>AI Processor</strong> ${item.specs.ai_processor}</li>
            <li><strong>Graphics</strong> ${item.specs.graphics}</li>
            <li>
              <strong>Display</strong> ${item.specs.display}
            </li>
            <li><strong>RAM</strong> ${item.specs.ram}</li>
            <li><strong>Storage</strong> ${item.specs.storage}</li>
            <li><strong>Operating System</strong> ${item.specs.operating_system}</li>
          </ul>
          <h3> <span><p><s>Ksh ${(item.currentPrice + item.savedAmount).toLocaleString()}.00</s></p></span> Ksh ${item.currentPrice.toLocaleString()}.00</h3>
        </div>
      </div>
      `;

      document.querySelector(".close-dialog").addEventListener("click", () => {
        hideDialog(quickOverViewDialog);
      });
    });
  });
}
