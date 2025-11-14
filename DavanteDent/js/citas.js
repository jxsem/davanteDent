// citas.js

class Cita {
    constructor({ id = null, fecha, hora, nombre, apellidos, dni, telefono, nacimiento, observaciones }) {
        this.id = id || Date.now();
        this.fecha = fecha;
        this.hora = hora;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.dni = dni;
        this.telefono = telefono;
        this.nacimiento = nacimiento;
        this.observaciones = observaciones;
    }
}

// Operaciones sobre el array de citas (trabajan con cookies mediante storage.js)
function obtenerTodasLasCitas() {
    return cargarCitasDesdeCookies();
}

function guardarTodasLasCitas(citas) {
    guardarCitasEnCookies(citas);
}

function anadirCita(citaData) {
    const citas = obtenerTodasLasCitas();
    const nueva = new Cita(citaData);
    citas.push(nueva);
    guardarTodasLasCitas(citas);
    return nueva;
}

function actualizarCita(id, nuevosDatos) {
    const citas = obtenerTodasLasCitas();
    const idx = citas.findIndex(c => c.id === id || String(c.id) === String(id));
    if (idx === -1) return null;
    // mantener id
    nuevosDatos.id = citas[idx].id;
    citas[idx] = Object.assign({}, citas[idx], nuevosDatos);
    guardarTodasLasCitas(citas);
    return citas[idx];
}

function eliminarCitaPorId(id) {
    let citas = obtenerTodasLasCitas();
    citas = citas.filter(c => !(c.id === id || String(c.id) === String(id)));
    guardarTodasLasCitas(citas);
    return citas;
}

function buscarCitaPorId(id) {
    const citas = obtenerTodasLasCitas();
    return citas.find(c => c.id === id || String(c.id) === String(id)) || null;
}
