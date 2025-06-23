// Signup logic
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.username === username)) {
      alert("Username already exists!");
      return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful!");
    window.location.href = "index.html";
  });
}

// Login logic
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const match = users.find(u => u.username === username && u.password === password);
    if (match) {
      localStorage.setItem("loggedInUser", username);
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid credentials");
    }
  });
}
