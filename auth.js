document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  function showAlert(message, type = 'error') {
    alert(type === 'success' ? '✅ ' + message : '❌ ' + message);
  }

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("signup-username").value.trim();
      const password = document.getElementById("signup-password").value;

      if (username.length < 3 || password.length < 4) {
        showAlert("Username or password too short");
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const exists = users.some(u => u.username === username);
      if (exists) return showAlert("User already exists");

      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", username);
      showAlert("Account created! Redirecting...", 'success');
      setTimeout(() => window.location.href = "dashboard.html", 1000);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value;

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem("loggedInUser", username);
        showAlert("Login successful! Redirecting...", 'success');
        setTimeout(() => window.location.href = "dashboard.html", 1000);
      } else {
        showAlert("Invalid username or password");
      }
    });
  }
});
