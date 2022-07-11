const clientURL = location.origin + location.pathname.split('/').slice(0, location.pathname.split('/').length - 1).join('/');
const serverUrl = 'http://localhost:3000';

let products;
let cartItems;

window.onload = function(){
    const token = sessionStorage.getItem('accessToken')
    if(token) {
        document.getElementById('loginMsg').innerHTML = 'Welcome, ' + token.split('-')[1] + '!';
        document.getElementById('logoutBtn').onclick = logout;
        document.getElementById('placeOrderBtn').onclick = placeOrder;
        download();
    } else {
        redirectToLogin()
    }
}

async function download() {
    products = [];
    cartItems = [];
    await fetchProducts();
    fetchCartItems();
}

function logout() {
    sessionStorage.removeItem('accessToken');
    redirectToLogin();
}

function redirectToLogin(){
    location.assign(clientURL + '/login.html');
}

async function fetchProducts(){
    let response = await fetch(serverUrl + '/api/products', {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    });

    if(response.ok) {
        let json = await response.json();  
        if(json.error) {
            postErrorMsg(json.error);
        } else {
            products = json;
            populateProducts();
        }
    } else {
        postErrorMsg('HTTP error ' + response.status);
    }
}

async function fetchCartItems(){
    let response = await fetch(serverUrl + '/api/carts', {
        headers: {            
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    });

    if(response.ok) {
        let json = await response.json();  
        if(json.error) {
            postErrorMsg(json.error);
        } else {
            cartItems = json;
            populateCartTable()
        }
    } else {
        postErrorMsg('HTTP error ' + response.status);
    }
}

async function addCartItem(prodId) {
    let response = await fetch(serverUrl + '/api/carts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body:JSON.stringify({productId: prodId})
    });

    if(response.ok) {
        let json = await response.json();  
        if(json.error) {
            postErrorMsg(json.error);
        } else {
            const index = cartItems.findIndex(i => i.productId === json.productId);
            if(index > -1) {
                cartItems[index].quantity = json.quantity;
                updateCartItem(cartItems[index]);
            } else {
                cartItems.push(json);
                populateCartTable();
            }
        }
    } else {
        postErrorMsg('HTTP error ' + response.status);
    }
}

async function removeCartItem(prodId) {
    let response = await fetch(serverUrl + '/api/carts', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body:JSON.stringify({productId: prodId})
    });

    if(response.ok) {
        const json = await response.json();  
        if(json.error) {
            postErrorMsg(json.error);
        } else {
            const item = json;
            if(item) {
                const index = cartItems.findIndex(i => i.productId === item.productId);
                if(index > -1) {
                    if(item.quantity > 0) {
                        cartItems[index].quantity = json.quantity;
                        updateCartItem(cartItems[index]);
                    } else {
                        cartItems = cartItems.filter(i => i.productId !== item.productId);
                        populateCartTable();
                    }
                    
                } else {
                    postErrorMsg('item not found from cartItems when removing');
                }
            } else {
                postErrorMsg('item returned null when calling remove item');
            }
        }
    } else {
        postErrorMsg('HTTP error ' + response.status);
    }
}

