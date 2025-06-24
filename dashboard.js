document.addEventListener("DOMContentLoaded", function () {
  const dateSpan = document.getElementById("current-date");
  const today = new Date();
  dateSpan.textContent = today.toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const ctx = document.getElementById("trendChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "May 26", "May 29", "Jun 1", "Jun 4", "Jun 7", "Jun 10", "Jun 13", "Jun 16", "Jun 19", "Jun 22", "Jun 24"
      ],
      datasets: [
        {
          label: "Income",
          data: [150, 200, 250, 300, 350, 450, 600, 800, 1200, 1800, 5000],
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.4
        },
        {
          label: "Expenses",
          data: [50, 60, 70, 80, 70, 60, 50, 60, 70, 80, 100],
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        },
        tooltip: {
          mode: "index",
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
