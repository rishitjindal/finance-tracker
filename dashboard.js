document.addEventListener("DOMContentLoaded", () => {
  const u = localStorage.getItem("loggedInUser");
  if (!u) return window.location.href = "index.html";
  document.getElementById("user-display").textContent = u;

  const dateEl = document.getElementById("current-date");
  dateEl.textContent = new Date().toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric', year:'numeric' });

  const incEl = document.getElementById("income");
  const expEl = document.getElementById("expense");
  const balEl = document.getElementById("balance");
  const listEl = document.getElementById("transaction-list");
  const form = document.getElementById("transaction-form");
  const expCtx = document.getElementById("expenseChart").getContext("2d");
  const trendCtx = document.getElementById("trendChart").getContext("2d");

  let tArr = JSON.parse(localStorage.getItem(`${u}_transactions`) || "[]");
  let pieChart;
  let trendChart = new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
      datasets: [{ label:"Expenses", data:tArr.filter(t=>t.type==="expense").map(t=>t.amount), borderColor:"#ef4444", fill:false }]
    }
  });

  function drawPie() {
    const cat = {};
    tArr.filter(t => t.type === "expense").forEach(t => cat[t.category] = (cat[t.category]||0) + t.amount);
    pieChart?.destroy();
    pieChart = new Chart(expCtx, { type: 'pie', data: { labels:Object.keys(cat), datasets:[{ data:Object.values(cat), backgroundColor:["#ef4444","#3b82f6","#10b981"] }] } });
  }

  function render() {
  let inc = 0, exp = 0;
  listEl.innerHTML = "";

  tArr.forEach((t, i) => {
    if (t.type === "income") inc += t.amount;
    else exp += t.amount;

    const li = document.createElement("li");
    li.className = "transaction-item";

    const isIncome = t.type === "income";
    const iconColor = isIncome ? "green" : "red";
    const sign = isIncome ? "+" : "-";
    const date = t.date || new Date().toISOString().slice(0, 10); // fallback to today

    li.innerHTML = `
      <div class="icon-wrapper ${iconColor}" title="Delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="icon delete-icon">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6L18.4 19.5a2 2 0 01-2 1.5H7.6a2 2 0 01-2-1.5L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"></path>
        </svg>
      </div>

      <div class="tx-details">
        <strong>${t.desc}</strong>
        <div class="tx-meta">${t.category} • ${date}</div>
      </div>

      <div class="tx-amount ${isIncome ? "text-green" : "text-red"}">
        ${sign}₹${t.amount.toLocaleString("en-IN")}
      </div>
    `;

    // Delete on icon click
    li.querySelector(".delete-icon").addEventListener("click", () => {
      if (confirm("Delete this transaction?")) {
        tArr.splice(i, 1);
        localStorage.setItem(`${u}_transactions`, JSON.stringify(tArr));
        render();
      }
    });

    listEl.appendChild(li);
  });

  incEl.textContent = `₹${inc.toLocaleString("en-IN")}`;
  expEl.textContent = `₹${exp.toLocaleString("en-IN")}`;
  balEl.textContent = `₹${(inc - exp).toLocaleString("en-IN")}`;

  drawPie();
}


  form.addEventListener("submit", e=>{
    e.preventDefault();
    const t = { desc:form.desc.value, amount:+form.amount.value, category:form.category.value, type:form.type.value };
    tArr.push(t);
    localStorage.setItem(`${u}_transactions`, JSON.stringify(tArr));
    form.reset();
    render();
  });
  render();
});

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
