const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const incomeFormEl = document.getElementById('income-form');
const expenseFormEl = document.getElementById('expense-form');
const transactionListEl = document.getElementById('transactions');
const themeToggleEl = document.getElementById('theme-toggle');
const downloadHistoryEl = document.getElementById('download-history');

let transactions = [];

// Add transaction
function addTransaction(e, type) {
    e.preventDefault();

    const textEl = document.getElementById(`${type}-text`);
    const amountEl = document.getElementById(`${type}-amount`);

    if (textEl.value.trim() === '' || amountEl.value.trim() === '') {
        alert('Please add a description and amount');
        return;
    }

    const transaction = {
        id: generateID(),
        text: textEl.value,
        amount: type === 'income' ? +amountEl.value : -amountEl.value,
        type: type
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    textEl.value = '';
    amountEl.value = '';
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// adding transactions to DOM list
function addTransactionDOM(transaction) {
    const item = document.createElement('li');
    item.classList.add(transaction.type === 'income' ? 'plus' : 'minus');

    item.innerHTML = `
    ${transaction.text} <span>${transaction.amount < 0 ? '-' : '+'}₹${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

    transactionListEl.appendChild(item);
}

// updating the balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1)
        .toFixed(2);

    balanceEl.innerText = `₹${total}`;
    moneyPlusEl.innerText = `+₹${income}`;
    moneyMinusEl.innerText = `-₹${expense}`;
}

// removing transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// updating local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    updateLocalStorage();
}

// download transaction history
function downloadHistory() {
    const transactionHistory = transactions.map(t => 
        `${t.text},${t.amount},${t.type}`
    ).join('\n');
    
    const blob = new Blob([`Description,Amount,Type\n${transactionHistory}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'transaction_history.csv');
    a.click();
}

// Init app
function init() {
    transactionListEl.innerHTML = '';
    transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.forEach(addTransactionDOM);
    updateValues();
    
    // set initial dark mode state
    if (JSON.parse(localStorage.getItem('darkMode'))) {
        document.body.classList.add('dark-mode');
    }
}

// event listeners
incomeFormEl.addEventListener('submit', e => addTransaction(e, 'income'));
expenseFormEl.addEventListener('submit', e => addTransaction(e, 'expense'));
themeToggleEl.addEventListener('click', toggleDarkMode);
downloadHistoryEl.addEventListener('click', downloadHistory);

init();