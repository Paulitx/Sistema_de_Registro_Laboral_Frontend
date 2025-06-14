/**
 * Carga una lista paginada de personas desde el servidor y actualiza la interfaz.
 *
 * @async
 * @function cargarPersonas
 * @param {number} [page=0] - Número de la página a cargar.
 * @param {number} [size=5] - Cantidad de registros por página.
 * @returns {Promise<void>} - No retorna nada directamente; actualiza la tabla en el DOM.
 * @throws {Error} - Si ocurre un problema durante la carga, como un error de red o de servidor.
 */
async function cargarPersonas(page = 0, size = 5) {
    /**
     * @constant {string} token - Token JWT almacenado en el localStorage para autenticar la solicitud.
     */
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

        /**
         * @typedef {Object} Persona
         * @property {number} id - ID único de la persona.
         * @property {string} idUsuario - Identificador de usuario relacionado.
         * @property {string} nombre - Nombre completo de la persona.
         * @property {string} email - Dirección de correo electrónico.
         * @property {string} direccion - Dirección física de la persona.
         * @property {string} fechaNacimiento - Fecha de nacimiento de la persona.
         * @property {Object} oficina - Oficina a la que pertenece.
         * @property {string} oficina.nombre - Nombre de la oficina.
         * @property {string} telefono - Número de teléfono de la persona.
         * @property {string} cargo - Cargo o posición en la organización.
         * @property {boolean} estado - Estado activo/inactivo.
         */

        /**
         * @typedef {Object} PaginatedResponse
         * @property {Persona[]} content - Lista de personas en la página actual.
         * @property {number} number - Número de la página actual.
         * @property {number} totalPages - Total de páginas disponibles.
         */

        /**
         * @type {PaginatedResponse}
         */
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
                        <button onclick="editarPersona(${persona.id})" class="btn btn-editar"> 
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button onclick="eliminarPersona(${persona.id})" class="btn btn-eliminar"> 
                            <i class="bi bi-trash-fill"></i> Eliminar
                        </button>
                    </td>
                </tr>`;
                tbody.innerHTML += fila;
            });
        }

        /**
         * Actualiza los botones de paginación en la interfaz.
         *
         * @function actualizarBotones
         * @param {number} currentPage - Página actual.
         * @param {number} totalPages - Total de páginas.
         */
        actualizarBotones(data.number, data.totalPages);

    } catch (error) {
        console.error('Error al cargar personas:', error);
        alert('No se pudieron obtener las personas.');
    }
}

/**
 * Actualiza los botones de paginación en la interfaz de usuario.
 *
 * @function actualizarBotones
 * @param {number} page - Número de la página actual (comenzando desde 0).
 * @param {number} totalPages - Número total de páginas disponibles.
 * @returns {void} - No retorna nada; modifica el DOM directamente.
 */
function actualizarBotones(page, totalPages) {
    /**
     * @constant {HTMLElement} paginacion - Contenedor de los botones de paginación.
     */
    const paginacion = document.getElementById("paginacion");
    paginacion.innerHTML = "";

    // Botón "Anterior"
    /**
     * @constant {HTMLButtonElement} btnAnterior - Botón para ir a la página anterior.
     */
    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "Anterior";
    btnAnterior.className = "btn btn-primary mx-1";
    btnAnterior.disabled = page === 0; // Deshabilitado si es la primera página
    btnAnterior.onclick = () => cargarPersonas(page - 1, 5); // Cambia a la página anterior
    paginacion.appendChild(btnAnterior);

    // Información de la página actual
    /**
     * @constant {HTMLSpanElement} infoPagina - Texto que muestra la página actual y el total de páginas.
     */
    const infoPagina = document.createElement("span");
    infoPagina.textContent = `Página ${page + 1} de ${totalPages}`;
    infoPagina.className = "mx-2 align-self-center";
    paginacion.appendChild(infoPagina);

    // Botón "Siguiente"
    /**
     * @constant {HTMLButtonElement} btnSiguiente - Botón para ir a la página siguiente.
     */
    const btnSiguiente = document.createElement("button");
    btnSiguiente.textContent = "Siguiente";
    btnSiguiente.className = "btn btn-primary mx-1";
    btnSiguiente.disabled = page === totalPages - 1; // Deshabilitado si es la última página
    btnSiguiente.onclick = () => cargarPersonas(page + 1, 5); // Cambia a la página siguiente
    paginacion.appendChild(btnSiguiente);
}

/**
 * Elimina una persona del sistema y actualiza la lista de personas en la interfaz.
 *
 * @async
 * @function eliminarPersona
 * @param {number} id - ID de la persona que se desea eliminar.
 * @returns {Promise<void>} - No retorna valores directamente; actualiza la lista de personas al completarse.
 * @throws {Error} - Si ocurre un error durante la solicitud de eliminación.
 */
async function eliminarPersona(id) {
    /**
     * Muestra un cuadro de confirmación antes de proceder con la eliminación.
     * @constant {boolean} confirmar - Resultado del cuadro de confirmación.
     */
    if (confirm("¿Estás seguro de que deseas eliminar a esta persona?")) {
        /**
         * @constant {string|null} token - Token JWT almacenado en el localStorage para autenticar la solicitud.
         */
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            alert("No has iniciado sesión. Redirigiendo al login...");
            window.location.href = "login.html";
            return;
        }

        try {
            /**
             * Realiza la solicitud DELETE al servidor.
             * @constant {Response} respuesta - Respuesta de la solicitud HTTP.
             */
            const respuesta = await fetch(`http://localhost:8080/api/persona/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

            /**
             * Recarga la lista de personas después de eliminar exitosamente.
             */
            await cargarPersonas();

        } catch (error) {
            console.error('Error al eliminar persona:', error);
            alert('No se pudo eliminar la persona');
        }
    }
}


