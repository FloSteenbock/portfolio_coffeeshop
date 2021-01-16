/*jshint esversion: 6 */
/*jshint esversion: 8 */
/*jshint esversion: 9 */

// Start
// DOM Elemente ----------------
// Start
const html = document.querySelector('html');
const body = document.querySelector('body');
const container = document.querySelector('.container');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const cartBtn = document.querySelector('.cart');
const cartCount = document.querySelector('#cartCountNumber');
const groupsBtn = document.querySelectorAll('.group-heading');
const shopCardsWrapper = document.querySelector('.shopCards-wrapper');
const scrollBtn = document.querySelector('.scroll-btn');
const cardPage = document.querySelector('.background-products-container');
const closeBtn = document.querySelector('.closeBtn');
const totalCart = document.querySelector('#totalCart');
// Ende
// DOM Elemente ----------------
// Ende

//Spinner
window.onload = () => {
  setTimeout(() => {
    body.classList.toggle('display');
  }, 2000);
};


// Start
// EventHandler ---------------
// Start

// Hamburger Button
hamburgerMenu.addEventListener('click', () => {
container.classList.toggle('change');
});

//Scroll Button
scrollBtn.addEventListener('click', () => {
html.style.scrollBehavior = "smooth";
setTimeout(() => {
  html.style.scrollBehavior = "unset";
}, 1000);
});





//Group Buttons
groupsBtn.forEach(item => item. addEventListener('click', event => {
  renderShopCards(item.dataset.content);
  addEventCarts();
  boldGroup(item.dataset.content);
}));

//in den Einkaufswagen Button
function addEventCarts() {
  const addCarts = document.querySelectorAll('.addToCart');
  addCarts.forEach(item => {
  item.addEventListener('click', (element) => {
    let activeProduct = {};
    for (let i = 0; i < coffeeshop.length; i++) {
      if (coffeeshop[i].id == item.dataset.content) {
        activeProduct = coffeeshop[i];
      }
    }
    changeCartItem(activeProduct, "plus");
    addCartNumbers();
    addCartSum(activeProduct);
    renderCartCount();
  });
});
}

//Einkaufswagen Button
cartBtn.addEventListener('click', () => {
  cardPage.classList.toggle("hideCart");
  renderCart();
  renderTotal();
});

//Löschen Button im Einkaufswagen
function deleteBtnEvent() {
  const deleteBtns = document.querySelectorAll('#deleteBtn');
  deleteBtns.forEach(item => {
    item.addEventListener('click', element => {
      deleteCartItem(item.dataset.content);
      renderTotal();
      renderCartCount();
      renderCart();
    });
  });
}

//oneMore Button im Einkaufswagen
function oneMoreBtnEvent() {
  const oneMoreBtns = document.querySelectorAll('#oneMoreBtn');
  oneMoreBtns.forEach(item => {
    item.addEventListener('click', element => {
      let activeProduct = {};
      for (let i = 0; i < coffeeshop.length; i++) {
        if (coffeeshop[i].id == item.dataset.content) {
          activeProduct = coffeeshop[i];
      }
    }
      changeCartItem(activeProduct, "plus");
      addCartNumbers();
      addCartSum(activeProduct);
      renderTotal();
      renderCartCount();
      renderCart();
    });
  });
}

//oneLess Button im Einkaufswagen
function oneLessBtnEvent() {
  const oneLessBtns = document.querySelectorAll('#oneLessBtn');
  oneLessBtns.forEach(item => {
    item.addEventListener('click', element => {
      let activeProduct = {};
      for (let i = 0; i < coffeeshop.length; i++) {
        if (coffeeshop[i].id == item.dataset.content) {
          activeProduct = coffeeshop[i];
      }
    }
      changeCartItem(activeProduct, "minus");
      minusCartNumbers();
      minusCartSum(activeProduct);
      renderTotal();
      renderCartCount();
      renderCart();
    });
  });
}

//Close Button im Einkaufswagen
closeBtn.addEventListener('click', () => {
  cardPage.classList.toggle("hideCart");
  renderCartCount();
});

// Ende
// EventHandler ---------------
// Ende

// Start
// Ausführen der Funktionen beim laden ----
// Start
startShop();
renderCartCount();
// Ende
// Ausführen der Funktionen beim laden ----
// Ende

// Start
// Funktionen -----------------
// Start

