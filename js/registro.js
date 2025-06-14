/**
 * Carga registros paginados desde el backend y actualiza la tabla HTML con los datos.
 *
 * @async
 * @function cargarRegistros
 * @param {number} [page=0] - Número de página a cargar (0-indexado).
 * @param {number} [size=5] - Cantidad de registros por página.
 *
 * @throws {Error} Si la respuesta del servidor no es exitosa (status HTTP distinto de 2xx).
 *
 * @description
 * Obtiene el token JWT desde localStorage para autorización.
 * Si no hay token, redirige al login.
 * Realiza una petición GET paginada al endpoint `/api/registro/paginacion`.
 * Llena el tbody con id "registros-list" con las filas correspondientes.
 * Muestra mensaje si no hay registros.
 * Actualiza los botones de paginación usando la función `actualizarBotones`.
 * En caso de error, muestra alerta y escribe en consola.
 */
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
                <td colspan="5" class="text-center text-muted">No hay oficinas que mostrar.</td>
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

/**
 * Actualiza los botones de paginación en la interfaz de usuario.
 *
 * @function actualizarBotones
 * @param {number} page - Número de la página actual (0-indexado).
 * @param {number} totalPages - Total de páginas disponibles.
 *
 * @description
 * Crea y muestra botones "Anterior" y "Siguiente" para navegar entre páginas,
 * deshabilitando los botones cuando no se pueda avanzar o retroceder más.
 * También muestra un texto con la página actual y el total de páginas.
 * Al hacer clic en los botones, llama a la función cargarRegistros con la página correspondiente.
 */
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

/**
 * Elimina un registro por su ID después de confirmar la acción con el usuario.
 *
 * @async
 * @function eliminarRegistro
 * @param {number|string} id - Identificador único del registro a eliminar.
 *
 * @throws {Error} Si la respuesta del servidor no es exitosa (HTTP no OK).
 *
 * @description
 * Solicita confirmación al usuario antes de enviar una petición DELETE al servidor
 * para eliminar el registro con el ID especificado. Si no hay token de sesión,
 * redirige al login. Después de eliminar, recarga la lista de registros.
 */
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

/**
 * Guarda el índice del registro a editar en localStorage y redirige al formulario de edición.
 *
 * @function editarRegistro
 * @param {number|string} index - Identificador o índice del registro a editar.
 *
 * @description
 * Esta función almacena en localStorage el ID del registro seleccionado para editar,
 * y luego redirige al usuario a la página del formulario para que pueda modificar los datos.
 */
function editarRegistro(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "formRegistro.html";
}

/**
 * Guarda o actualiza un registro de entrada/salida mediante una petición HTTP.
 *
 * @async
 * @function guardarRegistro
 * @param {Event} event - Evento del formulario que dispara la función.
 *
 * @description
 * Esta función previene el envío normal del formulario, valida los campos,
 * y dependiendo de si existe un id en localStorage (editIndex), hace una petición
 * POST para crear un nuevo registro o PUT para actualizar uno existente.
 * Valida que el usuario tenga un token JWT válido y maneja errores de la petición.
 */
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

/**
 * Inicializa la validación personalizada de formularios con Bootstrap.
 *
 * @description
 * Este script selecciona todos los formularios con la clase `.needs-validation`
 * y añade un listener al evento 'submit' para validar los campos.
 * Si el formulario no es válido, previene el envío y añade la clase
 * `was-validated` para mostrar estilos de validación.
 *
 * @function
 * @immediatelyInvokedFunctionExpression
 */
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

/**
 * Carga las personas activas desde la API y las agrega como opciones en un <select>.
 *
 * @async
 * @function cargarPersonasSelect
 *
 * @throws {Alert} Si no hay token de sesión válido, redirige al login y alerta al usuario.
 * @throws {Alert} Si ocurre un error al obtener las personas o la respuesta no es correcta.
 *
 * @description
 * Obtiene el token JWT del localStorage y realiza una petición GET a la API para obtener
 * las personas que están activas (`estado === true`). Luego llena el elemento <select> con id "persona"
 * con las opciones correspondientes, mostrando el nombre de cada persona y asignando el id como valor.
 */
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

/**
 * Exporta los registros a un archivo Excel descargable.
 *
 * @async
 * @function exportarExcel
 *
 * @description
 * Realiza una solicitud GET a la API para obtener un archivo Excel con los registros.
 * Si la respuesta es correcta, crea un enlace temporal para descargar el archivo.
 * En caso de error, muestra un mensaje en la consola.
 *
 * @throws {Error} Si la respuesta de la API no es exitosa, lanza un error.
 */
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

/**
 * Exporta los registros a un archivo PDF descargable.
 *
 * @async
 * @function exportarPDF
 *
 * @description
 * Realiza una solicitud GET a la API para obtener un archivo PDF con los registros.
 * Si la respuesta es correcta, crea un enlace temporal para descargar el archivo.
 * En caso de error, muestra un mensaje en la consola.
 *
 * @throws {Error} Si la respuesta de la API no es exitosa, lanza un error.
 */
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

/**
 * Realiza una búsqueda filtrada de registros con paginación.
 *
 * @async
 * @function buscarRegistrosFiltrado
 * @param {number} [page=0] - Número de página para la paginación.
 * @param {number} [size=5] - Cantidad de registros por página.
 *
 * @description
 * Obtiene el token JWT desde localStorage, verifica si está presente.
 * Recoge los valores de atributo y valor para filtrar.
 * Dependiendo del atributo seleccionado, construye la URL adecuada para la búsqueda.
 * Si no hay valor para filtrar, carga todos los registros.
 * Muestra los resultados en una tabla y actualiza los botones de paginación.
 * Maneja errores y casos donde no se encuentran registros.
 *
 * @throws {Error} Si la solicitud fetch falla o el servidor responde con un error HTTP.
 */
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
                  <button onclick="editarRegistro(${registro.id})" class="btn btn-editar"> 
                      <i class="bi bi-pencil-square"></i> Editar</button>
                  <button onclick="eliminarRegistro(${registro.id})" class="btn btn-eliminar"> 
                      <i class="bi bi-trash-fill"></i> Eliminar</button>
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
                   <button onclick="editarRegistro(${registro.id})" class="btn btn-editar"> 
                        <i class="bi bi-pencil-square"></i> Editar</button>
                    <button onclick="eliminarRegistro(${registro.id})" class="btn btn-eliminar"> 
                        <i class="bi bi-trash-fill"></i> Eliminar</button>
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