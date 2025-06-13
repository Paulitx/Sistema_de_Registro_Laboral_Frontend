async function login(event) {
    event.preventDefault();

    let form = event.target;
    if(!form.checkValidity()){
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    try {
        const response = await fetch("http://127.0.0.1:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error("Error de autenticación: " + response.statusText);
        }

        const token = await response.text();
        localStorage.setItem("jwtToken", token);


        const decoded = jwt_decode(token);
        console.log(decoded);

        window.location.href = "principal.html";
    } catch (error) {
        alert("Las credenciales son incorrrectas");
        console.error("Error de autenticación:", error);
        document.getElementById("status").innerText = "Error al iniciar sesión.";
    }
}

function logout() {
    localStorage.removeItem("jwtToken");
    window.location.href = "login.html";
}

function verificarAutenticacion() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        window.location.href = "login.html";
    }
}

(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()