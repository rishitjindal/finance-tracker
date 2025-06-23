// Signup logic
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.username === username)) {
      alert("Username already exists!");
      return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful!");
    window.location.href = "index.html";
  });
}

// Login logic
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const match = users.find(u => u.username === username && u.password === password);

    if (match) {
      localStorage.setItem("loggedInUser", username);  // save logged in user
      window.location.href = "dashboard.html";         // ✅ redirect to main page
    } else {
      alert("Invalid username or password");
    }
  });
}

// Dashboard

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateValues() {
  const incomeAmt = transactions
    .filter(t => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const expenseAmt = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  income.textContent = incomeAmt;
  expense.textContent = expenseAmt;
  balance.textContent = incomeAmt - expenseAmt;
}

function renderTransactions() {
  list.innerHTML = "";
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.textContent = `${t.desc} - ₹${t.amount} (${t.category})`;
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const desc = document.getElementById("desc").value;
  const amount = +document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const type = document.getElementById("type").value;

  const newTransaction = { desc, amount, category, type };
  transactions.push(newTransaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  
  updateValues();
  renderTransactions();
  updateChart();

  form.reset();
});

// Chart rendering
function updateChart() {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  const data = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      data[t.category] = (data[t.category] || 0) + t.amount;
    }
  });

  const chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: ["#f94144", "#f3722c", "#43aa8b", "#577590"]
      }]
    }
  });
}

// Initial load
updateValues();
renderTransactions();
updateChart();
