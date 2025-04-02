document.addEventListener("DOMContentLoaded", () => {
    const registros = JSON.parse(localStorage.getItem("registros")) || [];

    generarGraficoPersona(registros);
    generarGraficoOficinas(registros);
    generarGraficoPersonasActuales(registros);

    const grafContainer = document.querySelector(".graf_container");
    const graficos = {
        persona: document.getElementById("grafPersona"),
        oficinas: document.getElementById("grafOficinas"),
        actuales: document.getElementById("grafPersonasActuales")
    };

    grafContainer.style.display = "none";
    Object.values(graficos).forEach(graf => graf.style.display = "none");

    document.getElementById("grafico").addEventListener("change", function () {
        const seleccion = this.value;

        Object.values(graficos).forEach(graf => graf.style.display = "none");

        if (seleccion && graficos[seleccion]) {
            grafContainer.style.display = "block";
            graficos[seleccion].style.display = "block";
        } else {
            grafContainer.style.display = "none";
        }
    });
});

function personaMayorIngresos(registros) {
    const mayorPersona = {};
    registros.forEach(r => {
        if (r.tipoRegistro === "entrada") {
            mayorPersona[r.persona.nombre] = (mayorPersona[r.persona.nombre] || 0) + 1;
        }
    });
    return mayorPersona;
}

function ocupacionMaxOficina(registros) {
    const mayorOficina = {};
    registros.forEach(r => {
        if(r.tipoRegistro === "entrada" && r.persona.oficina) {
            const nombreOficina = r.persona.oficina.nombre;
            mayorOficina[nombreOficina] = (mayorOficina[nombreOficina] || 0) + 1;
        }
    });
    return mayorOficina;
}

function personasEnOficina(registros) {
    const personaActual = {};
    registros.forEach(r => {
        if (r.tipoRegistro === "entrada") {
            personaActual[r.persona.nombre] = (personaActual[r.persona.nombre] || 0) + 1;
        } else if (r.tipoRegistro === "salida") {
            if(personaActual[r.persona.nombre]) {
                personaActual[r.persona.nombre]--;
                if (personaActual[r.persona.nombre] <= 0){
                    delete personaActual[r.persona.id];
                }
            }
        }
    });
    return personaActual;
}

function generarGraficoPersona(registros) {
    const datosPersona = personaMayorIngresos(registros);
    const ctx = document.getElementById("grafPersona").getContext("2d");

    const colores = ["#5452bd", "#fb7fd7", "#edb39e", "#FBF3B9"]
    const coloresLoop = Object.keys(datosPersona).map((_, i) => colores [i % colores.length]);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(datosPersona),
            datasets: [{
                label: "Ingreso por persona",
                data: Object(datosPersona),
                backgroundColor: coloresLoop,
            }]

        },
        options: {
            plugins: {},
            scales: {
                x: {
                    ticks: {
                        color: "#dbd5fd"
                    }
                },

                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: "#dbd5fd"
                    }
                }
            }
        }
    });
}

function generarGraficoOficinas(registros) {
    const datosOficina = ocupacionMaxOficina(registros);
    const ctx = document.getElementById("grafOficinas").getContext("2d");

    const colores = ["#5452bd", "#fb7fd7", "#edb39e", "#FBF3B9"]
    const coloresLoop = Object.keys(datosOficina).map((_, i) => colores [i % colores.length]);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(datosOficina),
            datasets: [{
                label: "Ingreso por oficina",
                data: Object.values(datosOficina),
                backgroundColor: coloresLoop,
            }]

        },
        options: {
            plugins: {},
            scales: {
                x: {
                    ticks: {
                        color: "#dbd5fd"
                    }
                },

                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: "#dbd5fd"
                    }
                }
            }
        }
    });
}

function generarGraficoPersonasActuales(registros) {
    const datosPersona = personasEnOficina(registros);
    const ctx = document.getElementById("grafPersonasActuales").getContext("2d");

    const colores = ["#5452bd", "#fb7fd7", "#edb39e", "#FBF3B9"]
    const coloresLoop = Object.keys(datosPersona).map((_, i) => colores [i % colores.length]);

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(datosPersona),
            datasets: [{
                label: "Personas dentro de la oficina",
                data: Object.values(datosPersona),
                backgroundColor: coloresLoop,
            }]

        },
        options: {
            legend: {
                labels: {
                    color: "#dbd5fd"
                }
            }
        }
    });
}