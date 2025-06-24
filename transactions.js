document.addEventListener("DOMContentLoaded", () => {
  const u = localStorage.getItem("loggedInUser");
  if (!u) return window.location.href = "index.html";

  const form = document.getElementById("transaction-form");
  const listEl = document.getElementById("transaction-list");
  let tArr = JSON.parse(localStorage.getItem(`${u}_transactions`) || "[]");

  function render() {
    listEl.innerHTML = "";
    tArr.forEach((t, i) => {
      const isIncome = t.type === "income";
      const colorClass = isIncome ? "green" : "red";
      const sign = isIncome ? "+" : "-";
      const li = document.createElement("li");
      li.className = "transaction-item";
      li.innerHTML = `
        <div class="icon-wrapper ${colorClass}">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon delete-icon" fill="none" viewBox="0 0 24 24"
               stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
               d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <div class="tx-details">
          <strong>${t.desc}</strong>
          <div class="tx-meta">${t.category} • ${t.date || new Date().toISOString().split('T')[0]}</div>
        </div>
        <div class="tx-amount ${isIncome ? 'text-green' : 'text-red'}">
          ${sign}₹${t.amount.toLocaleString("en-IN")}
        </div>
      `;
      li.querySelector(".delete-icon").addEventListener("click", () => {
        if (confirm("Delete this transaction?")) {
          tArr.splice(i, 1);
          localStorage.setItem(`${u}_transactions`, JSON.stringify(tArr));
          render();
        }
      });
      listEl.appendChild(li);
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const t = {
      desc: form.desc.value,
      amount: +form.amount.value,
      category: form.category.value,
      type: form.type.value,
      date: new Date().toISOString().split('T')[0]
    };
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
