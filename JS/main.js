const productsContainer = document.querySelector(".products-container")
const PRODUCT_FILE = "products.json"

loadProducts()


async function loadProducts(){
    const res = await fetch(PRODUCT_FILE)
    const data = await res.json()

    // Clearing the products container
    productsContainer.innerHTML = ""
    
    //Looping through the products to display them
    data.forEach(product => {
        productsContainer.innerHTML += `
        <div class="product">
          <div class="saved-amount">saved Ksh 129,500.00</div>
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
          <h3 class="product-price">Ksh ${(product.currentPrice).toLocaleString()}.00</h3>
          <s class="old-price">ksh ${(product.currentPrice + product.savedAmount).toLocaleString()}.00</s>
          <div class="buttons-container">
            <button class="add-to-cart">Add to cart</button>
            <button class="quick-overview">Quick overview</button>
          </div>
        </div>
        
        `
    });
}