//Laden der JSON-Datei
var coffeeshop = [];
async function startShop() {
  coffeeshop = await getmenu();
  await renderShopCards('alles');
  await boldGroup('alles');
  await addEventCarts();
}
function getmenu() {
  return fetch('./coffeeshop.json')
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

//Funktion zum rendern der aktuellen Gruppe
function renderShopCards(category) {
  shopCardsWrapper.innerHTML = "";
  if (category == 'alles') {
    coffeeshop.forEach(element => {
      renderShopCard(element);
    });
  } else {
    coffeeshop.filter(element => element.category == category).forEach(element => {
      renderShopCard(element);
    });
  }
}

//Funktion zum rendern der Karten
function renderShopCard(element) {
  const shopCardText = `
    <div class="shopCard-img-wrapper">
      <img src="${element.picturelarge}" loading="lazy">
      <button class="addToCart" data-content="${element.id}"><i class="fas fa-cart-arrow-down"></i></button>
    </div>
    <div class="shopCard-info">
      <h2>${element.name}</h2>
      <h3>${element.price},00 €</h3>
      <p>${element.desc}</p>
    </div>
  `;
  const shopCard = document.createElement('div');
  shopCard.classList.add('shopCard');
  shopCard.innerHTML = shopCardText;
  shopCardsWrapper.appendChild(shopCard);
}

// Schriftart für aktive Gruppe verändern
function boldGroup(group) {
  document.querySelectorAll('.group-heading').forEach((e) => {
    e.style.fontWeight = 300;
  });
  const groupData = `[data-content=\"${group}\"]`;
  document.querySelector(groupData).style.fontWeight = 600;
}

// Produkt ändern und im LocalStorage abspeichern
function changeCartItem(product, action) {
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);
  if (action == "plus") {
    if (cartItems != null) {
      if (cartItems[product.id] == undefined) {
        cartItems = {
          ...cartItems,
          [product.id]:product
        };
        product.inCart = 0;
      }
    } else {
      product.inCart = 0;
      cartItems = {
        [product.id]:product
      };
    }
    cartItems[product.id].inCart += 1;
  } else if ((action == "minus")) {
    if (cartItems[product.id].inCart == 1) {
      delete cartItems[product.id];
    } else {
      cartItems[product.id].inCart -= 1;
    }
  }
  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

//Produkt im LocalStorage löschen
function deleteCartItem(product) {
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);
  let productNumbers = localStorage.getItem('cartNumbers');
  productNumbers = parseInt(productNumbers);
  let sumNumbers = localStorage.getItem('cartSum');
  sumNumbers = parseFloat(sumNumbers);
  for (let item in cartItems) {
    if (item == product) {
      productNumbers = productNumbers - cartItems[item].inCart;
      sumNumbers = sumNumbers - (cartItems[item].inCart * cartItems[item].price);
      delete cartItems[item];
    }
  }
  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
  localStorage.setItem('cartNumbers', productNumbers);
  localStorage.setItem('cartSum', parseFloat(sumNumbers));
}

// +1 in Anzahl in den LocalStorage abspeichern
function addCartNumbers() {
  let productNumbers = localStorage.getItem('cartNumbers');
  productNumbers = parseInt(productNumbers);
  if (productNumbers) {
    localStorage.setItem('cartNumbers', productNumbers + 1);
  } else {
    localStorage.setItem('cartNumbers', 1);
  }
}

// -1 in Anzahl in den LocalStorage abspeichern
function minusCartNumbers() {
  let productNumbers = localStorage.getItem('cartNumbers');
  productNumbers = parseInt(productNumbers);
  localStorage.setItem('cartNumbers', productNumbers - 1);
}

// neue Summe in den LocalStorage abspeichern
function addCartSum(product) {
  let sumNumbers = localStorage.getItem('cartSum');
  sumNumbers = parseFloat(sumNumbers);
  if (sumNumbers) {
    localStorage.setItem('cartSum', (sumNumbers + parseFloat(product.price)));
  } else {
    localStorage.setItem('cartSum', parseFloat(product.price));
  }
}

// neue Summe in den LocalStorage abspeichern
function minusCartSum(product) {
  let sumNumbers = localStorage.getItem('cartSum');
  sumNumbers = parseFloat(sumNumbers);
  localStorage.setItem('cartSum', (sumNumbers - parseFloat(product.price)));
}

//Anzahl der Waren in das Warenkorbicon rendern
function renderCartCount() {
  let productNumbers = localStorage.getItem('cartNumbers');
  productNumbers = parseInt(productNumbers);
  if (productNumbers) {
    cartCount.innerHTML = productNumbers;
  } else {
    cartCount.innerHTML = 0;
  }
}

// Summe in den Warenkorb rendern
function renderTotal() {
  let cartSum = localStorage.getItem("cartSum");
  if (cartSum) {
    totalCart.innerHTML = cartSum;
  } else {
    totalCart.innerHTML = "0";
  }
}

// Waren in den Warenkorb rendern
function renderCart() {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let products = document.querySelector('.products');
  if (cartItems) {
    products.innerHTML = "";
    Object.values(cartItems).map(item => {
      products.innerHTML += `
        <div class="product">
          <div class="product-title">
            <button id="deleteBtn" class="btn delete" data-content="${item.id}"><i class="fas fa-times-circle"></i></button>\xa0
            <img src="${item.picturesmall}">\xa0
            <span>${item.name}</span>
          </div>
          <div class="price">€ ${item.price},00</div>
          <div class="quantity">
            <button id="oneLessBtn" class="btn oneLess" data-content="${item.id}"><i class="fas fa-angle-left"></i></button>
            <p>  </p>
            <span>${item.inCart}</span>
            <p>  </p>
            <button id="oneMoreBtn" class="btn oneMore" data-content="${item.id}"><i class="fas fa-angle-right"></i></button>
          </div>
          <div class="total">€ ${item.inCart * item.price},00</div>
        </div>
      `;
    });
  }
  deleteBtnEvent();
  oneLessBtnEvent();
  oneMoreBtnEvent();
}


// Ende
// Funktionen -----------------
// Ende