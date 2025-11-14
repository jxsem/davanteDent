// storage.js
// Helpers para guardar/leer/eliminar la lista de citas en cookies

const COOKIE_NAME = "citasDavanteDent";

function setCookie(name, value, days = 365) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split(";").map(c => c.trim());
    for (const c of cookies) {
        if (c.startsWith(name + "=")) {
            return decodeURIComponent(c.substring(name.length + 1));
        }
    }
    return null;
}

function deleteCookie(name) {
    // poner fecha pasada
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function guardarCitasEnCookies(citas) {
    try {
        setCookie(COOKIE_NAME, JSON.stringify(citas), 365);
    } catch (e) {
        console.error("Error guardando cookies:", e);
    }
}

function cargarCitasDesdeCookies() {
    const raw = getCookie(COOKIE_NAME);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch (e) {
        console.error("Error parseando cookie de citas:", e);
    }
    return [];
}


