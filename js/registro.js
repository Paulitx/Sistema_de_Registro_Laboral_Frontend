let paginaActual = 1;
const registrosPorPagina = 5;

function cargarRegistros() {
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    let tbody = document.getElementById("registros-list");
    let totalPaginas = Math.ceil(registros.length / registrosPorPagina);

    tbody.innerHTML = "";
    if (registros.length === 0) {
        tbody.innerHTML = `<tr>
            <td colspan="4" class="text-white" style="background-color: #d895c6">No hay datos disponibles.</td>
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

    if (localStorage.getItem("role") === "visor") {
        alert("No tienes permisos para eliminar.");
        return;  //si es visor, no hace nada
    }

    const confirmacion = confirm("¿Desea eliminar este registro?");
    if (confirmacion) {
        eliminarRegistro(index);
    }
    alert("Se ha concretado la eliminacion del registro.");
}

function eliminarRegistro(index) {
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];
    let personas = JSON.parse(localStorage.getItem("personas")) || [];

    let registro = registros[index];
    if(!registro){return;}
    //aumenta la capacidad en el limite de personas si se elimina explicitamente una entrada del registro
    let persona = personas.find(p => p.id == registro.persona.id);
    let oficina = oficinas.find(o => o.nombre === persona.oficina.nombre);
    //valida que si ya una persona se registró con una salida, no aumente al eliminar su entrada
    if (registro.tipoRegistro === "entrada" && oficina) {
        let verificarSalida = registros
            .some(r => r.persona.id == persona.id && r.tipoRegistro === "salida" && r.fechaHora >registro.fechaHora);
        if (!verificarSalida) {
            oficina.limitePersonas += 1;
        }
    }
    //reduce la capacidad en el limite de personas si se elimina explicitamente una salida del registro
    if (registro.tipoRegistro === "salida" && oficina) {
        let verificarEntrada = registros
            .some(r => r.persona.id == persona.id && r.tipoRegistro === "entrada" && r.fechaHora < registro.fechaHora);

        if (verificarEntrada) {
            oficina.limitePersonas -= 1;
        }
    }

    //elimina el registro
    registros.splice(index, 1);
    localStorage.setItem("registros", JSON.stringify(registros));
    localStorage.setItem("oficinas", JSON.stringify(oficinas));
    cargarRegistros();
}

function editarRegistro(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "formRegistro.html";
}

function guardarRegistro(event) {
    event.preventDefault();

    let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    let personas = JSON.parse(localStorage.getItem("personas")) || [];

    let tipoRegistro = document.getElementById("tipo").value;
    let fechaHora = document.getElementById("fechaHora").value;
    let personaId = document.getElementById("persona").value;

    if (!tipoRegistro || !fechaHora || !personaId) {
        alert("Todos los campos son obligatorios");
        return;
    }


    let persona = personas.find(p => p.id == personaId);  //busca la persona seleccionada
    let oficina = oficinas.find(o => o.nombre === persona.oficina.nombre);

    let registro = {
        persona: { id: persona.id, nombre: persona.nombre, oficina: persona.oficina},
        tipoRegistro,
        fechaHora
    };



    let index = localStorage.getItem("editIndex");

    let registrosPersona = registros.filter(r => r.persona.id == personaId);
    let ultimaEntrada = registrosPersona
        .filter(r=>r.tipoRegistro === "entrada")
        .sort((a,b) => new Date(b.fechaHora) - new Date(a.fechaHora))[0];

    //validacion  para que no se pueda registrar una salida a una hora menor de la hora de entrada, por ejemplo si se entró a las 3pm, no se puede salir a las 2pm del mismo dia
    if(tipoRegistro === "salida" && ultimaEntrada){
        let fechaEntrada = new Date(ultimaEntrada.fechaHora);
        let fechaSalida = new Date(fechaHora);
        if(fechaSalida < fechaEntrada){
            alert("La fecha y/u hora de salida no puede ser menor que la ultima hora de entrada");
            return;
        }
    }


    if (index !== null && index !== "null") {
        //Aqui se edita el registro
        let registroAnterior = registros[index];
        if(registroAnterior.tipoRegistro === "entrada" && tipoRegistro === "salida") {
            oficina.limitePersonas += 1;
        }
        if(registroAnterior.tipoRegistro === "salida" && tipoRegistro === "entrada"){
            if(oficina.limitePersonas > 0){
                oficina.limitePersonas -= 1;
            }else{
                alert("La oficina ya se encuentra llena.")
                return;
            }
        }
        registros[index] = registro;  //editar registro existente
        localStorage.removeItem("editIndex");
        alert("Se ha editado el registro correctamente");

    } else {
        //Aqui se crea un nuevo registro

        //validacion no se puede salir sin entrar
        if (tipoRegistro === "salida") {
            if (!ultimaEntrada) {
                alert("No se puede registrar una salida sin una entrada previa");
                return;
            }
            oficina.limitePersonas += 1;
        }

        if(tipoRegistro === "entrada"){
            if(oficina.limitePersonas > 0){
                oficina.limitePersonas -= 1;
            }else{
                alert("La oficina ya se encuentra llena.")
                return;
            }
        }
        registros.push(registro);  //Agregar nuevo registro
        alert("Se ha guardado el registro correctamente");
    }

    localStorage.setItem("registros", JSON.stringify(registros));
    localStorage.setItem("oficinas", JSON.stringify((oficinas)));
    window.location.href = "indexRegistro.html";

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
    personas
        .filter(persona => persona.estado === "activo")
        .forEach(persona => {
        let option = document.createElement("option");
        option.value = persona.id;
        option.textContent = persona.nombre;
        selectPersona.appendChild(option);
    });
}

// Llamar a cargarPersonas() cuando cargue la página
document.addEventListener("DOMContentLoaded", cargarPersonas);
document.addEventListener("DOMContentLoaded", cargarRegistros);



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

function exportarPDF(){
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    if(registros.length === 0){
        alert("No hay datos disponibles para exportar");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Lista de registros", 14, 20);

    const headers = ["Persona", "Tipo de Registro", "Fecha y Hora"];

    const data = registros.map(registro => {
        let personaNombre = registro.persona ? registro.persona.nombre : "Desconocido";
        return [personaNombre, registro.tipoRegistro, registro.fechaHora];
    });

    doc.autoTable({
        startY: 30,
        head: [headers],
        body: data,
        theme: 'striped',
        styles: {
            fontSize: 10,
            cellPadding: 3,
        },
        columnStyles: {
            0: { cellWidth: 40 }, //Persona
            1: { cellWidth: 40 }, //Tipo registro
            2: { cellWidth: 40 }, //fecha y hora

        },
    });
    doc.save("registros.pdf");
}