/**
 * Ejecuta funciones cuando el DOM ha sido completamente cargado.
 * Verifica si hay un token de sesión, y si no lo hay, redirige al login.
 * Luego, configura encabezados para autenticación y gestiona los gráficos.
 */
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        alert("No has iniciado sesión.");
        window.location.href = "login.html";
        return;
    }

    const headers = {
        "Authorization": `Bearer ${token}`
    };

    /**
     * Carga el gráfico de las personas con más entradas.
     * Obtiene datos del backend y genera el gráfico de barras correspondiente.
     */
    const cargarGraficoPersonas = () => {
        fetch("http://localhost:8080/api/reportes/topPersonas", { headers })
            .then(res => res.json())
            .then(data => {
                const nombres = data.map(item => item.persona);
                const entradas = data.map(item => item.entradas);
                generarGraficoBarras("graficoPersonas", "Entradas por Persona", nombres, entradas);
            })
            .catch(error => console.error("Error cargando top-personas:", error));
    };

    /**
     * Carga el gráfico de las oficinas con más entradas.
     * Obtiene datos del backend y genera el gráfico de barras correspondiente.
     */
    const cargarGraficoOficinas = () => {
        fetch("http://localhost:8080/api/reportes/topOficinas", { headers })
            .then(res => res.json())
            .then(data => {
                const oficinas = data.map(item => item.oficina);
                const entradas = data.map(item => item.entradas);
                generarGraficoBarras("graficoOficinas", "Entradas por Oficina", oficinas, entradas);
            })
            .catch(error => console.error("Error cargando top-oficinas:", error));
    };

    /**
     * Carga el gráfico de personas que actualmente están dentro de las oficinas.
     * Cada persona se cuenta una vez para el gráfico.
     */
    const cargarGraficoActuales = () => {
        fetch("http://localhost:8080/api/reportes/personasDentro", { headers })
            .then(res => res.json())
            .then(data => {
                const nombres = data.map(item => item.persona);
                const cantidades = data.map(() => 1);
                generarGraficoBarras("graficoActuales", "Personas Actualmente Dentro", nombres, cantidades);
            })
            .catch(error => console.error("Error cargando personas-dentro:", error));
    };

    // Gestión del cambio de tipo de gráfico en el select

    const select = document.getElementById("grafico");

    /**
     * Escucha el cambio del selector de tipo de gráfico y muestra el gráfico correspondiente.
     * @param {Event} event - El evento de cambio del select.
     */
    select.addEventListener("change", (event) => {
        const valor = event.target.value;

        // Oculta todos los gráficos
        document.querySelectorAll(".graf_container canvas").forEach(canvas => {
            canvas.style.display = "none";
        });

        // Muestra y carga el gráfico seleccionado
        switch (valor) {
            case "persona":
                document.getElementById("graficoPersonas").style.display = "block";
                cargarGraficoPersonas();
                break;
            case "oficinas":
                document.getElementById("graficoOficinas").style.display = "block";
                cargarGraficoOficinas();
                break;
            case "actuales":
                document.getElementById("graficoActuales").style.display = "block";
                cargarGraficoActuales();
                break;
        }
    });
});

const colores = ["#5452bd", "#fb7fd7", "#edb39e", "#FBF3B9"];

/**
 * Asigna colores a un conjunto de datos según la cantidad de elementos.
 * Si hay más elementos que colores, los recicla.
 * @param {number} cantidad - Número de elementos para los que se asignarán colores.
 * @returns {string[]} - Array de colores asignados.
 */
function obtenerColores(cantidad) {
    return Array.from({ length: cantidad }, (_, i) => colores[i % colores.length]);
}

/**
 * Genera un gráfico de barras utilizando Chart.js.
 * @param {string} canvasId - ID del elemento canvas donde se renderizará el gráfico.
 * @param {string} titulo - Título del gráfico.
 * @param {string[]} labels - Etiquetas para el eje X.
 * @param {number[]} valores - Valores para el eje Y.
 */
function generarGraficoBarras(canvasId, titulo, labels, valores) {
    const ctx = document.getElementById(canvasId).getContext("2d");

    // Obtiene los colores dinámicamente según la cantidad de valores
    const coloresAsignados = obtenerColores(valores.length);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: titulo,
                data: valores,
                backgroundColor: coloresAsignados,
                borderColor: coloresAsignados.map(color => color.replace(/0.5\)$/, "1)")), // Opcional: Asegura borde con opacidad total
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Bloqueo de acceso para usuarios con rol no autorizado.
 * Verifica el token y decodifica el rol del usuario para controlar el acceso.
 */
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const decoded = jwt_decode(token);
    let userRole;

    if (decoded.roles && decoded.roles.length > 0) {
        userRole = decoded.roles[0]; // Primer rol
    }

    if (userRole === "ROLE_REGISTRADOR") {
        alert("No tienes acceso a esta página");
        window.location.href = "indexRegistro.html";
    }
});
