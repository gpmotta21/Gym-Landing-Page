const setTheme = (mode) => localStorage.setItem('lightTheme', (mode));
const getTheme = () => localStorage.getItem('lightTheme') ?? '';


const setItem = (item) => localStorage.setItem('items', JSON.stringify(item));
const getItem = () => JSON.parse(localStorage.getItem('items')) ?? [];

const setTotal = (total) => localStorage.setItem('total', JSON.stringify(total));
const getTotal = () => JSON.parse(localStorage.getItem('total')) ?? '';

var theme = getTheme()

if (theme == '') {
    theme = 'd';
    setTheme(theme);
}

// Send array of object containing the item name, price and amount
function sendItemsToDb(d) {
    const item = getItem();
    var iName = d.getAttribute('value');
    var price = d.getAttribute('data-price');

    item.push({ iName, price, 'amount': '1' });

    const uniq = new Set(item.map(e => JSON.stringify(e)));         // Removing duplicate objects from the array
    const uniqItems = Array.from(uniq).map(e => JSON.parse(e));

    setItem(uniqItems);                                             // Send array of objects to the local storage
    total()
    showOnScreen()
}

// This function will take all the information in the local storage and will send to the page
function showOnScreen() {
    clearScreen()

    // / / / / /  / / Segment dedicated to create the products inside the cart page / / / / / / / / / / / / / / / / 
    
    const uniqItem = getItem()
    uniqItem.forEach((item, index) => {                            
        
        var newElement = document.createElement('div');
        newElement.classList.add('product');
        newElement.innerHTML = `
        <div class='item'>
        <span>${item.iName}</span>
        <span>$${item.price}</span>
        </div>
        <div class='amount'>
        <button type="button" class="amountBtn" onclick="setAmount(this, '-')" data-index="${index}">-</button>
        <span>${item.amount}</span>
        <button type="button" class="amountBtn" onclick="setAmount(this, '+')" data-index="${index}">+</button>
        </div>
        `
        var cartItems = document.querySelector('#cartItems');
        cartItems.appendChild(newElement);
    });

    // / / / / / / / This segment will write the total price and total amount of items in the cart / / / / / / / / / /
    
    var total = getTotal();
    if(uniqItem.length !== 0){
        document.querySelector('#p').textContent ='$ ' + total.price.toFixed(2);
        document.querySelector('#totalAmount').textContent = total.amount
    }
    else if(uniqItem.length == 0){
        document.querySelector('#p').textContent ='Please add something to the cart';
        document.querySelector('#totalAmount').textContent = '';
    }

    // / / / / / / / / In this segment, the theme of the page will be set / / / / / / / / / / / / / / / / / / / / / / / 

    var theme = getTheme()

    if (theme == '') {
        theme = 'd';
        setTheme(theme);
    }

    if (theme == 'e') {
        document.body.classList.remove('lightTheme')
        document.body.classList.add('darkTheme')
        
    }
    else if (theme == 'd') {
        document.body.classList.remove('darkTheme')
        document.body.classList.add('lightTheme')
        
    }
}

// Removes last child registered in the HTML
function clearScreen() {
    while (cartItems.lastChild) {
        cartItems.removeChild(cartItems.lastChild);
    }
}

// Function to change amount of items
function setAmount(d, symbol) {
    const item = getItem()
    var index = d.getAttribute('data-index');

    if (symbol == '-') {
        item[index].amount--;

        if (item[index].amount == 0) {
            item.splice(index, 1);
        }
    }
    else if (symbol == '+' && item[index].amount < 10) {
        item[index].amount++;
    }
    else if(symbol == '+' && item[index].amount == 10){
        document.querySelector('#warning').textContent = 'You can only add 10 items of each product'
    }

    setItem(item)
    total()
    showOnScreen()
}

// Set total amount of items and total price
function total() {
    const item = getItem()
    var t = getTotal()
      
        var p = item.reduce(function(prev, cur){
            return prev + (cur.price * cur.amount);
        }, 0)

        var a = item.reduce(function(prev, cur){
            return parseInt(prev) + parseInt(cur.amount);
        }, 0)

    var total = {
        price : p,
        amount: a
    }

    t = total;
    setTotal(t)
    showOnScreen()

}

function optionsToggle() {
    var middleOpt = document.querySelector('#lSide');

    document.querySelector('#name > button').classList.toggle('btnToggle');
    middleOpt.classList.toggle('navBarToggle')
}

function showCart() {
    document.querySelector('#cartPage').classList.add('cartPageOpen');
}

function closeCart() {
    document.querySelector('#cartPage').classList.remove('cartPageOpen');
    document.querySelector('#cartPage').classList.add('cartPageClose');
}

// In this function, the value of the current theme will be sent to de local storage
// d stands for 'default' and e stands for 'eneabled'
function sendThemeToDb() {
    var theme = getTheme()

    if (theme == 'd') {
        theme = 'e';
        setTheme(theme);
    }
    else if (theme == 'e') {
        theme = 'd'
        setTheme(theme);
    }
    showOnScreen()
}

showOnScreen()
