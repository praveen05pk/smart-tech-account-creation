const BASE_URL = "https://smart-tech-account-creation.onrender.com";

/* PASSWORD TOGGLE */
function togglePassword(id){
    const field = document.getElementById(id);
    field.type = field.type === "password" ? "text" : "password";
}

/* REGISTER FUNCTION */
function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value; // match new id

    if(password !== confirm){
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

/* VERIFY OTP */
function verifyOtp() {
    const otp = document.getElementById("otp").value;
    const email = localStorage.getItem("email");

    fetch(`${BASE_URL}/api/otp/verify?email=${email}&otp=${otp}`)
        .then(res => res.text())
        .then(data => {
            alert(data);
        });
}

/* CANCEL */
function cancel() {
    window.location.href = "index.html";
}
