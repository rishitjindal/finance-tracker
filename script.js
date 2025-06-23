document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("signup-username").value;
      const password = document.getElementById("signup-password").value;
      let users = JSON.parse(localStorage.getItem("users")) || [];
      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", username);
      window.location.href = "dashboard.html";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid credentials");
      }
    });
  }
});

/* === dashboard.js === */
document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("loggedInUser");
  if (!username) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("user-display").textContent = username;
  const incomeEl = document.getElementById("income");
  const expenseEl = document.getElementById("expense");
  const balanceEl = document.getElementById("balance");
  const listEl = document.getElementById("transaction-list");
  const form = document.getElementById("transaction-form");

  let transactions = JSON.parse(localStorage.getItem(`${username}_transactions`)) || [];

  function updateUI() {
    listEl.innerHTML = "";
    let income = 0, expense = 0;

    transactions.forEach(t => {
      const li = document.createElement("li");
      li.textContent = `${t.desc} - ₹${t.amount} (${t.category}, ${t.type})`;
      listEl.appendChild(li);
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    incomeEl.textContent = income;
    expenseEl.textContent = expense;
    balanceEl.textContent = income - expense;
    updateChart();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const desc = document.getElementById("desc").value;
    const amount = +document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const type = document.getElementById("type").value;

    transactions.push({ desc, amount, category, type });
    localStorage.setItem(`${username}_transactions`, JSON.stringify(transactions));
    form.reset();
    updateUI();
  });

  function updateChart() {
    const ctx = document.getElementById("expenseChart").getContext("2d");
    const categoryMap = {};

    transactions.forEach(t => {
      if (t.type === "expense") {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
    });

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(categoryMap),
        datasets: [{
          data: Object.values(categoryMap),
          backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#4bc0c0"]
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  updateUI();
});

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
