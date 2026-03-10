const numberOfCartItems = document.querySelector("#number-of-items");
const receiptDialog = document.querySelector(".receipt-dialog");
const receipt = document.querySelector("#receipt");
const closeDialogBtn = document.querySelector(".close-btn");
const summaryContent = document.querySelector(".order-summary-content");
const totalOrderMoney = document.querySelector("#total-order-money");
const personalInfoForm = document.querySelector(".personal-info-form");
const firstName = document.querySelector("#first-name");
const whatappNumber = document.querySelector("#whatapp-number");
const email = document.querySelector("#email-address");
let userObject;

showOrderSummary();
updateNumberOfCartItems();

function loadCartItems() {
  return JSON.parse(localStorage.getItem("CART-ITEMS") || "[]");
}

//Function to get the total price
function getTotalPrice() {
  const items = loadCartItems();
  const totalPrice = items.reduce((total, product) => {
    return total + product.currentPrice;
  }, 0);
  return totalPrice;
}

function showOrderSummary() {
  const items = loadCartItems();
  items.forEach((item) => {
    summaryContent.innerHTML += `
     <div class="order">
        <p>${item.productName}</p>
        <p>ksh ${item.currentPrice.toLocaleString()}.00</p>
     </div>
    `;
  });

  const totalPrice = getTotalPrice();
  totalOrderMoney.textContent = `Ksh ${totalPrice.toLocaleString()}.00`;
}

//Helper functions for dialog
function displayDialog(dialog) {
  dialog.showModal();
}

function hideDialog(dialog) {
  dialog.close();
}

closeDialogBtn.addEventListener("click", () => {
  hideDialog(receiptDialog);
});

function loadCartItems() {
  return JSON.parse(localStorage.getItem("CART-ITEMS") || "[]");
}

function updateNumberOfCartItems() {
  numberOfCartItems.textContent = loadCartItems().length;
}

personalInfoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userObject = {
    firstName: firstName.value,
    whatappNumber: whatappNumber.value,
    email: email.value,
  };

  displayDialog(receiptDialog);
  updateReceiptInfo();
});

function updateReceiptInfo() {
  receipt.innerHTML = `
   <div class="receipt-header">
          <h2>Smart Core Technologies</h2>
          <p>Order Confirmation</p>
        </div>

        <div class="receipt-info">
          <p><strong>Order ID:</strong> ${generateOrderID()}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>
          <p><strong>Customer:</strong> ${userObject.firstName}</p>
          <p><strong>Phone number:</strong> +254 ${userObject.whatappNumber}</p>
          <p><strong>Email:</strong> ${userObject.email}</p>
          <p><strong>Status:</strong> Pending Payment</p>
        </div>

        <table class="receipt-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
          
          </tbody>
        </table>

        <div class="receipt-total">
          <p>Subtotal: <span>KSh ${getTotalPrice().toLocaleString()}.00</span></p>
          <p>Delivery: <span>KSh 500</span></p>
          <h3>Total: <span>KSh ${(getTotalPrice() + 500).toLocaleString()}.00</span></h3>
        </div>

        <div class="receipt-footer">
          <p>Thank you for shopping with Smart Core Technologies</p>
        </div>
  `;
  const items = loadCartItems();
  const tableBody = receipt.querySelector("tbody");
  items.forEach((item) => {
    tableBody.innerHTML += `
      <tr>
              <td>${item.productName}</td>
              <td>1</td>
              <td>KSh ${item.currentPrice.toLocaleString()}.00</td>
              <td>KSh ${item.currentPrice.toLocaleString()}.00</td>
    </tr>
    
    `;
  });
}

function generateOrderID() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = Number(localStorage.orderCount || 0) + 1;
  localStorage.orderCount = count;
  return `SC-${date}-${String(count).padStart(4, "0")}`;
}
