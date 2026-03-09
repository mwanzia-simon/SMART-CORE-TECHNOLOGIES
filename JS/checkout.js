
const numberOfCartItems = document.querySelector("#number-of-items");
const receiptDialog = document.querySelector(".receipt-dialog")
const closeDialogBtn = document.querySelector(".close-btn")

//Helper functions for dialog
function displayDialog(dialog) {
  dialog.showModal();
}

function hideDialog(dialog) {
  dialog.close();
}

closeDialogBtn.addEventListener("click",()=>{
    hideDialog(receiptDialog)
})

displayDialog(receiptDialog)

function loadCartItems() {
  return JSON.parse(localStorage.getItem("CART-ITEMS") || "[]");
}

function updateNumberOfCartItems() {
  numberOfCartItems.textContent = loadCartItems().length;
}

updateNumberOfCartItems()