// ========================
// BASE URL
// ========================
const BASE_URL = "https://smart-tech-account-creation.onrender.com";

// ========================
// PASSWORD TOGGLE
// ========================
function togglePassword(id, icon){
    const field = document.getElementById(id);
    if(field.type === "password"){
        field.type = "text";
        icon.classList.replace("fa-eye","fa-eye-slash");
    } else {
        field.type = "password";
        icon.classList.replace("fa-eye-slash","fa-eye");
    }
}

// ========================
// PASSWORD STRENGTH
// ========================
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

// ========================
// MULTI-STEP NAVIGATION
// ========================

document.addEventListener("DOMContentLoaded", () => {
    // Step1 -> Step2
    const step1Next = document.getElementById("nextStep1");
    if(step1Next){
        step1Next.addEventListener("click", () => {
            const required = ["fname","lname","mobileNum","email","password","confirm"];
            for(let id of required){
                if(!document.getElementById(id).value){
                    alert("Please fill all fields");
                    return;
                }
            }
            if(document.getElementById("password").value !== document.getElementById("confirm").value){
                alert("Passwords do not match");
                return;
            }
            // Save to localStorage
            localStorage.setItem("step1", JSON.stringify({
                fname: document.getElementById("fname").value,
                lname: document.getElementById("lname").value,
                mobile: document.getElementById("mobileNum").value,
                email: document.getElementById("email").value,
                address: document.getElementById("address").value,
                password: document.getElementById("password").value
            }));
            window.location.href = "step2.html";
        });
    }

    // Step2 -> Step3
    const step2Next = document.getElementById("nextStep2");
    if(step2Next){
        step2Next.addEventListener("click", () => {
            const gender = document.querySelector('input[name="gender"]:checked');
            if(!gender){ alert("Select Gender"); return; }

            const hobbies = Array.from(document.querySelectorAll('.checkbox-group input:checked')).map(i=>i.value);

            localStorage.setItem("step2", JSON.stringify({
                gender: gender.value,
                hobbies,
                photo: document.getElementById("photo").value
            }));
            window.location.href = "step3.html";
        });
    }

    // Step2 Refresh
    const refresh2 = document.getElementById("refreshStep2");
    if(refresh2){
        refresh2.addEventListener("click", ()=>window.location.reload());
    }

    // Step3 Register
    const registerFinal = document.getElementById("registerFinal");
    if(registerFinal){
        registerFinal.addEventListener("click", ()=>{
            const country = document.getElementById("country").value;
            const dobYear = document.getElementById("dobYear").value;
            const dobMonth = document.getElementById("dobMonth").value;
            const dobDay = document.getElementById("dobDay").value;
            const language = document.getElementById("language").value;
            const skills = Array.from(document.getElementById("skills").selectedOptions).map(o=>o.value);

            if(!country || !dobYear || !dobMonth || !dobDay || !language || skills.length===0){
                alert("Please fill all fields"); return;
            }

            localStorage.setItem("step3", JSON.stringify({country,dobYear,dobMonth,dobDay,language,skills}));

            // Send OTP
            const step1 = JSON.parse(localStorage.getItem("step1"));
            fetch(`${BASE_URL}/api/send-otp?email=${step1.email}`)
            .then(res=>res.text())
            .then(()=>{
                window.location.href = "otp.html";
            }).catch(e=>{
                alert("Error sending OTP: "+e);
            });
        });
    }

    // Step3 Refresh
    const refresh3 = document.getElementById("refreshStep3");
    if(refresh3){ refresh3.addEventListener("click", ()=>window.location.reload()); }

    // OTP submit
    const submitOtp = document.getElementById("submitOtp");
    if(submitOtp){
        submitOtp.addEventListener("click", ()=>{
            const otp = document.getElementById("otp").value;
            const step1 = JSON.parse(localStorage.getItem("step1"));
            fetch(`${BASE_URL}/api/verify-otp?email=${step1.email}&otp=${otp}`)
            .then(res=>res.text())
            .then(data=>{
                document.getElementById("msg").innerText = data;
            });
        });
    }

    // OTP resend
    const resendOtp = document.getElementById("resendOtp");
    if(resendOtp){
        resendOtp.addEventListener("click", ()=>{
            const step1 = JSON.parse(localStorage.getItem("step1"));
            fetch(`${BASE_URL}/api/send-otp?email=${step1.email}`)
            .then(res=>res.text())
            .then(()=>alert("OTP sent successfully"));
        });
    }

    // OTP cancel
    const cancelOtp = document.getElementById("cancelOtp");
    if(cancelOtp){
        cancelOtp.addEventListener("click", ()=>window.location.href="index.html");
    }
});
