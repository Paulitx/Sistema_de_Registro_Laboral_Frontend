function login(event) {
    event.preventDefault();

    let form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Credenciales con roles
    const users = {
        "admin": { password: "1234", role: "admin" },
        "registrador": { password: "5678", role: "registrador" },
        "visor": { password: "abcd", role: "visor" }
    };

    if (users[username] && users[username].password === password) {
        localStorage.setItem("auth", "true");
        localStorage.setItem("role", users[username].role);
        window.location.href = "principal.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }
}

function logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("role");
    window.location.href = "login.html";
}

function verificarAutenticacion() {
    let auth = localStorage.getItem("auth");
    let role = localStorage.getItem("role");
    if (auth !== "true") {
        window.location.href = "login.html";
        return;
    }

    let pathname = window.location.pathname.split("/").pop();
    let restrictedForRegistrador = ["formRegistro.html", "indexRegistro.html","principal.html"];
    let allowedForVisor = ["indexPersona.html", "indexRegistro.html", "indexOficina.html", "reporte.html","principal.html"];

    if (role === "registrador" && !restrictedForRegistrador.includes(pathname)) {
        alert(`No tienes acceso a esta página por ser ${role}.`);
        window.location.href = "principal.html";
    }

    if (role === "visor") {
        if (!allowedForVisor.includes(pathname)) {
            alert(`No tienes acceso a esta página por ser ${role}`);
            window.location.href = "principal.html";
        }

        //seshabilitar botones de agregar, editar y eliminar para el visor
        document.addEventListener("DOMContentLoaded", () => {
            let agregarBtn = document.getElementById("agregar");
            if (agregarBtn) agregarBtn.style.display = "none";

            let editarBtns = document.querySelectorAll(".btn-editar");
            let eliminarBtns = document.querySelectorAll(".btn-eliminar");

            editarBtns.forEach(btn => btn.style.display = "none");
            eliminarBtns.forEach(btn => btn.style.display = "none");
        });
        window.confirmarEliminacion = function(index) {
            alert(`No tienes permisos para eliminar elementos por ser ${role}.`);
        };
    }
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
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

function mostrarPassword() {
    var passwordInput = document.getElementById("password");
    var eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("bi-eye-fill");
        eyeIcon.classList.add("bi-eye-slash-fill");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("bi-eye-slash-fill");
        eyeIcon.classList.add("bi-eye-fill");
    }
}