/**
 * Redirige al usuario a la página de edición de persona, almacenando el ID de la persona en el localStorage.
 *
 * @function editarPersona
 * @param {number} id - ID de la persona que se desea editar.
 */
function editarPersona(id) {
    localStorage.setItem("editIndex", id);
    window.location.href = "formPersona.html";
}

/**
 * Guarda una nueva persona o actualiza una existente, dependiendo de si hay un ID almacenado en localStorage.
 *
 * @async
 * @function guardarPersona
 * @param {Event} event - Evento del formulario que se desea manejar.
 * @returns {Promise<void>} - No retorna valores directamente; redirige al usuario al índice de personas.
 * @throws {Error} - Si ocurre un error durante la solicitud de creación o edición.
 */
async function guardarPersona(event) {
    /**
     * @constant {string|null} token - Token JWT almacenado en el localStorage para autenticar la solicitud.
     */
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

    // Obtención de datos del formulario
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

    /**
     * Objeto persona que incluye información básica y asignación de oficina.
     * @type {Object}
     * @property {string} idUsuario - ID del usuario asociado.
     * @property {string} nombre - Nombre de la persona.
     * @property {string} email - Correo electrónico de la persona.
     * @property {string} direccion - Dirección de la persona.
     * @property {string} fechaNacimiento - Fecha de nacimiento de la persona.
     * @property {string} telefono - Teléfono de contacto de la persona.
     * @property {string} cargo - Cargo laboral de la persona.
     * @property {string} estado - Estado activo o inactivo de la persona.
     * @property {number} oficina - ID de la oficina asociada.
     */
    let persona = {
        idUsuario,
        nombre,
        email,
        direccion,
        fechaNacimiento,
        telefono,
        cargo,
        estado,
        oficina: parseInt(oficinaId)
    };

    let id = localStorage.getItem("editIndex");

    if (id !== null) {
        // Modificación de persona
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
        // Creación de persona
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
            console.error('Error al guardar persona:', error);
            alert('No se pudo guardar la persona.');
        }
    }
}


/**
 * Carga las oficinas desde el servidor y las agrega como opciones en un elemento `<select>` en la interfaz.
 *
 * @async
 * @function cargarOficinasParaSelect
 * @param {number|null} [idOficinaSeleccionada=null] - ID de la oficina que debe aparecer seleccionada inicialmente.
 * Si no se proporciona, ninguna opción estará preseleccionada.
 * @returns {Promise<void>} - No retorna valores directamente; actualiza el contenido del elemento `<select>`.
 * @throws {Error} - Si ocurre un error durante la solicitud de datos.
 */
