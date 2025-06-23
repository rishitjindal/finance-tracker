document.addEventListener("DOMContentLoaded", function () {
  const user = localStorage.getItem("loggedInUser");
  document.getElementById("user-name").textContent = user;

  const incomeEl = document.getElementById("income");
  const expenseEl = document.getElementById("expense");
  const balanceEl = document.getElementById("balance");
  const listEl = document.getElementById("transaction-list");
  const form = document.getElementById("transaction-form");

  let transactions = JSON.parse(localStorage.getItem(`${user}_transactions`)) || [];

  function updateUI() {
    listEl.innerHTML = "";
    let income = 0, expense = 0;

    transactions.forEach(t => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${t.desc}</td>
        <td>₹${t.amount}</td>
        <td>${t.category}</td>
        <td>${t.type}</td>
      `;
      listEl.appendChild(row);

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
    localStorage.setItem(`${user}_transactions`, JSON.stringify(transactions));

    form.reset();
    updateUI();
  });

  function updateChart() {
    const ctx = document.getElementById("expenseChart").getContext("2d");
    const data = {};

    transactions.forEach(t => {
      if (t.type === "expense") {
        data[t.category] = (data[t.category] || 0) + t.amount;
      }
    });

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(data),
        datasets: [{
          data: Object.values(data),
          backgroundColor: ["#f94144", "#f3722c", "#90be6d", "#577590", "#ffbe0b"]
        }]
      }
    });
  }

  updateUI();
});

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
document.addEventListener("DOMContentLoaded", function () {
  const user = localStorage.getItem("loggedInUser");
  const form = document.getElementById("transaction-form");
  const desc = document.getElementById("desc");
  const amount = document.getElementById("amount");
  const category = document.getElementById("category");
  const type = document.getElementById("type");
  const list = document.getElementById("transaction-list");

  let transactions = JSON.parse(localStorage.getItem(`${user}_transactions`)) || [];

  function render() {
    list.innerHTML = "";
    transactions.forEach(t => {
      const li = document.createElement("li");
      li.textContent = `${t.desc} - ₹${t.amount} (${t.category}, ${t.type})`;
      list.appendChild(li);
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const newTransaction = {
      desc: desc.value,
      amount: +amount.value,
      category: category.value,
      type: type.value
    };
    transactions.push(newTransaction);
    localStorage.setItem(`${user}_transactions`, JSON.stringify(transactions));
    render();
    form.reset();
  });

  render();
});
