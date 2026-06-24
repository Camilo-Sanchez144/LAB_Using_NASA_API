const API_KEY = "iGLfI4rlDiv5ag7nuy9waYv3P99T8kAoJeleFF6K";
const DEMO_KEY = "DEMO_KEY";
const URL_BASE = "https://api.nasa.gov/planetary/apod";

function construirURL(fecha = "", apiKey = API_KEY) {
  const parametros = new URLSearchParams({
    api_key: apiKey,
    thumbs: "true"
  });

  if (fecha !== "") {
    parametros.set("date", fecha);
  }

  return `${URL_BASE}?${parametros.toString()}`;
}

async function solicitarAPOD(fecha = "", apiKey = API_KEY) {
  const respuesta = await fetch(construirURL(fecha, apiKey));
  const contenido = await respuesta.text();

  let datos = null;

  try {
    datos = JSON.parse(contenido);
  } catch (error) {
    datos = null;
  }

  if (!respuesta.ok) {
    const mensaje = datos?.msg || datos?.error?.message || `Error HTTP ${respuesta.status}`;
    const detalle = new Error(mensaje);
    detalle.status = respuesta.status;
    throw detalle;
  }

  return datos;
}

async function cargarAPOD(fecha = "") {
  try {
    let data;

    try {
      data = await solicitarAPOD(fecha, API_KEY);
    } catch (error) {
      const debeIntentarDemoKey = error.status === 403 || error.status === 429;

      if (!debeIntentarDemoKey) {
        throw error;
      }

      data = await solicitarAPOD(fecha, DEMO_KEY);
    }

    if (typeof window.mostrarAPOD === "function") {
      window.mostrarAPOD(data);
    }

    document.dispatchEvent(new CustomEvent("apod:cargado", {
      detail: data
    }));

    return data;
  } catch (error) {
    console.error(error);

    if (typeof window.mostrarErrorAPOD === "function") {
      window.mostrarErrorAPOD(error.message || "No fue posible cargar la informacion.", fecha);
    }

    alert(`No fue posible cargar la informacion. ${error.message || ""}`.trim());
    return null;
  }
}

window.cargarAPOD = cargarAPOD;
