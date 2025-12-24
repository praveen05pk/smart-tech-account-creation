const BASE_URL = "https://smart-tech-account-creation.onrender.com";

/* =========================
   PASSWORD TOGGLE
========================= */
function togglePassword(id, icon){
    const field=document.getElementById(id);
    if(field.type==="password"){
        field.type="text";
        icon.classList.replace("fa-eye","fa-eye-slash");
    }else{
        field.type="password";
        icon.classList.replace("fa-eye-slash","fa-eye");
    }
}

/* =========================
   PASSWORD STRENGTH
========================= */
function checkStrength(){
    const password=document.getElementById("password").value;
    const msg=document.getElementById("strengthMessage");

    if(password.length===0){ msg.innerHTML=""; return; }

    let strength=0;
    if(password.length>=8) strength++;
    if(/[A-Z]/.test(password)) strength++;
    if(/[0-9]/.test(password)) strength++;
    if(/[^A-Za-z0-9]/.test(password)) strength++;

    if(strength<=1){
        msg.textContent="Weak Password"; msg.className="strength weak";
    }else if(strength<=3){
        msg.textContent="Medium Password"; msg.className="strength medium";
    }else{
        msg.textContent="Strong Password"; msg.className="strength strong";
    }
}

/* =========================
   REGISTER LOGIC
========================= */
function register(){
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const mobile = document.getElementById("mobileNum").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if(password !== confirm){
        alert("Passwords do not match");
        return;
    }

    const userData = { fname, lname, mobile, address, email, password };
    localStorage.setItem("userData", JSON.stringify(userData));

    fetch(`${BASE_URL}/api/send-otp?email=${encodeURIComponent(email)}`)
    .then(res => {
        if(!res.ok) throw new Error("Failed to send OTP");
        return res.text();
    })
    .then(msg => {
        alert(msg);
        localStorage.setItem("email", email);
        window.location.href = "otp.html";
    })
    .catch(err => alert("Error sending OTP: " + err));
}

/* =========================
   VERIFY OTP
========================= */
let time = 300; // 5 minutes
setInterval(()=>{
    const timer = document.getElementById("timer");
    if(!timer) return;
    if(time<=0) return;
    time--;
    let m = String(Math.floor(time/60)).padStart(2,"0");
    let s = String(time%60).padStart(2,"0");
    timer.innerText = `OTP expires in ${m}:${s}`;
},1000);

function verifyOtp(){
    const otp = document.getElementById("otp").value;
    const email = localStorage.getItem("email");
    const msgDiv = document.getElementById("msg");

    fetch(`${BASE_URL}/api/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`)
    .then(res => res.text())
    .then(msg => msgDiv.innerText = msg)
    .catch(err => msgDiv.innerText = "Error verifying OTP: "+err);
}

function resendOtp(){
    const email = localStorage.getItem("email");
    fetch(`${BASE_URL}/api/send-otp?email=${encodeURIComponent(email)}`)
    .then(res=>res.text())
    .then(msg => {
        alert(msg);
        time = 300; // reset timer
    })
    .catch(err => alert("Error resending OTP: "+err));
}

function cancel(){ window.location.href = "index.html"; }
