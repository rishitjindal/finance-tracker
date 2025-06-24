document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  function handleAuth(form, type) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const u = form.querySelector('input[type="text"]').value.trim();
      const p = form.querySelector('input[type="password"]').value;
      let users = JSON.parse(localStorage.getItem("users") || "[]");

      if (type === "signup") {
        if (users.some(uobj => uobj.username === u)) return alert("User exists");
        users.push({ username: u, password: p });
        localStorage.setItem("users", JSON.stringify(users));
      }

      const found = users.find(uobj => uobj.username === u && uobj.password === p);
      if (!found) return alert("Invalid credentials");
      localStorage.setItem("loggedInUser", u);
      window.location.href = "dashboard.html";
    });
  }

  if (loginForm) handleAuth(loginForm, "login");
  if (signupForm) handleAuth(signupForm, "signup");
});
