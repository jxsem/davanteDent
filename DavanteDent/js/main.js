// main.js (actualizado para usar cookies, clase Cita, validaciones y edición)

document.addEventListener("DOMContentLoaded", () => {
    inicializarApp();
    activarBuscador();  // <-- Llamamos aquí tranquilamente
});


function inicializarApp() {
    const form = document.getElementById("formCita");
    const cuerpoTabla = document.getElementById("cuerpoTabla");
    const filaVacia = document.getElementById("filaVacia");
    const inputId = document.getElementById("citaId");

    renderizarCitasEnTabla();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // obtener datos del form (sin perder valores)
        const cita = {
            fecha: form.fecha.value,
            hora: form.hora.value,
            nombre: form.nombre.value.trim(),
            apellidos: form.apellidos.value.trim(),
            dni: form.dni.value.trim(),
            telefono: form.telefono.value.trim(),
            nacimiento: form.nacimiento.value,
            observaciones: form.observaciones.value.trim()
        };

        const errores = validarCitaData(cita);
        limpiarErrores(form);

        if (errores.length > 0) {
            aplicarErroresAlFormulario(form, errores);
            return;
        }

        // si hay id oculto => actualizar
        const idEditar = inputId.value;
        if (idEditar) {
            const actualizada = actualizarCita(Number(idEditar), cita);
            if (actualizada) {
                alert("✅ Cita actualizada correctamente");
                inputId.value = "";
            } else {
                alert("⚠️ No se encontró la cita para actualizar");
            }
        } else {
            // crear nueva
            anadirCita(cita);
            alert("✅ Cita guardada correctamente");
        }

        form.reset();
        renderizarCitasEnTabla();
    });
}

function renderizarCitasEnTabla() {
    const cuerpoTabla = document.getElementById("cuerpoTabla");
    if (!cuerpoTabla) return; // seguridad: si no existe la tabla, salir
    cuerpoTabla.innerHTML = ""; // limpiar tabla

    const citas = obtenerTodasLasCitas(); // función que retorna todas las citas
    const filaVacia = document.getElementById("filaVacia");

    if (citas.length === 0) {
        // si existe fila vacía, mostrarla; si no, crearla dinámicamente
        if (filaVacia) {
            filaVacia.style.display = "table-row";
            cuerpoTabla.appendChild(filaVacia);
        } else {
            const fila = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 10;
            td.textContent = "No hay citas registradas";
            fila.appendChild(td);
            cuerpoTabla.appendChild(fila);
        }
        return;
    }

    // ocultar fila vacía si existe
    if (filaVacia) filaVacia.style.display = "none";

    citas.forEach((cita, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${cita.fecha}</td>
            <td>${cita.hora}</td>
            <td>${escapeHtml(cita.nombre)}</td>
            <td>${escapeHtml(cita.apellidos)}</td>
            <td>${escapeHtml(cita.dni)}</td>
            <td>${escapeHtml(cita.telefono)}</td>
            <td>${cita.nacimiento}</td>
            <td>${escapeHtml(cita.observaciones)}</td>
            <td>
                <button class="btn-editar" data-id="${cita.id}">✏️</button>
                <button class="btn-eliminar" data-id="${cita.id}">🗑️</button>
            </td>
        `;

        // botón eliminar
        const btnEliminar = fila.querySelector(".btn-eliminar");
        if (btnEliminar) {
            btnEliminar.addEventListener("click", () => {
                if (confirm("¿Eliminar esta cita?")) {
                    eliminarCitaPorId(cita.id);
                    renderizarCitasEnTabla();
                }
            });
        }

        // botón editar
        const btnEditar = fila.querySelector(".btn-editar");
        if (btnEditar) {
            btnEditar.addEventListener("click", () => {
                cargarCitaEnFormulario(cita.id);
            });
        }

        cuerpoTabla.appendChild(fila);
    });
}

function cargarCitaEnFormulario(id) {
    const form = document.getElementById("formCita");
    const inputId = document.getElementById("citaId");
    const cita = buscarCitaPorId(id);
    if (!cita) {
        alert("No se encontró la cita");
        return;
    }

    // cargar desde cookie (no desde vista)
    form.fecha.value = cita.fecha || "";
    form.hora.value = cita.hora || "";
    form.nombre.value = cita.nombre || "";
    form.apellidos.value = cita.apellidos || "";
    form.dni.value = cita.dni || "";
    form.telefono.value = cita.telefono || "";
    form.nacimiento.value = cita.nacimiento || "";
    form.observaciones.value = cita.observaciones || "";
    inputId.value = cita.id; // campo oculto para identificar edición
    // desplazar foco a nombre
    form.nombre.focus();
}

function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ================================
// BUSCADOR DE CITAS
// ================================
function activarBuscador() {
    const input = document.getElementById("inputBuscar");
    if (!input) {
        console.warn("Buscador no encontrado");
        return;
    }

    input.addEventListener("input", function () {
        const texto = this.value.toLowerCase().trim();
        const filas = document.querySelectorAll("#cuerpoTabla tr");

        filas.forEach(fila => {
            if (fila.id === "filaVacia") return;

            const columnas = fila.querySelectorAll("td");
            const contenidoFila = Array.from(columnas).map(td =>
                td.textContent.toLowerCase()
            );

            const coincide = contenidoFila.some(col => col.includes(texto));
            fila.style.display = coincide ? "" : "none";
        });
    });
}


