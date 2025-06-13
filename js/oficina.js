/**
 * Carga una lista de oficinas paginadas desde el servidor y las muestra en la tabla del DOM.
 *
 * @async
 * @function cargarOficinas
 * @param {number} [page=0] - Número de página a cargar (por defecto, 0).
 * @param {number} [size=5] - Cantidad de oficinas por página (por defecto, 5).
 * @throws {Error} Si ocurre un error al obtener las oficinas desde el servidor.
 *
 * @description
 * - Verifica que exista un token JWT en el almacenamiento local antes de proceder.
 * - Si no hay token, redirige al usuario a la página de inicio de sesión.
 * - Realiza una solicitud GET a la API de oficinas con parámetros de paginación.
 * - Muestra las oficinas en una tabla del DOM o un mensaje si no hay datos.
 * - Actualiza los botones de paginación basados en la respuesta del servidor.
 *
 * @example
 * // Llamar la función para cargar la primera página con 10 oficinas por página
 * cargarOficinas(0, 10);
 */
async function cargarOficinas(page = 0, size = 5) {

    const token = localStorage.getItem("jwtToken");

    if (!token) {
        alert("No has iniciado sesión. Redirigiendo al login...");
        window.location.href = "login.html";
        return;
    }

    try {
        const respuesta = await fetch(`http://127.0.0.1:8080/api/oficina/paginado?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        const oficinas = await respuesta.json();

        const tbody = document.getElementById("oficinas-list");
        tbody.innerHTML = "";

        if (oficinas.content.length === 0) {
            tbody.innerHTML = `<tr>
                <td colspan="6" class="text-center text-muted">No hay oficinas que mostrar</td>
            </tr>`;
        } else {
            oficinas.content.forEach(oficina => {
                let fila = `<tr>
                    <td>${oficina.id}</td>
                    <td>${oficina.nombre}</td>
                    <td>${oficina.ubicacion}</td>
                    <td>${oficina.limitePersonas}</td>
                    <td>${oficina.personasActuales}</td>                                          
                    <td>
                        <button onclick="editarOficina(${oficina.id})" class="btn btn-editar"> 
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button onclick="eliminarOficina(${oficina.id})" class="btn btn-eliminar"> 
                            <i class="bi bi-trash-fill"></i> Eliminar
                        </button>
                    </td>
                </tr>`;
                tbody.innerHTML += fila;
            });
        }
        actualizarBotones(oficinas.number, oficinas.totalPages);

    } catch (error) {
        console.error('Error al cargar oficinas:', error);
        alert('No se pudieron obtener las oficinas.');
    }
}

/**
 * Actualiza los botones de paginación en el DOM según la página actual y el número total de páginas.
 *
 * @function actualizarBotones
 * @param {number} page - El número de la página actual (basado en índice, comenzando desde 0).
 * @param {number} totalPages - El número total de páginas disponibles.
 *
 * @description
 * - Genera botones "Anterior" y "Siguiente" según la página actual y las habilita/deshabilita si es la primera o última página.
 * - Muestra información sobre la página actual en el formato "Página X de Y".
 * - Los botones llaman a la función `cargarOficinas` con el número de página correspondiente al hacer clic.
 *
 * @example
 * // Actualiza los botones de paginación para la página 2 de un total de 5
 * actualizarBotones(1, 5);
 */
function actualizarBotones(page, totalPages) {
    const paginacion = document.getElementById("paginacion");
    paginacion.innerHTML = "";

//boton "anterior" de la pagina
    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "Anterior";
    btnAnterior.className = "btn btn-primary mx-1";
    btnAnterior.disabled = page === 0;
    btnAnterior.onclick = () => cargarOficinas(page - 1, 5); ////va a la pagina anterior
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
    btnSiguiente.onclick = () => cargarOficinas(page + 1, 5); //va a la siguiente pagiona
    paginacion.appendChild(btnSiguiente);
}

/**
 * Elimina una oficina específica del sistema y actualiza la lista de oficinas en el DOM.
 *
 * @async
 * @function eliminarOficina
 * @param {number} id - El ID de la oficina que se desea eliminar.
 *
 * @description
 * - Solicita confirmación al usuario antes de proceder con la eliminación.
 * - Verifica la existencia de un token JWT en el almacenamiento local.
 * - Si no hay token, redirige al usuario a la página de inicio de sesión.
 * - Realiza una solicitud DELETE a la API para eliminar la oficina con el ID proporcionado.
 * - En caso de éxito, actualiza la lista de oficinas cargándolas de nuevo.
 * - Maneja errores y muestra alertas en caso de problemas durante el proceso.
 *
 * @throws {Error} Si ocurre un error al realizar la solicitud DELETE o actualizar la lista de oficinas.
 *
 * @example
 * // Eliminar una oficina con ID 3
 * eliminarOficina(3);
 */
async function eliminarOficina(id) {

    if(confirm("¿Estás seguro de que deseas eliminar a esta Oficina?")) {

        const token = localStorage.getItem("jwtToken");

        if (!token) {
            alert("No has iniciado sesión. Redirigiendo al login...");
            window.location.href = "login.html";
            return;
        }

        try {
            const respuesta = await fetch(`http://localhost:8080/api/oficina/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

            await cargarOficinas();

        } catch (error) {
            console.error('Error al eliminar Oficina:', error);
            alert('No se pudo eliminar la Oficina');
        }
    }
}

