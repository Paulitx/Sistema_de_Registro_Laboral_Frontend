let paginaActual = 1;
const registrosPorPagina = 5;

function cargarRegistros() {
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    let tbody = document.getElementById("registros-list");
    let totalPaginas = Math.ceil(registros.length / registrosPorPagina);

    tbody.innerHTML = "";
    if (registros.length === 0) {
        tbody.innerHTML = `<tr>
            <td colspan="3" class="text-white" style="background-color: #d895c6">No hay datos disponibles.</td>
        </tr>`;
        return;
    }

    // Determinar los registros a mostrar según la página actual
    let registrosPagina = registros.slice((paginaActual - 1) * registrosPorPagina, paginaActual * registrosPorPagina);

    // Agregar los registros de la página actual al tbody
    registrosPagina.forEach((registro, index) => {
        let personaNombre = registro.persona ? registro.persona.nombre : "Desconocido";
        let fila = `<tr>
                    <td>${personaNombre}</td>
                    <td>${registro.tipoRegistro}</td>
                    <td>${registro.fechaHora}</td>
                    <td>
                        <button onclick="editarRegistro(${index})" class="btn btn-editar"> 
                            <i class="bi bi-pencil-square"></i> Editar</button>
                        <button onclick="confirmarEliminacion(${index})" class="btn btn-eliminar"> 
                            <i class="bi bi-trash-fill"></i> Eliminar</button>
                    </td>
                </tr>`;
        tbody.innerHTML += fila;
    });

    // Mostrar los controles de paginación
    mostrarPaginacion(totalPaginas);
}

// Mostrar los controles de paginación
function mostrarPaginacion(totalPaginas) {
    let paginacionDiv = document.getElementById("paginacion");
    paginacionDiv.innerHTML = "";

    // Botón "Anterior"
    if (paginaActual > 1) {
        let btnAnterior = document.createElement("button");
        btnAnterior.textContent = "Anterior";
        btnAnterior.classList.add("btn", "btn-secondary");
        btnAnterior.onclick = function() {
            paginaActual--;
            cargarRegistros();
        };
        paginacionDiv.appendChild(btnAnterior);
    }

    // Mostrar números de página
    for (let i = 1; i <= totalPaginas; i++) {
        let btnPagina = document.createElement("button");
        btnPagina.textContent = i;
        btnPagina.classList.add("btn", "btn-light", "mx-1");
        if (i === paginaActual) {
            btnPagina.disabled = true;
        }
        btnPagina.onclick = function() {
            paginaActual = i;
            cargarRegistros();
        };
        paginacionDiv.appendChild(btnPagina);
    }

    // Botón "Siguiente"
    if (paginaActual < totalPaginas) {
        let btnSiguiente = document.createElement("button");
        btnSiguiente.textContent = "Siguiente";
        btnSiguiente.classList.add("btn", "btn-secondary");
        btnSiguiente.onclick = function() {
            paginaActual++;
            cargarRegistros();
        };
        paginacionDiv.appendChild(btnSiguiente);
    }
}


function confirmarEliminacion(index) {
    const confirmacion = confirm("¿Desea eliminar este registro?");
    if (confirmacion) {
        eliminarRegistro(index);
    }
}

function eliminarRegistro(index) {
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.splice(index, 1);
    localStorage.setItem("registros", JSON.stringify(registros));
    cargarRegistros();
}

function editarRegistro(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "formRegistros.html";
}

function guardarRegistro(event) {
    event.preventDefault();

    let tipoRegistro = document.getElementById("tipo").value;
    let fechaHora = document.getElementById("fechaHora").value;
    let personaId = document.getElementById("persona").value;

    if (!tipoRegistro || !fechaHora || !personaId) {
        alert("Todos los campos son obligatorios");
        return;
    }

    let personas = JSON.parse(localStorage.getItem("personas")) || [];
    let persona = personas.find(p => p.id == personaId);  // Buscar la persona seleccionada

    let registro = {
        persona: { id: persona.id, nombre: persona.nombre },
        tipoRegistro,
        fechaHora
    };

    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    let index = localStorage.getItem("editIndex");

    if (index !== null && index !== "null") {
        registros[index] = registro;  // Editar registro existente
        localStorage.removeItem("editIndex");
    } else {
        registros.push(registro);  // Agregar nuevo registro
    }

    localStorage.setItem("registros", JSON.stringify(registros));
    window.location.href = "indexRegistros.html";
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
function cargarPersonas() {
    let personas = JSON.parse(localStorage.getItem("personas")) || [];
    let selectPersona = document.getElementById("persona");

    if (!selectPersona) return;  // Evita errores si el select no existe

    selectPersona.innerHTML = "";
    personas.forEach(persona => {
        let option = document.createElement("option");
        option.value = persona.id;
        option.textContent = persona.nombre;
        selectPersona.appendChild(option);
    });
}

// Llamar a cargarPersonas() cuando cargue la página
document.addEventListener("DOMContentLoaded", cargarPersonas);
document.addEventListener("DOMContentLoaded", cargarRegistros);