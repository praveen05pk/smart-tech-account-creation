const BASE_URL = "https://smart-tech-account-creation.onrender.com";

function togglePassword() {
  let pwd = document.getElementById("password");
  pwd.type = pwd.type === "password" ? "text" : "password";
}

function register() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirm = document.getElementById("confirmPassword").value;

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  fetch(`${BASE_URL}/api/otp/send?email=${email}`)
    .then(res => res.text())
    .then(() => {
      localStorage.setItem("email", email);
      window.location.href = "otp.html";
    });
}

function verifyOtp() {
  let otp = document.getElementById("otp").value;
  let email = localStorage.getItem("email");

  fetch(`${BASE_URL}/api/otp/verify?email=${email}&otp=${otp}`)
    .then(res => res.text())
    .then(data => {
      document.getElementById("msg").innerText = data;
    });
}

function cancel() {
  window.location.href = "index.html";
}