/**
 * Redirige al usuario a un formulario para editar una oficina específica.
 *
 * @function editarOficina
 * @param {number} id - El ID de la oficina que se desea editar.
 *
 * @description
 * - Almacena el ID de la oficina en el almacenamiento local bajo la clave `editIndex`.
 * - Redirige al usuario a la página `formOficina.html`, donde se puede editar la oficina.
 *
 * @example
 * // Editar una oficina con ID 5
 * editarOficina(5);
 */
function editarOficina(id) {
    localStorage.setItem("editIndex", id);
    window.location.href = "formOficina.html";
}

/**
 * Guarda una oficina en el sistema, ya sea creando una nueva o actualizando una existente.
 *
 * @async
 * @function guardarOficina
 * @param {Event} event - El evento de envío del formulario.
 *
 * @description
 * - Verifica la existencia y validez del token JWT.
 * - Decodifica el token para determinar el rol del usuario y restringe el acceso según corresponda.
 * - Valida los campos del formulario y muestra alertas en caso de errores.
 * - Realiza una solicitud `POST` para crear una oficina nueva o `PUT` para actualizar una existente.
 * - Redirige a la página `indexOficina.html` tras una operación exitosa.
 *
 * @throws {Error} Si ocurre un error durante la solicitud HTTP para guardar o actualizar la oficina.
 *
 * @example
 * // Vincular la función al evento de envío del formulario
 * const formulario = document.getElementById("formulario-oficina");
 * formulario.addEventListener("submit", guardarOficina);
 */
