document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("loggedInUser");
  if (!username) return window.location.href = "index.html";

  document.getElementById("user-display").textContent = username;

  const incomeEl = document.getElementById("income");
  const expenseEl = document.getElementById("expense");
  const balanceEl = document.getElementById("balance");
  const listEl = document.getElementById("transaction-list");
  const form = document.getElementById("transaction-form");
  const ctx = document.getElementById("expenseChart")?.getContext("2d");

  let transactions = JSON.parse(localStorage.getItem(`${username}_transactions`)) || [];
  let pieChart;

  function updateUI() {
    listEl.innerHTML = "";
    let income = 0, expense = 0;

    transactions.forEach((t, index) => {
      const li = document.createElement("li");
      li.className = "bg-gray-50 p-3 rounded-lg flex justify-between items-center shadow-sm";
      li.innerHTML = `
        <div>
          <strong>${t.desc}</strong> <span class="text-sm text-gray-500">(${t.category})</span><br>
          <span class="text-${t.type === 'income' ? 'green' : 'red'}-600 font-medium">₹${t.amount}</span>
        </div>
        <button onclick="deleteTransaction(${index})" class="text-red-500 hover:text-red-700">🗑️</button>
      `;
      listEl.appendChild(li);

      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    incomeEl.textContent = income.toLocaleString();
    expenseEl.textContent = expense.toLocaleString();
    balanceEl.textContent = (income - expense).toLocaleString();

    updateChart();
  }

  function updateChart() {
    if (!ctx) return;
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
        backgroundColor: ["#f87171", "#fbbf24", "#60a5fa", "#34d399", "#a78bfa"]
      }]
    };

    if (pieChart) pieChart.destroy();
    pieChart = new Chart(ctx, {
      type: "pie",
      data,
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  form?.addEventListener("submit", function (e) {
    e.preventDefault();
    const desc = document.getElementById("desc").value.trim();
    const amount = +document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const type = document.getElementById("type").value;

    if (!desc || !amount || amount <= 0) {
      alert("Please fill out valid description and amount.");
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
