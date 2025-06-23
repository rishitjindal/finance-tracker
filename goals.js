document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");
  if (!username) return window.location.href = "index.html";

  const form = document.getElementById("goal-form");
  const goalList = document.getElementById("goal-list");
  let goals = JSON.parse(localStorage.getItem(`${username}_goals`) || "[]");

  function renderGoals() {
    goalList.innerHTML = "";
    goals.forEach((goal, index) => {
      const div = document.createElement("div");
      div.className = "bg-white p-4 rounded shadow";
      div.innerHTML = `
        <h3 class="font-bold text-lg">${goal.name}</h3>
        <p>Target: ₹${goal.amount}</p>
        <button onclick="deleteGoal(${index})" class="text-red-500 mt-2 hover:underline">Delete</button>
      `;
      goalList.appendChild(div);
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("goal-name").value.trim();
    const amount = +document.getElementById("goal-amount").value;
    if (!name || !amount || amount <= 0) return alert("Invalid input");

    goals.push({ name, amount });
    localStorage.setItem(`${username}_goals`, JSON.stringify(goals));
    form.reset();
    renderGoals();
  });

  window.deleteGoal = (index) => {
    goals.splice(index, 1);
    localStorage.setItem(`${username}_goals`, JSON.stringify(goals));
    renderGoals();
  };

  renderGoals();
});