async function placeOrder(){
    const response = await fetch(serverUrl + '/api/orders/placeOrder', {
        method: 'POST',
        headers: {            
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    });

    if(response.ok) {
        const json = await response.json();  
        if(json.error)
            postErrorMsg(json.error);
        else {
            products = json;
            populateProducts();
            cartItems = [];
            populateCartTable()
        }
    } else {
        postErrorMsg('HTTP error ' + response.status);
    }
}

function addToCart() {
    if(this.stock > 0) {
        addCartItem(this.id);
    }
}

function removeFromCart() {
    removeCartItem(this.id);
}

function postErrorMsg(msg) {
    document.getElementById('errorMsg').innerHTML = msg;
}

function populateProducts() {
    document.getElementById('product-list').innerHTML = '';
    if(products.length > 0) {
        products.forEach(p=>renderProduct(p));
    }
}

function renderProduct(product) {
    const tr = document.createElement('tr');
    tr.id = 'tr-prod-' + product.id;

    const name = document.createElement('td');
    name.innerHTML = product.name;

    const price = document.createElement('td');
    price.innerHTML = product.price;

    const imageTd = document.createElement('td');
    const image = document.createElement('img')
    image.src = `${serverUrl}${product.image}`;
    image.className = 'product-image';
    imageTd.appendChild(image);

    const stock = document.createElement('td');
    stock.innerHTML = product.stock;

    const actionTd = document.createElement('td');
    const actionA  = document.createElement('a');
    const action = document.createElement('img');
    action.src = './views/cart.svg';
    action.alt = 'add to cart';
    action.className = 'cart-img';
    action.onclick = () => addToCart.call(product);
    actionA.appendChild(action); 
    actionTd.appendChild(actionA);

    tr.appendChild(name);
    tr.appendChild(price);
    tr.appendChild(imageTd);
    tr.appendChild(stock);
    tr.appendChild(actionTd);

    document.getElementById('product-list').appendChild(tr);
} 

function populateCartTable() {
    document.getElementById('cart-list').innerHTML = '';
    if(cartItems.length > 0) {
        cartItems.forEach(i=>renderCartItem(i));
        renderCartTotal();
        document.getElementById('empty-cart').style.display = 'none';
        document.getElementById('cart-table-container').style.display = 'block';
    } else {
        document.getElementById('empty-cart').style.display = 'block';
        document.getElementById('cart-table-container').style.display = 'none';
    }
}

function renderCartItem(item) {
    const tr = document.createElement('tr');
    tr.id = 'tr-item-' + item.productId;

    const product = products.find(p=>p.id == item.productId);

    const name = document.createElement('td');
    name.innerHTML = product.name;

    const price = document.createElement('td');
    price.innerHTML = product.price;

    const total = document.createElement('td');
    total.innerHTML = (product.price * item.quantity).toFixed(2);

    const quantityTd = document.createElement('td');
    const addBtn = document.createElement('button');
    addBtn.innerText = '+';
    addBtn.onclick = () => addToCart.call(product);
    const quantity = document.createElement('input');
    quantity.value = item.quantity;
    quantity.readOnly = true;
    const minusBtn = document.createElement('button');
    minusBtn.innerText = '-';
    minusBtn.onclick = () => removeFromCart.call(product);
    
    quantityTd.appendChild(minusBtn)
    quantityTd.appendChild(quantity)
    quantityTd.appendChild(addBtn)
    

    tr.appendChild(name);
    tr.appendChild(price);
    tr.appendChild(total);
    tr.appendChild(quantityTd);

    document.getElementById('cart-list').appendChild(tr);
}

function updateCartItem(item) {
    const tr = document.getElementById('tr-item-' + item.productId);
    const tableData = tr.querySelectorAll('td');
    tableData[2].textContent = (tableData[1].textContent * item.quantity).toFixed(2);
    tableData[3].querySelector('input').value = item.quantity;
    renderCartTotal();
}

function renderCartTotal(){
    let tr = document.getElementById('tr-prod-total');
    const totalPrice = cartItems.reduce((pre, curr) => pre + (products.find(p=>p.id === curr.productId).price * curr.quantity), 0)
    if(tr) {
        tr.querySelectorAll('td')[0].textContent = "Total: " + totalPrice.toFixed(2);
    } else {
        tr = document.createElement('tr');
        tr.id = 'tr-prod-total';
        const total = document.createElement('td');
        total.textContent = "Total: " + totalPrice.toFixed(2);
        total.colSpan = 4;
        total.style.textAlign = "center";
        tr.appendChild(total);
        document.getElementById('cart-list').appendChild(tr);
    }
}

