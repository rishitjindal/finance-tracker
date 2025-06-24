document.addEventListener("DOMContentLoaded", function () {
  // Show current date
  const dateSpan = document.getElementById("current-date");
  const today = new Date();
  if (dateSpan) {
    dateSpan.textContent = today.toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Auth check
  const username = localStorage.getItem("loggedInUser");
  if (!username) return window.location.href = "index.html";
  const userDisplay = document.getElementById("user-display");
  if (userDisplay) userDisplay.textContent = username;

  // Elements
  const incomeEl = document.getElementById("income");
  const expenseEl = document.getElementById("expense");
  const balanceEl = document.getElementById("balance");
  const listEl = document.getElementById("transaction-list");
  const form = document.getElementById("transaction-form");
  const pieCtx = document.getElementById("expenseChart")?.getContext("2d");
  const trendCtx = document.getElementById("trendChart")?.getContext("2d");

  let transactions = JSON.parse(localStorage.getItem(`${username}_transactions`)) || [];
  let pieChart;

  // Update UI
  function updateUI() {
    let income = 0;
    let expense = 0;
    listEl.innerHTML = "";

    transactions.forEach((t, index) => {
      const li = document.createElement("li");
      li.className = "bg-gray-800 p-4 rounded-lg flex justify-between items-center";
      li.innerHTML = `
        <div>
          <strong>${t.desc}</strong> - ₹${t.amount} <small class="text-gray-400">(${t.category})</small>
          <br><span class="text-sm text-${t.type === 'income' ? 'green' : 'red'}-400">${t.type}</span>
        </div>
        <button onclick="deleteTransaction(${index})" class="text-red-400 hover:text-red-600">🗑️</button>
      `;
      listEl.appendChild(li);

      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    incomeEl.textContent = income;
    expenseEl.textContent = expense;
    balanceEl.textContent = income - expense;

    updatePieChart();
  }

  // Expense Pie Chart
  function updatePieChart() {
    const categoryMap = {};
    transactions.forEach((t) => {
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
    if (pieCtx) {
      pieChart = new Chart(pieCtx, {
        type: "pie",
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  // Line Trend Chart
  if (trendCtx) {
    new Chart(trendCtx, {
      type: "line",
      data: {
        labels: [
          "May 26", "May 29", "Jun 1", "Jun 4", "Jun 7", "Jun 10", "Jun 13", "Jun 16", "Jun 19", "Jun 22", "Jun 24"
        ],
        datasets: [
          {
            label: "Income",
            data: [150, 200, 250, 300, 350, 450, 600, 800, 1200, 1800, 5000],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4
          },
          {
            label: "Expenses",
            data: [50, 60, 70, 80, 70, 60, 50, 60, 70, 80, 100],
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom"
          },
          tooltip: {
            mode: "index",
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Add Transaction
  form?.addEventListener("submit", function (e) {
    e.preventDefault();
    const desc = document.getElementById("desc").value.trim();
    const amount = +document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const type = document.getElementById("type").value;

    if (!desc || amount <= 0) {
      alert("Please enter a valid description and amount.");
      return;
    }

    transactions.push({ desc, amount, category, type });
    localStorage.setItem(`${username}_transactions`, JSON.stringify(transactions));
    form.reset();
    updateUI();
  });

  window.deleteTransaction = function (index) {
    if (confirm("Delete this transaction?")) {
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
