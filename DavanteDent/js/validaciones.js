// validaciones.js

function validarCitaData(cita) {
    const errores = [];

    if (!cita.nombre || cita.nombre.trim().length === 0) {
        errores.push({ campo: "nombre", mensaje: "El nombre es obligatorio" });
    }
    if (!cita.apellidos || cita.apellidos.trim().length === 0) {
        errores.push({ campo: "apellidos", mensaje: "Los apellidos son obligatorios" });
    }
    if (!cita.dni || cita.dni.trim().length === 0) {
        errores.push({ campo: "dni", mensaje: "El DNI es obligatorio" });
    }
    // teléfono: exactamente 9 dígitos numéricos
    if (!/^[0-9]{9}$/.test(cita.telefono)) {
        errores.push({ campo: "telefono", mensaje: "Teléfono inválido (9 dígitos)" });
    }
    if (!cita.fecha) errores.push({ campo: "fecha", mensaje: "La fecha es obligatoria" });
    if (!cita.hora) errores.push({ campo: "hora", mensaje: "La hora es obligatoria" });

    return errores;
}

function aplicarErroresAlFormulario(form, errores) {
    // eliminar errores previos
    limpiarErrores(form);

    errores.forEach(err => {
        const campo = form[err.campo];
        if (campo) {
            campo.classList.add("error");
            const msg = document.createElement("div");
            msg.className = "mensaje-error";
            msg.textContent = err.mensaje;
            campo.insertAdjacentElement("afterend", msg);
        }
    });
}

function limpiarErrores(form) {
    form.querySelectorAll(".error").forEach(e => e.classList.remove("error"));
    form.querySelectorAll(".mensaje-error").forEach(e => e.remove());
}