async function cargarOficinasParaSelect(idOficinaSeleccionada = null) {
    /**
     * @constant {string|null} token - Token JWT almacenado en el localStorage para autenticar la solicitud.
     */
    const token = localStorage.getItem("jwtToken");

    try {
        /**
         * Realiza la solicitud GET para obtener las oficinas.
         * @constant {Response} respuesta - Respuesta de la solicitud HTTP.
         */
        const respuesta = await fetch('http://127.0.0.1:8080/api/oficina', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        /**
         * Lista de oficinas obtenida desde la API.
         * @type {Array<Object>}
         */
        const oficinas = await respuesta.json();

        /**
         * Elemento `<select>` donde se cargarán las oficinas.
         * @constant {HTMLSelectElement} select - Elemento del DOM identificado como "oficina".
         */
        const select = document.getElementById("oficina");
        select.innerHTML = '<option value="">Selecciona una oficina</option>';

        /**
         * Agrega las oficinas como opciones en el elemento `<select>`.
         */
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


/**
 * Exporta un archivo PDF con información de las personas desde el servidor.
 *
 * @async
 * @function exportarPDF
 * @returns {Promise<void>} - No retorna valores directamente; genera una descarga del archivo PDF.
 * @throws {Error} - Si ocurre un error durante la solicitud o al procesar la respuesta.
 */
async function exportarPDF() {
    /**
     * @constant {string|null} token - Token JWT almacenado en el localStorage para autenticar la solicitud.
     */
    const token = localStorage.getItem("jwtToken");

    fetch('http://localhost:8080/api/persona/exportar/pdf', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.ok) {
                /**
                 * Convierte la respuesta en un Blob si la solicitud fue exitosa.
                 * @returns {Blob} - Representación del archivo PDF como Blob.
                 */
                return response.blob();
            } else {
                throw new Error('No se pudo exportar el archivo PDF.');
            }
        })
        .then(blob => {
            /**
             * Genera una URL de objeto a partir del Blob y desencadena la descarga del archivo.
             */
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'personas.pdf'; // Nombre del archivo descargado
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => {
            console.error('Error al exportar PDF:', error);
        });
}


/**
 * Exporta un archivo Excel con información de las personas desde el servidor.
 *
 * @async
 * @function exportarExcel
 * @returns {Promise<void>} - No retorna valores directamente; genera una descarga del archivo Excel.
 * @throws {Error} - Si ocurre un error durante la solicitud o al procesar la respuesta.
 */
async function exportarExcel() {
    /**
     * @constant {string|null} token - Token JWT almacenado en el localStorage para autenticar la solicitud.
     */
    const token = localStorage.getItem("jwtToken");

    fetch('http://localhost:8080/api/persona/exportar/excel', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.ok) {
                /**
                 * Convierte la respuesta en un Blob si la solicitud fue exitosa.
                 * @returns {Blob} - Representación del archivo Excel como Blob.
                 */
                return response.blob();
            } else {
                throw new Error('No se pudo exportar el archivo Excel.');
            }
        })
        .then(blob => {
            /**
             * Genera una URL de objeto a partir del Blob y desencadena la descarga del archivo.
             */
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'personas.xlsx'; // Nombre del archivo descargado
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => {
            console.error('Error al exportar Excel:', error);
        });
}


/**
 * Realiza una búsqueda filtrada de personas según un atributo y valor especificados.
 * Si no se especifica valor, carga todas las personas.
 * Actualiza la tabla HTML con los resultados encontrados.
 *
 * @async
 * @function buscarPersonasFiltrado
 * @returns {Promise<void>} No retorna valor, actualiza la UI directamente.
 * @throws {Error} Lanza error si falla la solicitud fetch.
 */
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
        // Si no hay valor, carga todas las personas
        await cargarPersonas();
        return;
    }

    let urlBase = "http://127.0.0.1:8080/api/persona";
    let url = "";

    switch (atributo) {
        case "id":
            url = `${urlBase}/id/${valor}`;
            break;
        case "idUsuario":
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
                    <button onclick="editarPersona(${persona.id})" class="btn btn-editar"> 
                       <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    <button onclick="eliminarPersona(${persona.id})" class="btn btn-eliminar"> 
                        <i class="bi bi-trash-fill"></i> Eliminar
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
                    <button onclick="editarPersona(${persona.id})" class="btn btn-editar"> 
                       <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    <button onclick="eliminarPersona(${persona.id})" class="btn btn-eliminar"> 
                        <i class="bi bi-trash-fill"></i> Eliminar
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

/**
 * Configura el listener para el campo de búsqueda una vez que el DOM ha cargado.
 * Cuando el usuario escribe en el campo #busqueda, se dispara la función buscarPersonasFiltrado.
 */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("busqueda").addEventListener("input", () => {
        buscarPersonasFiltrado();
    });
});

