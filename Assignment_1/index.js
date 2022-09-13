
//Headlines
const overskriftElement = document.getElementById("overskrift")
const nameElement = document.getElementById("navn")
const workElement = document.getElementById("arbeid")
const featuresElement = document.getElementById("features")
const laptopNameElement = document.getElementById("laptopnavn")
const descriptionElement = document.getElementById("description")

//Buttons
const loanButtonElement = document.getElementById("loan-button")
const bankButtonElement = document.getElementById("bank-button")
const workButtonElement = document.getElementById("work-button")
const dropDownButtonElement = document.getElementById("choose-laptop")
const buyNowButtonElement = document.getElementById("buy-now")
const repayLoanButtonElement = document.getElementById("repay-loan")

//MoneyHolders
const payElement = document.getElementById("pay")
const balanceElement = document.getElementById("balance")
const loanElement = document.getElementById("loan")
const priceElement = document.getElementById("price")

//Image
const imageElement = document.getElementById("image-computer")

//URL
const baseURL = "https://noroff-komputer-store-api.herokuapp.com/"

//Firework
const fireworkElement = document.getElementById("firework")

let laptops = [] //Store all laptops
let balance = 0 //Money in account
let pay = 0 //Money earned from working
let price = 0 //Price for laptop
let loaned = 0 //Money loaned from bank
let hasLoan = false //Do you have a loan? 

//FETCH DATA
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => { laptops = data })
    .then(addLaptops)
    .catch(err => console.log(err))


//FUNCTIONS
function addLaptops() { //Add laptop to Selection, display features and other elements
    for (i = 0; i < laptops.length; i++) {
        const laptopElement = document.createElement("option")
        laptopElement.value = i
        laptopElement.innerText = laptops[i].title
        dropDownButtonElement.appendChild(laptopElement)
    }
    handleFeatures()
    payElement.innerText = pay
    balanceElement.innerText = balance
}

function handleFeatures() { //Add features to each laptop
    const id = dropDownButtonElement.value
    const thisLaptop = laptops[id]
    featuresElement.innerText = ""
    for (i = 0; i < thisLaptop.specs.length; i++) {
        const featElement = document.createElement("li")
        featElement.innerText = thisLaptop.specs[i]
        featuresElement.appendChild(featElement)
    }
    imageElement.src = baseURL + thisLaptop.image
    imageElement.onerror = () => {
        imageElement.src = "https://http.cat/404.jpg"; //Display default picture onError
        console.log("img not found, displaying another")
    }

    priceElement.innerText = thisLaptop.price
    laptopNameElement.innerText = thisLaptop.title
    descriptionElement.innerText = thisLaptop.description
}

function workMoney() { //Increase money when work
    pay += 100
    payElement.innerText = pay
}


function transferMoney() { //Transfer money from Work to Bank Balance 
    if (hasLoan === true) {
        loaned -= pay * 0.1
        if (loaned < 0) {
            balance += Math.abs(loaned)
            loaned = 0
        }
        balance += pay * 0.9
        pay = 0
        payElement.innerText = pay
        balanceElement.innerText = balance
        loanElement.innerText = "Loaned: " + loaned
        if (loaned <= 0) {
            hasLoan = false
            repayLoanButtonElement.setAttribute("hidden", true)
            loanElement.setAttribute("hidden", true)
        }
        return 0
    }
    balance += pay
    pay = 0
    payElement.innerText = pay
    balanceElement.innerText = balance
}

function addLoan() { //Get a Loan
    let input = prompt("Please enter loan amount:", loaned)
    input = parseInt(input)
    if (!Number.isInteger(input) || input > (balance * 2) || hasLoan === true || input < 1) {
        alert("You are not eligible to get this loan")
    }
    else {
        hasLoan = true
        loaned += input
        balance += input
        loanElement.innerText = "Loaned: " + loaned
        balanceElement.innerText = balance
        repayLoanButtonElement.removeAttribute("hidden")
        loanElement.removeAttribute("hidden")
    }
}




function payLoan() { //Pay your loan directly
    loaned -= pay
    pay = 0
    if (loaned < 0) {
        balance += Math.abs(loaned)
        loaned = 0
    }
    if (loaned <= 0) {
        hasLoan = false
        repayLoanButtonElement.setAttribute("hidden", true)
        loanElement.setAttribute("hidden", true)
    }
    loanElement.innerText = "Loaned: " + loaned
    payElement.innerText = pay
    balanceElement.innerText = balance
}

function buyLaptop() { //Purchase the laptop
    const id = dropDownButtonElement.value
    const price = laptops[id].price
    if (balance >= price) {
        balance -= price
        fireworkElement.style.display = "unset"
        alert("Congratulations! You have bought the computer: " + laptops[id].title)
        balanceElement.innerText = balance
    }
    else {
        alert("Not enough money to buy this computer.....")
    }
}




//Event listeners
dropDownButtonElement.addEventListener("change", handleFeatures)
workButtonElement.addEventListener("click", workMoney)
bankButtonElement.addEventListener("click", transferMoney)
loanButtonElement.addEventListener("click", addLoan)
repayLoanButtonElement.addEventListener("click", payLoan)
buyNowButtonElement.addEventListener("click", buyLaptop)


























