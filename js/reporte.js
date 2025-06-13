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

    // Funciones para cargar datos y generar gráficos
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

    // Mostrar solo el gráfico seleccionado
    const select = document.getElementById("grafico");
    select.addEventListener("change", (event) => {
        const valor = event.target.value;

        // Ocultar todos los gráficos primero
        document.querySelectorAll(".graf_container canvas").forEach(canvas => {
            canvas.style.display = "none";
        });

        // Mostrar y cargar el gráfico correspondiente
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


///generacion de grafico de barras simple
function generarGraficoBarras(canvasId, titulo, labels, valores) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: titulo,
                data: valores,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
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

//bloque ael rol de administrador
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    const decoded = jwt_decode(token);

    let userRole;

    if (decoded.roles && decoded.roles.length > 0) {
        userRole = decoded.roles[0]; // Tomamos el primer rol
    }
    if (userRole === "ROLE_REGISTRADOR") {
        alert("No tienes acceso a esta página");
        window.location.href = "indexRegistro.html";
    }
});