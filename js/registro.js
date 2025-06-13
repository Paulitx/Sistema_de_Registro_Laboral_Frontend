async function cargarRegistros(page = 0, size = 5) {

    const token = localStorage.getItem("jwtToken");

    if (!token) {
        alert("No has iniciado sesión. Redirigiendo al login...");
        window.location.href = "login.html";
        return;
    }

    try {
        const respuesta = await fetch(`http://127.0.0.1:8080/api/registro/paginacion?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        const registros = await respuesta.json();

        const tbody = document.getElementById("registros-list");
        tbody.innerHTML = "";

        if (registros.content.length === 0) {
            tbody.innerHTML = `<tr>
                <td colspan="5" class="text-white" style="background-color: #d895c6">No hay oficinas que mostrar.</td>
            </tr>`;
        } else {
            registros.content.forEach(registro => {
                let personaNombre = (registro.persona && registro.persona.nombre) ? registro.persona.nombre : "Desconocido";
                let fila = `<tr>
                    <td>${registro.id}</td>
                    <td>${personaNombre}</td>
                    <td>${registro.tipo}</td>
                    <td>${registro.fechaHora}</td>
                    <td>
                        <button onclick="editarRegistro(${registro.id})" class="btn btn-editar"> 
                            <i class="bi bi-pencil-square"></i> Editar</button>
                        <button onclick="eliminarRegistro(${registro.id})" class="btn btn-eliminar"> 
                            <i class="bi bi-trash-fill"></i> Eliminar</button>
                    </td>
                </tr>`;
                tbody.innerHTML += fila;
            });
        }
        actualizarBotones(registros.number, registros.totalPages);

    } catch (error) {
        console.error('Error al cargar registros:', error);
        alert('No se pudieron obtener los registros.');
    }
}

function actualizarBotones(page, totalPages) {
    const paginacion = document.getElementById("paginacion");
    paginacion.innerHTML = "";

//boton "anterior" de la pagina
    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "Anterior";
    btnAnterior.className = "btn btn-primary mx-1";
    btnAnterior.disabled = page === 0;
    btnAnterior.onclick = () => cargarRegistros(page - 1, 5); ////va a la pagina anterior
    paginacion.appendChild(btnAnterior);

    //pagina actual
    const infoPagina = document.createElement("span");
    infoPagina.textContent = `Pagina ${page + 1} de ${totalPages}`;
    infoPagina.className = "mx-2 align-self-center";
    paginacion.appendChild(infoPagina);

//boton "siguiente" de la pagina
    const btnSiguiente = document.createElement("button");
    btnSiguiente.textContent = "Siguiente";
    btnSiguiente.className = "btn btn-primary mx-1";
    btnSiguiente.disabled = page === totalPages - 1;
    btnSiguiente.onclick = () => cargarRegistros(page + 1, 5); //va a la siguiente pagiona
    paginacion.appendChild(btnSiguiente);
}

async function eliminarRegistro(id) {

    if(confirm("¿Estás seguro de que deseas eliminar a esta Registro?")) {

        const token = localStorage.getItem("jwtToken");

        if (!token) {
            alert("No has iniciado sesión. Redirigiendo al login...");
            window.location.href = "login.html";
            return;
        }

        try {
            const respuesta = await fetch(`http://localhost:8080/api/registro/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

            await cargarRegistros();

        } catch (error) {
            console.error('Error al eliminar Registro:', error);
            alert('No se pudo eliminar la Registro');
        }
    }
}

//edita el registro
function editarRegistro(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "formRegistro.html";
}

