async function cargarRegistros() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        alert("No has iniciado sesión. Redirigiendo al login...");
        window.location.href = "login.html";
        return;
    }

    try {
        const respuesta = await fetch('http://127.0.0.1:8080/api/registro', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        const registros = await respuesta.json();
        let tbody = document.getElementById("registros-list");
        tbody.innerHTML = ""; // Limpiar contenido previo

        if (registros.length === 0) {
            tbody.innerHTML = `<tr>
                <td colspan="4" class="text-white" style="background-color: #d895c6">No hay datos disponibles.</td>
            </tr>`;
            return;
        }

        registros.forEach((registro, index) => {
            let personaNombre = (registro.persona && registro.persona.nombre) ? registro.persona.nombre : "Desconocido";
            let fila = `<tr>
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
    } catch (error) {
        console.error('Error al cargar registros:', error);
        alert('No se pudieron obtener los registros.');
    }
}
/*
//Muestra los controles de paginación
function mostrarPaginacion(totalPaginas) {
    let paginacionDiv = document.getElementById("paginacion");
    paginacionDiv.innerHTML = "";

    //boton Anterior
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

    //muestra numeros de página
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

    //botón Siguiente
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


//edita el registro
function editarRegistro(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "formRegistro.html";
}

async function guardarRegistro(event) {
    event.preventDefault();

    const token = localStorage.getItem("jwtToken");
    if (!token) {
        alert("No has iniciado sesión. Redirigiendo al login...");
        window.location.href = "login.html";
        return;
    }

    const form = event.target;
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
//llama a cargarPersonas cuando cargue la página


//exporta los datos a excel
function exportarExcel(){
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    if(registros.length === 0){
        alert("No hay registros disponibles para exportar");
        return;
    }
    const encabezados = ["Persona", "Tipo de Registro", "Fecha y Hora"];

    const data = registros.map(registro => {
        let personaNombre = registro.persona ? registro.persona.nombre : "Desconocido";
        return [personaNombre, registro.tipoRegistro, registro.fechaHora];
    });


    const ws = XLSX.utils.json_to_sheet([encabezados, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "registros");

    XLSX.writeFile(wb, "registros.xlsx");
}

