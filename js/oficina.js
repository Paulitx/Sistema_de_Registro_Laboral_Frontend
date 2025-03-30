let paginaActual = 1;
const registrosPorPagina = 5;

function cargarOficinas() {
    let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];
    let tbody = document.getElementById("oficinas-list");
    let totalPaginas = Math.ceil(oficinas.length / registrosPorPagina);

    tbody.innerHTML = "";
    if (oficinas.length === 0) {
        tbody.innerHTML = `<tr>
            <td colspan="4" class="text-white" style="background-color: #d895c6">No hay datos disponibles.</td>
        </tr>`;
    }

    let oficinasPagina = oficinas.slice((paginaActual - 1) * registrosPorPagina, paginaActual * registrosPorPagina);
    oficinasPagina.forEach((oficina, index) => {


        let fila = `<tr>
                    <td>${oficina.nombre}</td>
                    <td>${oficina.ubicacion}</td>
                    <td>${oficina.limitePersonas}</td>
                    <td>
                        <button onclick="editarOficina(${index})" class="btn btn-editar"> 
                            <i class="bi bi-pencil-square"></i> Editar</button>
                        <button onclick="confirmarEliminacion(${index})" class="btn btn-eliminar"> 
                            <i class="bi bi-trash-fill"></i> Eliminar</button>
                    </td>
                </tr>`;
        tbody.innerHTML += fila;
    });
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
            cargarOficinas();
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
            cargarOficinas();
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
            cargarOficinas();
        };
        paginacionDiv.appendChild(btnSiguiente);
    }
}

function confirmarEliminacion(index) {
    const confirmacion = confirm("¿Desea eliminar esta oficina?");
    if (confirmacion) {
        eliminarOficina(index);
    }
}

function eliminarOficina(index) {
    let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];
    oficinas.splice(index, 1);
    localStorage.setItem("oficinas", JSON.stringify(oficinas));
    cargarOficinas();
}

function editarOficina(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "formOficina.html";
}

function guardarOficina(event) {
    event.preventDefault();
    let form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    let nombre = document.getElementById("nombre").value;
    let ubicacion = document.getElementById("ubicacion").value;
    let limitePersonas = parseInt(document.getElementById("limitePersonas").value, 10); // Convertir a número

    if (!nombre || !ubicacion || isNaN(limitePersonas) || limitePersonas <= 0) {
        alert("Todos los campos son obligatorios y el límite de personas debe ser un número válido mayor a 0.");
        return;
    }

    let oficina = { nombre, ubicacion, limitePersonas };
    let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];

    let index = localStorage.getItem("editIndex");
    if (index !== null && index !== "null") {
        oficinas[index] = oficina;  // Editar oficina existente
        localStorage.removeItem("editIndex");
    } else {
        oficinas.push(oficina);  // Agregar nueva oficina
    }

    localStorage.setItem("oficinas", JSON.stringify(oficinas));
    window.location.href = "indexOficina.html";
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


