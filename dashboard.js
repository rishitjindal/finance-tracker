document.addEventListener("DOMContentLoaded", () => {
  const u = localStorage.getItem("loggedInUser");
  if (!u) return window.location.href = "index.html";

  document.getElementById("user-display").textContent = u;
  document.getElementById("current-date").textContent = new Date().toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  const incEl = document.getElementById("income");
  const expEl = document.getElementById("expense");
  const balEl = document.getElementById("balance");
  const expCtx = document.getElementById("expenseChart").getContext("2d");
  const trendCtx = document.getElementById("trendChart").getContext("2d");

  let tArr = JSON.parse(localStorage.getItem(`${u}_transactions`) || "[]");

  // Update summary
  let inc = 0, exp = 0;
  tArr.forEach(t => t.type === "income" ? inc += t.amount : exp += t.amount);
  incEl.textContent = `₹${inc.toLocaleString("en-IN")}`;
  expEl.textContent = `₹${exp.toLocaleString("en-IN")}`;
  balEl.textContent = `₹${(inc - exp).toLocaleString("en-IN")}`;

  // Charts
  new Chart(expCtx, {
    type: 'pie',
    data: {
      labels: [...new Set(tArr.filter(t => t.type === "expense").map(t => t.category))],
      datasets: [{
        data: tArr.filter(t => t.type === "expense").reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {}),
        backgroundColor: ["#ef4444", "#3b82f6", "#10b981", "#facc15"]
      }]
    }
  });

  new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        label: "Expenses",
        data: tArr.filter(t => t.type === "expense").map(t => t.amount),
        borderColor: "#ef4444",
        fill: false
      }]
    }
  });

  renderPreview();
});
function renderPreview() {
  const u = localStorage.getItem("loggedInUser");
  const tArr = JSON.parse(localStorage.getItem(`${u}_transactions`) || "[]");
  const previewEl = document.getElementById("transaction-preview");
  if (!previewEl) return;

  previewEl.innerHTML = "";
  const recent = [...tArr].slice(-3).reverse(); // Last 3 entries

  recent.forEach(t => {
    const li = document.createElement("li");
    li.className = "transaction-item";

    const iconColor = t.type === "income" ? "green" : "red";
    const sign = t.type === "income" ? "+" : "-";
    const date = t.date || new Date().toISOString().slice(0, 10);

    li.innerHTML = `
      <div class="icon-wrapper ${iconColor}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="icon">
          <rect width="20" height="14" x="2" y="5" rx="2"></rect>
          <line x1="2" x2="22" y1="10" y2="10"></line>
        </svg>
      </div>

      <div class="tx-details">
        <strong>${t.desc}</strong>
        <div class="tx-meta">${t.category} • ${date}</div>
      </div>

      <div class="tx-amount ${t.type === "income" ? "text-green" : "text-red"}">
        ${sign}₹${t.amount.toLocaleString("en-IN")}
      </div>
    `;

    previewEl.appendChild(li);
  });
}


function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
