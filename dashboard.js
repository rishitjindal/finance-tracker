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

  let pieChart;
  let trendChart = new Chart(trendCtx, {
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

  function drawPie() {
    const cat = {};
    tArr.filter(t => t.type === "expense").forEach(t => {
      cat[t.category] = (cat[t.category] || 0) + t.amount;
    });

    pieChart?.destroy();
    pieChart = new Chart(expCtx, {
      type: 'pie',
      data: {
        labels: Object.keys(cat),
        datasets: [{
          data: Object.values(cat),
          backgroundColor: ["#ef4444", "#3b82f6", "#10b981", "#facc15", "#8b5cf6"]
        }]
      }
    });
  }

  function updateSummary() {
    let inc = 0, exp = 0;
    tArr.forEach(t => {
      if (t.type === "income") inc += t.amount;
      else exp += t.amount;
    });

    incEl.textContent = `₹${inc.toLocaleString("en-IN")}`;
    expEl.textContent = `₹${exp.toLocaleString("en-IN")}`;
    balEl.textContent = `₹${(inc - exp).toLocaleString("en-IN")}`;
  }

  updateSummary();
  drawPie();
});

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
