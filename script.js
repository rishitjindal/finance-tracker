/* === auth.js (Tailwind style enhanced with alerts) === */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  function showAlert(message, type = 'error') {
    alert(type === 'success' ? '✅ ' + message : '❌ ' + message);
  }

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("signup-username").value.trim();
      const password = document.getElementById("signup-password").value;

      if (username.length < 3 || password.length < 4) {
        showAlert("Username or password too short");
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const exists = users.some(u => u.username === username);
      if (exists) return showAlert("User already exists");

      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", username);
      showAlert("Account created! Redirecting...", 'success');
      setTimeout(() => window.location.href = "dashboard.html", 1000);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value;

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem("loggedInUser", username);
        showAlert("Login successful! Redirecting...", 'success');
        setTimeout(() => window.location.href = "dashboard.html", 1000);
      } else {
        showAlert("Invalid username or password");
      }
    });
  }
});

/* === dashboard.js (Improved UX + Clear Card Updates) === */
document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("loggedInUser");
  if (!username) return window.location.href = "index.html";

  document.getElementById("user-display").textContent = username;
  const incomeEl = document.getElementById("income");
  const expenseEl = document.getElementById("expense");
  const balanceEl = document.getElementById("balance");
  const listEl = document.getElementById("transaction-list");
  const form = document.getElementById("transaction-form");
  const ctx = document.getElementById("expenseChart").getContext("2d");

  let transactions = JSON.parse(localStorage.getItem(`${username}_transactions`)) || [];
  let pieChart;

  function updateUI() {
    listEl.innerHTML = "";
    let income = 0, expense = 0;

    transactions.forEach((t, index) => {
      const li = document.createElement("li");
      li.className = "bg-gray-100 p-3 rounded flex justify-between items-center";
      li.innerHTML = `
        <div>
          <strong>${t.desc}</strong> <span class="text-sm text-gray-500">(${t.category})</span><br>
          <span class="text-${t.type === 'income' ? 'green' : 'red'}-600">₹${t.amount}</span>
        </div>
        <button onclick="deleteTransaction(${index})" class="text-red-500 hover:text-red-700">🗑️</button>
      `;
      listEl.appendChild(li);

      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    incomeEl.textContent = income;
    expenseEl.textContent = expense;
    balanceEl.textContent = income - expense;

    updateChart();
  }

  function updateChart() {
    const categoryMap = {};
    transactions.forEach(t => {
      if (t.type === "expense") {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
    });

    const data = {
      labels: Object.keys(categoryMap),
      datasets: [{
        data: Object.values(categoryMap),
        backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#6366f1"]
      }]
    };

    if (pieChart) pieChart.destroy();
    pieChart = new Chart(ctx, {
      type: "pie",
      data,
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const desc = document.getElementById("desc").value.trim();
    const amount = +document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const type = document.getElementById("type").value;

    if (!desc || !amount || amount <= 0) return alert("Fill valid description and amount");

    transactions.push({ desc, amount, category, type });
    localStorage.setItem(`${username}_transactions`, JSON.stringify(transactions));
    form.reset();
    updateUI();
  });

  window.deleteTransaction = function (index) {
    if (confirm("Are you sure you want to delete this transaction?")) {
      transactions.splice(index, 1);
      localStorage.setItem(`${username}_transactions`, JSON.stringify(transactions));
      updateUI();
    }
  };

  updateUI();
});

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
