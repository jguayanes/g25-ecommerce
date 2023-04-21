const pStock = "https://ecommercebackend.fundamentos-29.repl.co/"
const toggleCartView = document.querySelector(".cart__toggle");
const cartPanel = document.querySelector(".cart__panel");
const productList = document.querySelector("#products-showcase");
const cart = document.querySelector("#cart");
const cartPList = document.querySelector("#cart__p__list");
emptyCartButton = document.querySelector('#empty__cart');
const modalContainer = document.querySelector('#modal__container');
const modalElement = document.querySelector('#modal');
let cartProducts = [];
let modalDetails = [];
eventListenerLoader();
function eventListenerLoader() {
  productList.addEventListener("click", addProduct)
  cart.addEventListener('click', deleteProduct)
  emptyCartButton.addEventListener('click', emptyCar)
  document.addEventListener('DOMContentLoaded', () => {
    cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
    cartPanelElements();
  })
  productList.addEventListener('click', viewModal);
  modalContainer.addEventListener('click', closeModal)
}
toggleCartView.addEventListener("click", () => {
  cartPanel.classList.toggle("nav__cart__view")
})
function getProducts() {
  axios.get(pStock)
    .then(function(response){
      const products=response.data;
      showProducts(products)
    })
    .catch(function(error){
      console.log(error);
    })
}
getProducts()
function showProducts(products) {
  let html = "";
  for  (let i = 0; i < products.length; i++) {
    html += `
    <div class="product__cell">
      <div class="product__c__img">
        <img src="${products[i].image}" alt="Image">
      </div>
      <div class="product__c__name">
        <p>${products[i].name}</p>
      </div>
      <div class="product__c__price">
        <p>$ ${products[i].price.toFixed(2)}</p>
      </div>
      <div class="product__c__button">
        <button class="cart__button add__to__cart" id="a_add__to__cart" data-id="${products[i].id}">Añadir al carro</button>
        <button class="product__details add__to__details" data-id="${products[i].id}">Ver detalles</button>
      </div>
    </div>
    `
  }
  productList.innerHTML = html;
}
function addProduct(event) {
  if(event.target.classList.contains("add__to__cart")){
    const product = event.target.parentElement.parentElement
    cartProductsElements(product)
  }
}
function cartProductsElements(product){
  const infoProduct = {
    id: product.querySelector("button").getAttribute("data-id"),
    image: product.querySelector("img").src,
    name: product.querySelector(".product__c__name p").textContent,
    price: product.querySelector(".product__c__price p").textContent,
    quantity: 1
  }
  if (cartProducts.some(product => product.id === infoProduct.id)){
    const product = cartProducts.map(product => {
      if(product.id === infoProduct.id){
        product.quantity++;
        return product;
      } else {
        return product;
      }
    })
    cartProducts = [...product]
  } else {
    cartProducts = [...cartProducts, infoProduct]
  }
  cartPanelElements()
}
function cartPanelElements(){
  cartPList.innerHTML = "";
  cartProducts.forEach(product => {
    const divPanel = document.createElement("div");
    divPanel.innerHTML = `
      <div class="cart__item">
        <div class="cart__item__image">
          <img src="${product.image}">
        </div>
        <div class="cart__item__desc">
          <p>${product.name}</p>
          <p>Precio: ${product.price}</p>
          <p>Cantidad: ${product.quantity}</p>
        </div>
        <div class="cart__item__button">
          <button class="delete__item" data-id="${product.id}">
            Delete
          </button>
        </div>
      </div>
      <hr>
    `;
    cartPList.appendChild(divPanel);
  })
  productsStorage()
}
function deleteProduct (event){
  if (event.target.classList.contains('delete__item')){
    const productId = event.target.getAttribute('data-id')
    cartProducts = cartProducts.filter(product => product.id !== productId)
    cartPanelElements()
  }
}
function emptyCar(){
  cartProducts = [];
  cartPanelElements();
}
function productsStorage() {
  localStorage.setItem('cart', JSON.stringify(cartProducts))
}
function viewModal (event){
  if(event.target.classList.contains('product__details')){
    modalContainer.classList.add('show__modal')
    const product = event.target.parentElement.parentElement
    detailsElement(product)
  }
}
function closeModal(event){
  if (event.target.classList.contains('icon__modal')){
    modalContainer.classList.remove('show__modal')
    modalElement.innerHTML ="";
    modalDetails = []
  }
}
function detailsElement(product){
  const infoDetails =[{
    id: product.querySelector('button').getAttribute('data-id'),
    image: product.querySelector('img').src,
    name: product.querySelector('.product__c__name p').textContent,
    price: product.querySelector('.product__c__price p').textContent,
  }]
  modalDetails = [...infoDetails]
  modalHTML();
}
function modalHTML() {
  let modalDetailsHTML = "";
  for(let element of modalDetails){
    modalDetailsHTML += `
      <div class="principal__element">
        <div class="first__modal__section">
          <div class="first__modal__text">
            <p>${element.name}</p>
            <p>${element.price}</p>
          </div>
          <div class="first__modal__colors">
            <p>Colores</p>
            <div>
            <img src="${element.image}">
            </div>
          </div>
          <div class="first__modal__sizes__text">
            <div>
              <p>Tallas</p>
            </div>
          </div>
          <div class="first__modal__sizes">
            <div>
              <p>Xs</p>
            </div>
            <div>
              <p>S</p>
            </div>
            <div>
              <p>M</p>
            </div>
            <div>
              <p>L</p>
            </div>
            <div>
              <p>XL</p>
            </div>
          </div>
        </div>
        <div class="second__modal__section">
          <div class="modal__vector"></div>
          <img src="${element.image}">
          
        </div>
      </div>
    `;
  }

  modalElement.innerHTML = modalDetailsHTML;

}

