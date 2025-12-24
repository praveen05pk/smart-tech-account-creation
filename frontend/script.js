const BASE_URL = "https://smart-tech-account-creation.onrender.com";

/* =====================
   Password Toggle
===================== */
function togglePassword(id, icon){
    const field = document.getElementById(id);
    if(field.type === "password") {
        field.type = "text"; icon.classList.replace("fa-eye","fa-eye-slash");
    } else {
        field.type = "password"; icon.classList.replace("fa-eye-slash","fa-eye");
    }
}

/* =====================
   Password Strength
===================== */
function checkStrength(){
    const password = document.getElementById("password").value;
    const msg = document.getElementById("strengthMessage");
    if(password.length===0){ msg.innerHTML=""; return; }
    let strength=0;
    if(password.length>=8) strength++;
    if(/[A-Z]/.test(password)) strength++;
    if(/[0-9]/.test(password)) strength++;
    if(/[^A-Za-z0-9]/.test(password)) strength++;
    if(strength<=1){ msg.textContent="Weak Password"; msg.className="strength weak"; }
    else if(strength<=3){ msg.textContent="Medium Password"; msg.className="strength medium"; }
    else { msg.textContent="Strong Password"; msg.className="strength strong"; }
}

/* =====================
   Dynamic Name Attributes
===================== */
function generateAlphaNum(len=8){
    const chars="abcdefghijklmnopqrstuvwxyz0123456789";
    let out=""; for(let i=0;i<len;i++){ out+=chars[Math.floor(Math.random()*chars.length)]; }
    return out;
}
document.querySelectorAll("input").forEach(input=>{
    if(input.id){ input.name = input.id + "_" + generateAlphaNum(); }
});

/* =====================
   Multi-step Navigation
===================== */
function goToStep2(){
    if(password.value !== confirm.value){ alert("Passwords do not match"); return; }
    localStorage.setItem("step1", JSON.stringify({
        fname:fname.value, lname:lname.value, mobile:mobileNum.value,
        address:address.value, email:email.value, password:password.value
    }));
    window.location.href="step2.html";
}

function goToStep3(){
    let gender = document.querySelector('input[name="gender"]:checked');
    let hobbies = Array.from(document.querySelectorAll('input[name="hobbies"]:checked')).map(i=>i.value);
    let photo = document.getElementById("photo").files[0]?.name || "";
    localStorage.setItem("step2", JSON.stringify({gender:gender?.value||"", hobbies:hobbies, photo}));
    window.location.href="step3.html";
}

function submitRegistration(){
    let step1 = JSON.parse(localStorage.getItem("step1"));
    let step2 = JSON.parse(localStorage.getItem("step2"));
    let country = document.getElementById("country").value;
    let dob = {
        year: document.getElementById("dobYear").value,
        month: document.getElementById("dobMonth").value,
        day: document.getElementById("dobDay").value
    };
    let language = document.getElementById("language").value;
    let skills = Array.from(document.getElementById("skills").selectedOptions).map(i=>i.value);

    let registrationData = {...step1, ...step2, country, dob, language, skills};

    localStorage.setItem("userData", JSON.stringify(registrationData));

    fetch(`${BASE_URL}/api/send-otp?email=${step1.email}`)
        .then(res=>res.text())
        .then(()=>{
            localStorage.setItem("email", step1.email);
            window.location.href="otp.html";
        })
        .catch(err=> alert("Error sending OTP"));
}

/* =====================
   OTP Verification
===================== */
let timer=300;
if(document.getElementById("timer")){
    setInterval(()=>{
        if(timer<=0) return;
        timer--;
        let m = String(Math.floor(timer/60)).padStart(2,"0");
        let s = String(timer%60).padStart(2,"0");
        document.getElementById("timer").innerText=`OTP expires in ${m}:${s}`;
    },1000);
}

function verifyOtp(){
    let otp=document.getElementById("otp").value;
    let email=localStorage.getItem("email");
    fetch(`${BASE_URL}/api/verify-otp?email=${email}&otp=${otp}`)
        .then(res=>res.text())
        .then(data=> document.getElementById("msg").innerText = data);
}

function resendOtp(){
    let email=localStorage.getItem("email");
    fetch(`${BASE_URL}/api/send-otp?email=${email}`)
        .then(()=>{alert("OTP resent"); timer=300;});
}

function cancel(){ window.location.href="index.html"; }

/* =====================
   Step 3 Year Dropdown
===================== */
if(document.getElementById("dobYear")){
    let yearSelect = document.getElementById("dobYear");
    let currentYear = new Date().getFullYear();
    for(let y=currentYear;y>=1900;y--){
        let opt = document.createElement("option"); opt.value=opt.text=y; yearSelect.add(opt);
    }
}

/* =====================
   Refresh Step 2
===================== */
function refreshStep2(){
    window.location.href="step2.html";
}
