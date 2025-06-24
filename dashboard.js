document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("loggedInUser");
  if (!user) return (window.location.href = "index.html");

  // Get DOM elements
  const transactionList = document.getElementById("transaction-list");
  const entryForm = document.getElementById("entry-form");
  const totalBalance = document.querySelector(".chart-section h3");

  // Local data
  let transactions = JSON.parse(localStorage.getItem(`${user}_transactions`) || "[]");

  // Format currency
  const formatMoney = amount =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  // Render table
  function renderTransactions() {
    transactionList.innerHTML = "";
    let total = 0;

    transactions.forEach((t, index) => {
      const row = document.createElement("tr");
      const type = t.type === "income" ? "Income" : "Expense";
      const sign = t.type === "income" ? "+" : "-";
      if (t.type === "income") {
        total += t.amount;
      } else {
        total -= t.amount;
      }

      row.innerHTML = `
        <td>${type}</td>
        <td>${sign} ${formatMoney(t.amount)}</td>
        <td>${t.date || "N/A"}</td>
      `;

      row.addEventListener("dblclick", () => {
        if (confirm("Delete this transaction?")) {
          transactions.splice(index, 1);
          localStorage.setItem(`${user}_transactions`, JSON.stringify(transactions));
          renderTransactions();
        }
      });

      transactionList.appendChild(row);
    });

    totalBalance.textContent = `Total Balance: ${formatMoney(total)}`;
  }

  // Handle form
  entryForm.addEventListener("submit", e => {
    e.preventDefault();
    const inputs = entryForm.querySelectorAll("input");
    const [typeInput, amountInput, dateInput] = inputs;
    const amount = parseFloat(amountInput.value);

    if (!typeInput.value || isNaN(amount)) {
      alert("Please fill all fields correctly.");
      return;
    }

    transactions.push({
      type: typeInput.value.toLowerCase(),
      amount,
      date: dateInput.value,
    });

    localStorage.setItem(`${user}_transactions`, JSON.stringify(transactions));
    entryForm.reset();
    renderTransactions();
  });

  renderTransactions();
});

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
