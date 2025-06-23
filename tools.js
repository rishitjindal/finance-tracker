document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("emi-form");
  const result = document.getElementById("emi-result");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const P = parseFloat(document.getElementById("loan-amount").value);
    const R = parseFloat(document.getElementById("interest-rate").value) / 12 / 100;
    const N = parseInt(document.getElementById("tenure").value);

    if (!P || !R || !N) return alert("Enter all values");

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    result.textContent = `Estimated EMI: ₹${emi.toFixed(2)}`;
  });
});

