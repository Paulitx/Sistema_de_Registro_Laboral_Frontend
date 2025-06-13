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

function editarOficina(id) {
    localStorage.setItem("editIndex", id);
    window.location.href = "formOficina.html";
}

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

let mapa;
let mapaCargado = false;

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

