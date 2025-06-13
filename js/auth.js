/**
 * Maneja el inicio de sesión del usuario.
 * Envía las credenciales al backend y guarda el token JWT en localStorage si la autenticación es exitosa.
 * Redirige a la página principal en caso de éxito.
 *
 * @async
 * @param {Event} event - El evento submit del formulario.
 */
async function login(event) {
    event.preventDefault();

    let form = event.target;
    if (!form.checkValidity()) {
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

/**
 * Cierra la sesión del usuario eliminando el token JWT del localStorage
 * y redirigiendo a la página de login.
 */
function logout() {
    localStorage.removeItem("jwtToken");
    window.location.href = "login.html";
}

/**
 * Verifica si el usuario está autenticado al cargar una página protegida.
 * Si no hay token JWT en localStorage, redirige a la página de login.
 */
function verificarAutenticacion() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        window.location.href = "login.html";
    }
}

/**
 * Función autoejecutable que aplica validación personalizada de Bootstrap a los formularios.
 * Previene el envío de formularios si no cumplen con los requisitos de validación HTML5.
 */
(function () {
    'use strict'

    // Selecciona todos los formularios que requieren validación
    var forms = document.querySelectorAll('.needs-validation');

    // Agrega validación personalizada a cada formulario
    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    });
})();
