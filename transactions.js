const descEl = document.getElementById("desc");
const amountEl = document.getElementById("amount");
const categoryEl = document.getElementById("category");
const typeEl = document.getElementById("type");
const form = document.getElementById("transaction-form");
const listEl = document.getElementById("transaction-list");

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

// Replace with logged-in user key if needed
const userKey = "default_user";

let transactions = JSON.parse(localStorage.getItem(`${userKey}_transactions`)) || [];

function formatAmount(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function renderTransactions() {
  listEl.innerHTML = "";

  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "transaction-item";

    const iconWrapper = document.createElement("div");
    iconWrapper.className = `icon-wrapper ${t.type === "income" ? "green" : "red"}`;
    iconWrapper.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${t.type === "income"
          ? "M5 13l4 4L19 7"
          : "M19 13l-4 4L5 7"}" />
      </svg>
    `;

    const details = document.createElement("div");
    details.className = "tx-details";
    details.innerHTML = `
      <strong>${t.desc}</strong>
      <div class="tx-meta">${t.category} • ${t.date || "undefined"}</div>
    `;

    const amount = document.createElement("div");
    amount.className = `tx-amount ${t.type === "income" ? "text-green" : "text-red"}`;
    amount.textContent = `${t.type === "income" ? "+" : "-"}${formatAmount(t.amount)}`;

    const delBtn = document.createElement("div");
    delBtn.className = "icon-wrapper";
    delBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="delete-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    `;
    delBtn.addEventListener("click", () => {
      transactions.splice(i, 1);
      localStorage.setItem(`${userKey}_transactions`, JSON.stringify(transactions));
      renderTransactions();
    });

    li.appendChild(iconWrapper);
    li.appendChild(details);
    li.appendChild(amount);
    li.appendChild(delBtn);

    listEl.appendChild(li);

    if (t.type === "income") totalIncome += t.amount;
    else totalExpense += t.amount;
  });

  if (incomeEl) incomeEl.textContent = totalIncome.toLocaleString("en-IN");
  if (expenseEl) expenseEl.textContent = totalExpense.toLocaleString("en-IN");
  if (balanceEl) balanceEl.textContent = (totalIncome - totalExpense).toLocaleString("en-IN");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = descEl.value.trim();
  const amount = parseFloat(amountEl.value);
  const category = categoryEl.value;
  const type = typeEl.value;

  if (!desc || isNaN(amount)) return;

  const transaction = {
    desc,
    amount,
    category,
    type,
    date: new Date().toLocaleDateString("en-IN"),
  };

  transactions.push(transaction);
  localStorage.setItem(`${userKey}_transactions`, JSON.stringify(transactions));
  form.reset();
  renderTransactions();
});

renderTransactions();
