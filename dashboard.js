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

    li.innerHTML = `
      <div class="icon-wrapper ${iconColor}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="icon">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 8 8 12 12 16"></polyline>
        </svg>
      </div>
      <div class="tx-details">
        <strong>${t.desc}</strong>
        <div class="tx-meta">${t.category} • ${t.date}</div>
      </div>
      <div class="tx-amount ${isIncome ? "text-green" : "text-red"}">
        ${sign}₹${t.amount.toLocaleString("en-IN")}
      </div>
    `;

    li.addEventListener("dblclick", () => {
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
