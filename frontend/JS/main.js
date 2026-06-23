const productsContainer = document.querySelector(".products-container");
const quickOverViewDialog = document.querySelector("#quick-overview");
const userProfileDialog = document.querySelector("#user-profile");
const closeDialogBtn = document.querySelector(".close-dialog");
const numberOfCartItems = document.querySelector("#number-of-items");
const contactForm = document.querySelector("#contact-form");
const loginBtn = document.querySelector(".loginBtn");
const newsletterBtn = document.querySelector("#newsletter-btn");
const newsletterInput = document.querySelector("#newsletter-input");
const offerSection = document.querySelector(".offer-section");
const offerText = document.querySelector("#offer-text");

import {
  getDiscount,
  getProducts,
  getCartItems,
  setCartItems,
} from "./utils.js";

setUp();

async function setUp() {
  await getCartItems();
  loadProducts();
  updateNumberOfCartItems();
  checkForOffer();
}

// On page load check if we have any offers if any display the offer banner
async function checkForOffer() {
  offerSection.style.display = "none";
  const discount = await getDiscount();
  if (discount > 0) {
    setTimeout(() => {
      displayAlert(
        "DISCOUNT ALERT 🎉🎉",
        `Shop now to get a ${discount}% off discount!`,
      );
    }, 2000);

    offerText.textContent = `Get ${discount}% Discount!`;
    offerSection.style.display = "block";
  }
}

// Function to login
loginBtn.addEventListener("click", () => {
  const loggedUser = JSON.parse(localStorage.getItem("logged_user"));
  if (loggedUser) {
    userProfileDialog.innerHTML = `
    <div class="close-user-profile">
        <i class="fa-solid fa-x"></i>
      </div>
      <div class="row">
        <div class="col-1">
          <h3>user profile</h3>
          <div class="user-logo">${loggedUser.username[0].toUpperCase()}</div>
          <h3>username</h3>
          <span>${loggedUser.username}</span>
          <h3>Email</h3>
          <span>${loggedUser.email}</span>
          <button id="logout-btn">Log out</button>
        </div>
      </div>
`;
    displayDialog(userProfileDialog);
    document.querySelector(".close-user-profile").onclick = () => {
      hideDialog(userProfileDialog);
    };
    document.querySelector("#logout-btn").onclick = () => {
      setCartItems();
      hideDialog(userProfileDialog);
      displayAlert("LOG OUT ALERT", "You have succesifully logged out!");
      localStorage.setItem("logged_user", null);
      localStorage.setItem("cart_items", JSON.stringify([]));
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 3000);
    };
    return;
  }
  window.location.href = "./login.html";
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
  }, 3000);
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

//Local storage helper functions
function saveCartItems(items) {
  localStorage.setItem("cart_items", JSON.stringify(items));
}

function loadCartItems() {
  return JSON.parse(localStorage.getItem("cart_items") || "[]");
}

async function loadProducts() {
  const data = await getProducts();

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
            <button class="add-to-cart" data-id="${product._id}">Add to cart</button>
            <button class="quick-overview" data-id="${product._id}">Quick overview</button>
          </div>
        </div>
        
        `;
  });

  //Adding an event listener to add to cart button
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const items = loadCartItems();
      const id = e.target.dataset.id;

      const itemExists = items.find((item) => item._id === id);

      // If the item is already added to the cart we return
      if (itemExists) {
        displayAlert("CART ITEMS ALERT", "Item already added to cart!");
        return;
      }

      const item = data.find((item) => item._id === id);

      items.push(item);
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
      const item = data.find((item) => item._id === id);

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

// Sending emails through form spree
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const URL = "https://formspree.io/f/xbdzjrbz";

  try {
    const formData = new FormData(contactForm);
    const response = await fetch(URL, {
      method: "post",
      body: formData,
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      displayAlert("CONTACT US FORM!", "Submission send succesifully!");
      contactForm.reset();
    } else {
      displayAlert(
        "SUBMISSION ERROR!",
        "An error occured while sending your submission!",
      );
    }
  } catch (error) {
    displayAlert(
      "NETWORK ERROR!",
      "Please check your internet connection and try again!",
    );
  }
});

// function to subscribe to newsletter
newsletterBtn.addEventListener("click", () => {
  const email = newsletterInput.value;
  if (!email.trim()) {
    displayAlert("ALERT", "Please provide an email to subscribe!");
    return;
  }

  let newsletterObj = {
    email: email,
  };
  subscribeToNewsletter(newsletterObj);
});

async function subscribeToNewsletter(newsletterObj) {
  const API = "http://localhost:5050/api/v1/newsletter/subscribe";
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsletterObj),
    });
    const data = await res.json();
    displayAlert("NEWSLETTER ALERT", data.message);
    if (res.status !== 201) return;
    newsletterInput.value = "";
  } catch (error) {
    console.log("An error occured", error);
  }
}
