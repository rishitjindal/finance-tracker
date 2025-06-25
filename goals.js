document.addEventListener("DOMContentLoaded", () => {
  const u = localStorage.getItem("loggedInUser");
  if (!u) return location.href = "index.html";

  const form = document.getElementById("goal-form");
  const list = document.getElementById("goal-list");
  let goals = JSON.parse(localStorage.getItem(`${u}_goals`) || "[]");

  const updateSummary = () => {
    const totalTarget = goals.reduce((a, g) => a + g.target, 0);
    const totalSaved = goals.reduce((a, g) => a + g.saved, 0);
    document.getElementById("goal-count").textContent = goals.length;
    document.getElementById("goal-target").textContent = `₹${totalTarget.toLocaleString()}`;
    document.getElementById("goal-saved").textContent = `₹${totalSaved.toLocaleString()}`;
  };

  const renderGoals = () => {
    list.innerHTML = "";
    goals.forEach((g, i) => {
      const pct = Math.min((g.saved / g.target) * 100, 100);
      const progressColor = pct >= 100 ? '#10b981' : '#3b82f6';
      const badge = pct >= 100 ? '🎉 Completed' : `${pct.toFixed(1)}%`;

      const card = document.createElement("div");
      card.className = "goal-card";
      card.innerHTML = `
        <div class="card-header">
          <h3>${g.desc}</h3>
          <button class="delete-btn">×</button>
        </div>
        <p class="goal-stats">₹${g.saved.toLocaleString()} / ₹${g.target.toLocaleString()}</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%; background-color:${progressColor};"></div>
        </div>
        <div class="card-footer">
          <span class="badge" style="background:${progressColor}">${badge}</span>
        </div>
      `;
      card.querySelector(".delete-btn").onclick = () => {
        goals.splice(i, 1);
        localStorage.setItem(`${u}_goals`, JSON.stringify(goals));
        render();
      };

      list.appendChild(card);
    });

    updateSummary();
  };

  const render = () => { renderGoals(); };

  form.addEventListener("submit", e => {
    e.preventDefault();
    const desc = form["goal-desc"].value.trim();
    const target = +form["goal-target"].value;
    const saved = +form["goal-saved-input"].value;
    if (!desc || target <= 0 || saved < 0 || saved > target) {
      return alert("Please enter valid values (saved ≤ target).");
    }
    goals.push({ desc, target, saved });
    localStorage.setItem(`${u}_goals`, JSON.stringify(goals));
    form.reset();
    render();
  });

  render();
});

function logout() {
  localStorage.removeItem("loggedInUser");
  location.href = "index.html";
}
