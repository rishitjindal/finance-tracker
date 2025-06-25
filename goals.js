document.addEventListener("DOMContentLoaded", () => {
  const u = localStorage.getItem("loggedInUser");
  if (!u) return location.href = "index.html";

  const form = document.getElementById("goal-form");
  const list = document.getElementById("goal-list");

  let goals = JSON.parse(localStorage.getItem(`${u}_goals`) || "[]");

  function renderGoals() {
    list.innerHTML = "";
    let totalTarget = 0, totalSaved = 0;

    goals.forEach((g, i) => {
      totalTarget += g.target;
      totalSaved += g.saved;

      const percent = ((g.saved / g.target) * 100).toFixed(1);
      const card = document.createElement("div");
      card.className = "card";
      card.style.marginBottom = "1rem";

      card.innerHTML = `
        <h3>${g.desc}</h3>
        <p>Progress</p>
        <div style="background:#e5e7eb;height:8px;border-radius:4px;overflow:hidden;">
          <div style="width:${percent}%;height:100%;background:#10b981;"></div>
        </div>
        <small>${percent}% complete</small><br/>
        <small class="text-gray-500">₹${g.saved.toLocaleString()} / ₹${g.target.toLocaleString()}</small>
      `;

      list.appendChild(card);
    });

    document.getElementById("goal-count").textContent = goals.length;
    document.getElementById("goal-target").textContent = `₹${totalTarget.toLocaleString()}`;
    document.getElementById("goal-saved").textContent = `₹${totalSaved.toLocaleString()}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const desc = form["goal-desc"].value.trim();
    const target = +form["goal-target"].value;
    const saved = +form["goal-saved-input"].value;

    if (!desc || target <= 0 || saved < 0 || saved > target) return alert("Enter valid data");

    goals.push({ desc, target, saved });
    localStorage.setItem(`${u}_goals`, JSON.stringify(goals));
    form.reset();
    renderGoals();
  });

  renderGoals();
});

function logout() {
  localStorage.removeItem("loggedInUser");
  location.href = "index.html";
}