async function guardarOficina(event) {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        alert("No has iniciado sesión. Redirigiendo al login...");
        window.location.href = "login.html";
        return;
    }
    const decoded = jwt_decode(token);
    const userRole = decoded.role;

    if (userRole === "visor" || userRole === "registardor") {
        alert("No tienes permisos para agregar personas.");
        return; // Salir de la función sin hacer la petición
    }

    event.preventDefault();
    let form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    let nombre = document.getElementById("nombre").value;
    let ubicacion = document.getElementById("ubicacion").value;
    let limitePersonas = document.getElementById("limitePersonas").value;


    if (!nombre, !limitePersonas) {
        alert("Todos los campos son obligatorios");
        return;
    }

    let oficina = {nombre, ubicacion,limitePersonas};


    let id = localStorage.getItem("editIndex");

    if (id!==null) {
        try {
            const respuesta = await fetch(`http://127.0.0.1:8080/api/oficina/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify(oficina)
            });

            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

            localStorage.removeItem("editIndex");
            window.location.href = "indexOficina.html";

        } catch (error) {
            console.error('Error al cargar oficinas:', error);
            alert('No se pudieron obtener las oficinas.');
        }
    } else {
        try {
            const respuesta = await fetch('http://127.0.0.1:8080/api/oficina', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify(oficina)
            });

            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

            window.location.href = "indexOficina.html";

        } catch (error) {
            console.error('Error al guardar oficina:', error);
            alert('No se pudo guardar la oficina.');
        }
    }
}

/**
 * Inicializa validaciones personalizadas de Bootstrap para formularios.
 *
 * @function
 * @description
 * Este bloque de código:
 * - Activa las validaciones de Bootstrap en los formularios que tienen la clase `needs-validation`.
 * - Impide el envío de formularios que no cumplan con las validaciones requeridas.
 * - Añade la clase `was-validated` a los formularios para mostrar los estilos de validación personalizados de Bootstrap.
 *
 * @example
 * // Asegúrate de que los formularios incluyan la clase 'needs-validation' y
 * // utiliza atributos como 'required' en los campos para activar las validaciones.
 * <form class="needs-validation" novalidate>
 *   <input type="text" class="form-control" required />
 *   <button type="submit" class="btn btn-primary">Enviar</button>
 * </form>
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
 * Variable para almacenar el mapa de Google Maps.
 *
 * @type {google.maps.Map | null}
 */
let mapa;

/**
 * Bandera para controlar si el mapa ya fue cargado.
 *
 * @type {boolean}
 */
let mapaCargado = false;

/**
 * Inicializa un mapa de Google Maps en un elemento HTML específico y habilita la selección de ubicaciones.
 *
 * @function inicializarMapa
 * @param {number} [latInicial=9.971851666746058] - Latitud inicial para centrar el mapa. Por defecto, 9.971851666746058.
 * @param {number} [lngInicial=-84.26739519417619] - Longitud inicial para centrar el mapa. Por defecto, -84.26739519417619.
 *
 * @description
 * - Crea un mapa utilizando la API de Google Maps y lo centra en las coordenadas iniciales proporcionadas.
 * - Habilita un evento `click` en el mapa para capturar la latitud y longitud del punto seleccionado.
 * - Escribe las coordenadas seleccionadas en un elemento de entrada HTML con el ID `ubicacion`.
 * - Evita múltiples inicializaciones del mapa utilizando la variable `mapaCargado`.
 *
 * @example
 * // Llamar a la función para inicializar el mapa
 * inicializarMapa();
 *
 * @example
 * // Inicializar el mapa en otra ubicación
 * inicializarMapa(37.7749, -122.4194); // San Francisco, CA
 */

function inicializarMapa(latInicial = 9.971851666746058, lngInicial = -84.26739519417619) {
    if (!mapaCargado) {
        mapa = new google.maps.Map(document.getElementById("googleMap"), {
            center: { lat: latInicial, lng: lngInicial },
            zoom: 12
        });

        mapa.addListener("click", function (event) {
            let latitud = event.latLng.lat();
            let longitud = event.latLng.lng();
            document.getElementById("ubicacion").value = `${latitud}, ${longitud}`;
        });

        mapaCargado = true;
    }
}

/**
 * Configura el comportamiento inicial de la página al cargar el DOM.
 *
 * @function
 *
 * @description
 * - Detecta si el navegador soporta geolocalización.
 * - Si se obtiene la ubicación del usuario, inicializa el mapa centrado en las coordenadas obtenidas.
 * - Si no se puede obtener la ubicación, utiliza una ubicación predeterminada.
 * - Agrega funcionalidad al botón para mostrar u ocultar el contenedor del mapa dinámicamente.
 * - Modifica el texto y el icono del botón dependiendo del estado del contenedor.
 *
 * @listens DOMContentLoaded
 *
 * @example
 * // HTML esperado:
 * <div id="mapaContainer" style="display:none;">
 *   <div id="googleMap" style="height: 400px;"></div>
 * </div>
 * <button id="btnMostrarMapa">Mostrar mapa</button>
 *
 * @requires inicializarMapa
 */
document.addEventListener("DOMContentLoaded", function () {
    const mapaContainer = document.getElementById("mapaContainer");
    const boton = document.getElementById("btnMostrarMapa");
    if (!boton) return;  // Si no existe el botón, salimos para no dar error

    const icono = document.createElement("i");
    icono.className = "bi bi-eye me-2";
    boton.prepend(icono);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;

            document.getElementById("ubicacion").value = `${lat}, ${lng}`;

            inicializarMapa(lat, lng);
            mapaContainer.style.display = "block";
            boton.textContent = "Ocultar mapa";
            icono.className = "bi bi-eye-slash me-2";
        }, function (error) {
            console.warn("No se pudo obtener la ubicación, se usará la predeterminada.");
            inicializarMapa();
        });
    } else {
        console.warn("Geolocalización no soportada.");
        inicializarMapa();
    }

    boton.addEventListener("click", function () {
        if (mapaContainer.style.display === "none" || mapaContainer.style.display === "") {
            mapaContainer.style.display = "block";
            boton.textContent = "Ocultar mapa";
            icono.className = "bi bi-eye-slash me-2";
            boton.prepend(icono);
        } else {
            mapaContainer.style.display = "none";
            boton.textContent = "Mostrar mapa";
            icono.className = "bi bi-eye me-2";
            boton.prepend(icono);
        }
    });
});

/**
 * Realiza la búsqueda de oficinas filtradas por un atributo y valor específicos.
 * Si no se proporciona un valor de búsqueda, carga todas las oficinas disponibles.
 *
 * @async
 * @function buscarOficinasFiltrado
 *
 * @description
 * - Valida la sesión mediante el token almacenado en `localStorage`.
 * - Verifica que se seleccionen un atributo y un valor válidos para la búsqueda.
 * - Construye dinámicamente la URL para realizar la consulta al backend dependiendo del atributo seleccionado.
 * - Muestra los resultados en una tabla HTML o un mensaje de "sin resultados".
 * - Si el atributo es `id`, busca una única oficina; si no, realiza una búsqueda paginada o por coincidencia.
 *
 * @throws {Error} Si ocurre un problema en la consulta o en la conexión al servidor.
 *
 * @requires cargarOficinas
 * @requires editarOficina
 * @requires eliminarOficina
 *
 * @example
 * <!-- HTML necesario -->
 * <select id="atributoBusqueda">
 *   <option value="id">ID</option>
 *   <option value="nombre">Nombre</option>
 *   <option value="ubicacion">Ubicación</option>
 *   <option value="limitePersonas">Límite de Personas</option>
 *   <option value="personasActuales">Personas Actuales</option>
 * </select>
 * <input type="text" id="busqueda" placeholder="Valor de búsqueda">
 * <button onclick="buscarOficinasFiltrado()">Buscar</button>
 * <table>
 *   <tbody id="oficinas-list"></tbody>
 * </table>
 *
 * @example
 * // Uso
 * buscarOficinasFiltrado();
 */
async function buscarOficinasFiltrado() {
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
        await cargarOficinas(); // Si el valor está vacío, carga todos los datos
        return;
    }

    let urlBase = "http://127.0.0.1:8080/api/oficina";
    let url = "";

    switch (atributo) {
        case "id":
            url = `${urlBase}/id/${valor}`;
            break;
        case "nombre":
        case "ubicacion":
            url = `${urlBase}/${atributo}?${atributo}=${encodeURIComponent(valor)}`;
            break;
        case "limitePersonas":
        case "personasActuales":
            url = `${urlBase}/${atributo}?${atributo}=${encodeURIComponent(valor)}`;
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

        const tbody = document.getElementById("oficinas-list");
        tbody.innerHTML = "";

        if (!respuesta.ok) {
            if (atributo === "id" && respuesta.status === 404) {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No se encontraron oficinas con esos criterios.</td></tr>`;
                return;
            }
            alert(`Error en la búsqueda: HTTP ${respuesta.status}`);
            return;
        }

        const data = await respuesta.json();

        if (atributo === "id") {
            if (!data || !data.id) {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No se encontraron oficinas con esos criterios.</td></tr>`;
                return;
            }

            const oficina = data;
            tbody.innerHTML = `<tr>
                <td>${oficina.id}</td>
                <td>${oficina.nombre}</td>
                <td>${oficina.ubicacion}</td>
                <td>${oficina.limitePersonas}</td>
                <td>${oficina.personasActuales}</td>
                <td>
                    <button onclick="editarOficina(${oficina.id})" class="btn btn-warning">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button onclick="eliminarOficina(${oficina.id})" class="btn btn-danger">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>`;
            return;
        }

        const oficinas = data.content || data;

        if (!Array.isArray(oficinas) || oficinas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No se encontraron oficinas con esos criterios.</td></tr>`;
            return;
        }

        oficinas.forEach(oficina => {
            let fila = `<tr>
                <td>${oficina.id}</td>
                <td>${oficina.nombre}</td>
                <td>${oficina.ubicacion}</td>
                <td>${oficina.limitePersonas}</td>
                <td>${oficina.personasActuales}</td>
                <td>
                    <button onclick="editarOficina(${oficina.id})" class="btn btn-warning">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button onclick="eliminarOficina(${oficina.id})" class="btn btn-danger">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>`;
            tbody.innerHTML += fila;
        });

    } catch (error) {
        console.error("Error buscando oficinas:", error);
        alert("Error al realizar la búsqueda.");
    }
}


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

    if(userRole === "ROLE_REGISTRADOR"){
        alert("No tienes acceso a esta página");
        window.location.href = "indexRegistro.html";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("busqueda").addEventListener("input", () => {
        buscarOficinasFiltrado();
    });
});