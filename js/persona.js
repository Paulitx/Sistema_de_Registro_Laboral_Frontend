function cargarPersonas() {
    let personas = JSON.parse(localStorage.getItem("personas")) || [];
    let tbody = document.getElementById("personas-list");
    tbody.innerHTML = "";
    if(personas.length === 0){
        tbody.innerHTML = `<tr>
        <td colspan="6" class="text-white" style="background-color: #d895c6">No hay datos disponibles.</td>
        </tr>`;
    }
    personas.forEach((persona, index) => {
        let fila = `<tr>
                    <td>${persona.id}</td>
                    <td>${persona.nombre}</td>
                    <td>${persona.email}</td>
                    <td>${persona.direccion}</td>
                    <td>${persona.fechaNacimiento}</td>
                    <td>
                        <button onclick="editarPersona(${index})" class="btn btn-editar"> 
                            <i class="bi bi-pencil-square"></i> Editar</button>
                        <button onclick="confirmarEliminacion(${index})" class="btn btn-eliminar"> 
                            <i class="bi bi-trash-fill"></i> Eliminar</button>
                    </td>
                </tr>`;
        tbody.innerHTML += fila;
    });
}

function confirmarEliminacion(index) {
    const confirmacion = confirm("¿Desea eliminar esta persona?");
    if (confirmacion) {
        eliminarPersona(index);
    }
}

function eliminarPersona(index) {
    let personas = JSON.parse(localStorage.getItem("personas")) || [];
    personas.splice(index, 1);
    localStorage.setItem("personas", JSON.stringify(personas));
    cargarPersonas();
}

function editarPersona(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "formPersona.html";
}

function guardarPersona(event) {
    event.preventDefault();

    let form = event.target;

    if(!form.checkValidity()){
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    let id = document.getElementById("id").value;
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let direccion = document.getElementById("direccion").value;
    let fechaNacimiento = document.getElementById("fechaNacimiento").value;

    if (!id || !nombre || !email || !direccion || !fechaNacimiento) {
        alert("Todos los campos son obligatorios");
        return;
    }
    else {
        let persona = { id, nombre, email, direccion, fechaNacimiento };
        let personas = JSON.parse(localStorage.getItem("personas")) || [];

        let index = localStorage.getItem("editIndex");
        if (index !== null) {
            personas[index] = persona;
        } else {
            personas.push(persona);
        }

        localStorage.setItem("personas", JSON.stringify(personas));
        window.location.href = "indexPersona.html";
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
