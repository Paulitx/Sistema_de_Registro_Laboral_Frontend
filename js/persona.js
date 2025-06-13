let currentPage = 0; // Página inicial
const pageSize = 5; // Tamaño de página

async function cargarPersonas(page = 0, size = 5) {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        alert("No has iniciado sesión. Redirigiendo al login...");
        window.location.href = "login.html";
        return;
    }

    try {
        const respuesta = await fetch(`http://127.0.0.1:8080/api/persona/paginado?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        const data = await respuesta.json();

        // Actualizar la tabla con los datos de personas
        const tbody = document.getElementById("personas-list");
        tbody.innerHTML = ""; // Limpiar contenido previo

        if (data.content.length === 0) {
            tbody.innerHTML = `<tr>
                <td colspan="11" class="text-center text-muted">No hay personas que mostrar</td>
            </tr>`;
        } else {
            data.content.forEach(persona => {
                let fila = `<tr>
                    <td>${persona.id}</td>
                    <td>${persona.idUsuario}</td>
                    <td>${persona.nombre}</td>
                    <td>${persona.email}</td>
                    <td>${persona.direccion}</td>
                    <td>${persona.fechaNacimiento}</td>
                    <td>${persona.oficina.nombre}</td>
                    <td>${persona.telefono}</td>
                    <td>${persona.cargo}</td>
                    <td>${persona.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                        <button onclick="editarPersona(${persona.id})" class="btn btn-warning">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button onclick="eliminarPersona(${persona.id})" class="btn btn-danger">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>`;
                tbody.innerHTML += fila;
            });
        }

        // Actualizar los botones de paginación
        actualizarBotones(data.number, data.totalPages);

    } catch (error) {
        console.error('Error al cargar personas:', error);
        alert('No se pudieron obtener las personas.');
    }
}


function actualizarBotones(page, totalPages) {
    const paginacion = document.getElementById("paginacion");
    paginacion.innerHTML = ""; // Limpia los botones previos

    // Botón de Anterior
    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "Anterior";
    btnAnterior.className = "btn btn-primary mx-1";
    btnAnterior.disabled = page === 0; // Deshabilitar si estamos en la primera página
    btnAnterior.onclick = () => cargarPersonas(page - 1, 5); // Cambiar a la página anterior
    paginacion.appendChild(btnAnterior);

    // Botón de Siguiente
    const btnSiguiente = document.createElement("button");
    btnSiguiente.textContent = "Siguiente";
    btnSiguiente.className = "btn btn-primary mx-1";
    btnSiguiente.disabled = page === totalPages - 1; // Deshabilitar si estamos en la última página
    btnSiguiente.onclick = () => cargarPersonas(page + 1, 5); // Cambiar a la página siguiente
    paginacion.appendChild(btnSiguiente);

    // Opcional: Mostrar número de página actual
    const infoPagina = document.createElement("span");
    infoPagina.textContent = `Página ${page + 1} de ${totalPages}`;
    infoPagina.className = "mx-2 align-self-center";
    paginacion.appendChild(infoPagina);
}


async function eliminarPersona(id) {

    if(confirm("¿Estás seguro de que deseas eliminar a esta persona?")) {


        const token = localStorage.getItem("jwtToken");

        if (!token) {
            alert("No has iniciado sesión. Redirigiendo al login...");
            window.location.href = "login.html";
            return;
        }

        try {
            const respuesta = await fetch(`http://localhost:8080/api/persona/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

            await cargarPersonas();

        } catch (error) {
            console.error('Error al eliminar persona:', error);
            alert('No se pudo eliminar la persona');
        }
    }
}

function editarPersona(id) {
    localStorage.setItem("editIndex", id);
    window.location.href = "formPersona.html";
}
async function guardarPersona(event) {
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

    // Obtener datos del formulario
    let idUsuario = document.getElementById("idUsuario").value;
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let direccion = document.getElementById("direccion").value;
    let fechaNacimiento = document.getElementById("fechaNacimiento").value;
    let telefono = document.getElementById("telefono").value;
    let cargo = document.getElementById("cargo").value;
    let estado = document.getElementById("estado").value;
    let oficinaId = document.getElementById("oficina").value;

    if (!idUsuario || !nombre || !email || !direccion || !fechaNacimiento || !telefono || !cargo || !oficinaId || !estado) {
        alert("Todos los campos son obligatorios");
        return;
    }

    // Crear objeto persona con oficina referenciada por id
    let persona = {idUsuario, nombre, email, direccion, fechaNacimiento, telefono, cargo, estado, oficina: parseInt(oficinaId)
    };

    let id = localStorage.getItem("editIndex");

    if (id !== null) {
        // Modo edición
        try {
            const respuesta = await fetch(`http://127.0.0.1:8080/api/persona/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(persona)
            });

            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

            localStorage.removeItem("editIndex");
            window.location.href = "indexPersona.html";

        } catch (error) {
            console.error('Error al guardar persona (edición):', error);
            alert('No se pudo guardar la persona.');
        }
    } else {
        // Modo creación
        try {
            const respuesta = await fetch('http://127.0.0.1:8080/api/persona', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(persona)
            });

            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

            window.location.href = "indexPersona.html";

        } catch (error) {
            console.error('Error al guardar persona (creación):', error);
            alert('No se pudo guardar la persona.');
        }
    }
}
async function cargarOficinasParaSelect(idOficinaSeleccionada = null) {
    const token = localStorage.getItem("jwtToken");
    try {
        const respuesta = await fetch('http://127.0.0.1:8080/api/oficina', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        const oficinas = await respuesta.json();

        const select = document.getElementById("oficina");
        select.innerHTML = '<option value="">Selecciona una oficina</option>';

        oficinas.forEach(oficina => {
            const option = document.createElement("option");
            option.value = oficina.id;
            option.textContent = oficina.nombre;
            if (idOficinaSeleccionada && oficina.id === idOficinaSeleccionada) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar oficinas:', error);
        alert('No se pudieron cargar las oficinas.');
    }
}

// Función para descargar el archivo Excel
async function exportarExcel() {
    const token = localStorage.getItem("jwtToken");
    fetch('http://localhost:8080/api/persona/exportar/excel', {
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
            a.download = 'personas.xlsx'; // Nombre del archivo descargado
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => console.error('Error al exportar Excel:', error));
}

// Función para descargar el archivo PDF
async function exportarPDF() {
    const token = localStorage.getItem("jwtToken");
    fetch('http://localhost:8080/api/persona/exportar/pdf', {
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
            a.download = 'personas.pdf'; // Nombre del archivo descargado
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => console.error('Error al exportar PDF:', error));
}

