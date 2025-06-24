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
    let inc=0, exp=0;
    listEl.innerHTML = "";
    tArr.forEach((t,i)=> {
      if (t.type==="income") inc+=t.amount; else exp+=t.amount;
      const li = document.createElement("li");
      li.textContent = `${t.desc}: ₹${t.amount} (${t.category})`;
      li.addEventListener("dblclick",()=>{ tArr.splice(i,1); localStorage.setItem(`${u}_transactions`,JSON.stringify(tArr)); render(); });
      listEl.appendChild(li);
    });
    incEl.textContent = inc;
    expEl.textContent = exp;
    balEl.textContent = inc-exp;
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