async function guardarRegistro(event) {

    const token = localStorage.getItem("jwtToken");

    if (!token) {
        alert("No has iniciado sesión. Redirigiendo al login...");
        window.location.href = "login.html";
        return;
    }

    event.preventDefault();
    let form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    let tipoRegistro = document.getElementById("tipo").value.trim();
    let fechaHora = document.getElementById("fechaHora").value.trim();
    let personaId = parseInt(document.getElementById("persona").value);

    if (!tipoRegistro || !fechaHora || !personaId) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    let registro = {
        tipo: tipoRegistro,
        fechaHora: fechaHora,
        personaId: personaId
    };

    let id = localStorage.getItem("editIndex");
    let urlBase = 'http://127.0.0.1:8080/api/registro';

    if (id !== null && id !== "null") {
        // Editar registro existente (PUT)
        try {
            const respuesta = await fetch(`${urlBase}/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registro)
            });

            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

            alert('Registro actualizado correctamente.');
            localStorage.removeItem("editIndex");
            window.location.href = "indexRegistro.html";

        } catch (error) {
            console.error('Error al actualizar registro:', error);
            alert('Ocurrió un error al actualizar el registro.');
        }
    } else {
        try {
            const respuesta = await fetch(urlBase, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registro)
            });

            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

            alert('Registro creado correctamente.');
            window.location.href = "indexRegistro.html";

        } catch (error) {
            console.error('Error al crear registro:', error);
            alert('Ocurrió un error al crear el registro.');
        }
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
async function cargarPersonasSelect() {
    const selectPersona = document.getElementById("persona");
    try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("No has iniciado sesión. Redirigiendo al login...");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch("http://127.0.0.1:8080/api/persona/registro", {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            alert("Error al cargar personas.");
            return;
        }

        const personas = await response.json();

        selectPersona.innerHTML = '<option value="" disabled selected>Seleccione una persona</option>';
        personas
            .filter(persona => persona.estado === true)
            .forEach(persona => {
                const option = document.createElement("option");
                option.value = persona.id;
                option.textContent = `${persona.nombre}`;
                selectPersona.appendChild(option);
            });

    } catch (error) {
        console.error("Error cargando personas:", error);
        alert("Ocurrió un error al cargar las personas.");
    }
}

async function exportarExcel() {
    const token = localStorage.getItem("jwtToken");
    fetch('http://localhost:8080/api/registro/exportar/excel', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.ok) {
                return response.blob(); // Convertir la respuesta en un Blob
            } else {
                throw new Error('No se pudo exportar el archivo Excel.');
            }
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'registros.xlsx'; // Nombre del archivo descargado
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => console.error('Error al exportar Excel:', error));
}

// Función para descargar el archivo PDF
async function exportarPDF() {
    const token = localStorage.getItem("jwtToken");
    fetch('http://localhost:8080/api/registro/exportar/pdf', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.ok) {
                return response.blob(); // Convertir la respuesta en un Blob
            } else {
                throw new Error('No se pudo exportar el archivo PDF.');
            }
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'registros.pdf'; // Nombre del archivo descargado
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => console.error('Error al exportar PDF:', error));
}

async function buscarRegistrosFiltrado(page = 0, size = 5) {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        alert("No has iniciado sesión. Redirigiendo al login...");
        window.location.href = "login.html";
        return;
    }

    const atributo = document.getElementById("atributoBusqueda").value;
    const valor = document.getElementById("busqueda").value.trim();

    if (!atributo) {
        alert("Por favor selecciona un atributo para buscar.");
        return;
    }

    if (!valor) {
        await cargarRegistros(page, size);
        return;
    }

    const tbody = document.getElementById("registros-list");
    tbody.innerHTML = "";

    let urlBase = "http://127.0.0.1:8080/api/registro";
    let url = "";

    switch (atributo) {
        case "id":
            url = `${urlBase}/id/${valor}`;
            break;
        case "persona":
            url = `${urlBase}/persona?personaId=${encodeURIComponent(valor)}&page=${page}&size=${size}`;
            break;
        case "tipo":
            url = `${urlBase}/tipo?tipo=${encodeURIComponent(valor)}&page=${page}&size=${size}`;
            break;
        case "fechaHora":
            url = `${urlBase}/fechaHora?fechaHora=${encodeURIComponent(valor)}&page=${page}&size=${size}`;
            break;
        default:
            alert("Atributo no reconocido para búsqueda.");
            return;
    }

    try {
        const respuesta = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            if (atributo === "id" && respuesta.status === 404) {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No se encontraron registros con esos criterios.</td></tr>`;
                return;
            }
            alert(`Error en la búsqueda: HTTP ${respuesta.status}`);
            return;
        }

        const data = await respuesta.json();

        if (atributo === "id") {
            if (!data || !data.id) {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No se encontraron registros con esos criterios.</td></tr>`;
                return;
            }

            const registro = data;
            let personaNombre = registro.persona?.nombre || "Desconocido";
            tbody.innerHTML = `<tr>
                <td>${registro.id}</td>
                <td>${personaNombre}</td>
                <td>${registro.tipo}</td>
                <td>${registro.fechaHora}</td>
                <td>
                    <button onclick="editarRegistro(${registro.id})" class="btn btn-warning">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button onclick="eliminarRegistro(${registro.id})" class="btn btn-danger">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>`;
            return;
        }

        const registros = data.content || data;

        if (!Array.isArray(registros) || registros.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No se encontraron registros con esos criterios.</td></tr>`;
            actualizarBotones(page, data.totalPages);
            return;
        }

        registros.forEach(registro => {
            let personaNombre = registro.persona?.nombre || "Desconocido";
            let fila = `<tr>
                <td>${registro.id}</td>
                <td>${personaNombre}</td>
                <td>${registro.tipo}</td>
                <td>${registro.fechaHora}</td>
                <td>
                    <button onclick="editarRegistro(${registro.id})" class="btn btn-warning">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button onclick="eliminarRegistro(${registro.id})" class="btn btn-danger">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>`;
            tbody.innerHTML += fila;
        });

        actualizarBotones(data.number, data.totalPages);

    } catch (error) {
        console.error("Error buscando registros:", error);
        alert("Error al realizar la búsqueda.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("busqueda").addEventListener("input", () => {
        buscarRegistrosFiltrado();
    });
});