
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

        const tbody = document.getElementById("personas-list");
        tbody.innerHTML = "";

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

        actualizarBotones(data.number, data.totalPages);

    } catch (error) {
        console.error('Error al cargar personas:', error);
        alert('No se pudieron obtener las personas.');
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
    btnAnterior.onclick = () => cargarPersonas(page - 1, 5); ////va a la pagina anterior
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
    btnSiguiente.onclick = () => cargarPersonas(page + 1, 5); //va a la siguiente pagiona
    paginacion.appendChild(btnSiguiente);
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
    //persona objeto, aqui se le asigna la oficina tambien
    let persona = {idUsuario, nombre, email, direccion, fechaNacimiento, telefono, cargo, estado, oficina: parseInt(oficinaId)
    };

    let id = localStorage.getItem("editIndex");

    if (id !== null) {
        //modiificar
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
        ///agregar
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
async function buscarPersonasFiltrado() {
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
        await cargarPersonas(); // Si el valor está vacío, carga todos los datos
        return;
    }

    let urlBase = "http://127.0.0.1:8080/api/persona";
    let url = "";

    switch (atributo) {
        case "id":
            url = `${urlBase}/id/${valor}`;
            break;
        case "nombre":
        case "email":
        case "direccion":
        case "telefono":
        case "cargo":
            url = `${urlBase}/${atributo}?${atributo}=${encodeURIComponent(valor)}`;
            break;
        case "fechaNacimiento":
            url = `${urlBase}/fechaNacimiento?fechaNacimiento=${encodeURIComponent(valor)}`;
            break;
        case "oficina":
            url = `${urlBase}/oficina?idOficina=${encodeURIComponent(valor)}`;
            break;
        case "estado":
            let estadoValor = null;
            if (valor.toLowerCase() === "activo") estadoValor = true;
            else if (valor.toLowerCase() === "inactivo") estadoValor = false;
            else if (valor.toLowerCase() === "true" || valor.toLowerCase() === "false") {
                estadoValor = (valor.toLowerCase() === "true");
            } else {
                alert("Para estado escribe 'Activo', 'Inactivo', 'true' o 'false'.");
                return;
            }
            url = `${urlBase}/estado?estado=${estadoValor}`;
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

        const tbody = document.getElementById("personas-list");
        tbody.innerHTML = "";

        if (!respuesta.ok) {
            // Para búsqueda por ID, si no se encuentra, mostrar mensaje amigable
            if (atributo === "id" && respuesta.status === 404) {
                tbody.innerHTML = `<tr><td colspan="11" class="text-center text-muted">No se encontraron personas con esos criterios.</td></tr>`;
                return;
            }

            alert(`Error en la búsqueda: HTTP ${respuesta.status}`);
            return;
        }

        const data = await respuesta.json();

        if (atributo === "id") {
            if (!data || !data.id) {
                tbody.innerHTML = `<tr><td colspan="11" class="text-center text-muted">No se encontraron personas con esos criterios.</td></tr>`;
                return;
            }

            const persona = data;
            tbody.innerHTML = `<tr>
                <td>${persona.id}</td>
                <td>${persona.idUsuario}</td>
                <td>${persona.nombre}</td>
                <td>${persona.email}</td>
                <td>${persona.direccion}</td>
                <td>${persona.fechaNacimiento}</td>
                <td>${persona.oficina?.nombre || ''}</td>
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
            return;
        }

        const personas = data.content || data;

        if (!Array.isArray(personas) || personas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="11" class="text-center text-muted">No se encontraron personas con esos criterios.</td></tr>`;
            return;
        }

        personas.forEach(persona => {
            let fila = `<tr>
                <td>${persona.id}</td>
                <td>${persona.idUsuario}</td>
                <td>${persona.nombre}</td>
                <td>${persona.email}</td>
                <td>${persona.direccion}</td>
                <td>${persona.fechaNacimiento}</td>
                <td>${persona.oficina?.nombre || ''}</td>
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

    } catch (error) {
        console.error("Error buscando personas:", error);
        alert("Error al realizar la búsqueda.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("busqueda").addEventListener("input", () => {
        buscarPersonasFiltrado();
    });
});