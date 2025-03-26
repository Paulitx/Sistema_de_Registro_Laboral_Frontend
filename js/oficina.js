
function cargarOficinas() {
    let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];
    let tbody = document.getElementById("oficinas-list");
    tbody.innerHTML = "";
    if (oficinas.length === 0) {
        tbody.innerHTML = `<tr>
            <td colspan="3" class="text-white" style="background-color: #d895c6">No hay datos disponibles.</td>
        </tr>`;
    }

    oficinas.forEach((oficina, index) => {
        let fila = `<tr>
                    <td class="text-start"> ${oficina.nombre}</td>
                    <td class="text-start">${oficina.ubicacion}</td>
                    <td>
                        <button onclick="editarOficina(${index})" class="btn btn-editar"> 
                            <i class="bi bi-pencil-square"></i> Editar</button>
                        <button onclick="confirmarEliminacion(${index})" class="btn btn-eliminar"> 
                            <i class="bi bi-trash-fill"></i> Eliminar</button>
                    </td>
                </tr>`;
        tbody.innerHTML += fila;
    });
}

function confirmarEliminacion(index) {
    const confirmacion = confirm("¿Desea eliminar esta oficina?");
    if (confirmacion) {
        eliminarOficina(index);
    }
}

function eliminarOficina(index) {
    let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];
    oficinas.splice(index, 1);
    localStorage.setItem("oficinas", JSON.stringify(oficinas));
    cargarOficinas();
}

function editarOficina(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "formOficina.html";
}

function guardarOficina(event) {

    event.preventDefault();

    let form = event.target;

    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    let nombre = document.getElementById("nombre").value;
    let ubicacion = document.getElementById("ubicacion").value;

    if (!nombre || !ubicacion) {
        alert("Todos los campos son obligatorios");
        return;
    } else {
        let oficina = {nombre, ubicacion};
        let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];

        let index = localStorage.getItem("editIndex");
        if (index !== null) {
            oficinas[index] = oficina;
        } else {
            oficinas.push(oficina);
        }

        localStorage.setItem("oficinas", JSON.stringify(oficinas));
        window.location.href = "indexOficina.html";
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
