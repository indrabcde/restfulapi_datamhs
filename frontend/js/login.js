async function login() {

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    const errorBox =
    document.getElementById("errorMessage");

    try {

        const response =
        await fetch(
            "http://127.0.0.1:8000/login",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data =
        await response.json();

        if(!response.ok){

            throw new Error(
                "Email atau password salah"
            );
        }

        localStorage.setItem(
            "token",
            data.access_token
        );

        window.location.href =
        "dashboard.html";

    }

    catch(error){

        errorBox.classList.remove(
            "d-none"
        );

        errorBox.innerText =
        error.message;
    }
}

function togglePassword(){

    const passwordInput =
    document.getElementById(
        "password"
    );

    const eyeIcon =
    document.getElementById(
        "eyeIcon"
    );

    if(passwordInput.type==="password"){

        passwordInput.type="text";

        eyeIcon.className =
        "bi bi-eye-slash-fill";
    }
    else{

        passwordInput.type="password";

        eyeIcon.className =
        "bi bi-eye-fill";
    }
}