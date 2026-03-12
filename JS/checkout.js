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
const downloadBtn = document.querySelector("#download");
const completeOrderBtn = document.querySelector("#complete-order");

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
});

function generateOrderID() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = Number(localStorage.orderCount || 0) + 1;
  localStorage.orderCount = count;
  return `SC-${date}-${String(count).padStart(4, "0")}`;
}

downloadBtn.addEventListener("click", () => {
  const order = createOrder();
  generatePDF(order);
});

completeOrderBtn.addEventListener("click", () => {
  const order = createOrder();
  sendWhatsApp(order);
});

//Function to create order
function createOrder() {
  const cart = loadCartItems();

  let total = 0;

  cart.forEach((item) => {
    total += item.currentPrice;
  });

  const order = {
    id: generateOrderID(),
    customer: {
      name: userObject.firstName,
      email: userObject.email,
      phone: userObject.whatappNumber,
    },
    items: cart,
    total,
  };

  return order;
}

// const { jsPDF } = window.jspdf;
//Function to generate a pdf (receipt) and save it
function generatePDF(order) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const cart = loadCartItems();

  // Title
  doc.setFontSize(18);
  doc.text("SMART CORE TECHNOLOGIES", 14, 20);
  doc.setFontSize(12);
  doc.text(`Order ID: ${order.id}`, 14, 28);
  doc.text(`Customer: ${order.customer.name}`, 14, 36);
  doc.text(`Email: ${order.customer.email}`, 14, 42);
  doc.text(`Phone: ${order.customer.phone}`, 14, 48);
  doc.text(
    `Date:  ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`,
    14,
    54,
  );

  const quantity = 1;

  // Prepare table rows
  const rows = cart.map((item) => [
    item.productName,
    quantity,
    "KSh " + item.currentPrice.toLocaleString() + ".00",
    "KSh " + (item.currentPrice * quantity).toLocaleString() + ".00",
  ]);

  // Add table
  doc.autoTable({
    head: [["Item", "Qty", "Price", "Total"]],
    body: rows,
    startY: 60,
    theme: "grid",
    headStyles: { fillColor: [52, 152, 219], textColor: 255 },
  });

  // Total
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.currentPrice * quantity,
    0,
  );
  doc.text(
    `Total: KSh ${totalAmount.toLocaleString()}.00`,
    14,
    doc.lastAutoTable.finalY + 10,
  );
  // Center message
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.text(
    "Thank you for shopping with Smart Core Technologies",
    pageWidth / 2,
    doc.lastAutoTable.finalY + 25,
    { align: "center" },
  );
  // Save PDF
  doc.save("SmartCore_receipt.pdf");
}

//Function to send a whatapp message
function sendWhatsApp(order) {
  const message = generateMessage(order);
  const url = `https://wa.me/254768286327?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}

//Function to generate message
function generateMessage(order) {
  let items = "";

  order.items.forEach((item) => {
    items += `${item.productName} - KSh ${item.currentPrice.toLocaleString()}.00\n`;
  });

  return `
SMART CORE TECHNOLOGIES

Order ID: ${order.id}

Customer: ${order.customer.name}
Email: ${order.customer.email}
Phone: ${order.customer.phone}

Items:
${items}

Total: KSh ${order.total.toLocaleString()}.00
`;
}
