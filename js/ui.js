(function () {
  function obtenerURLVideoEmbebido(url) {
    if (!url) {
      return "";
    }

    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }

    return url;
  }

  function formatearFecha(fecha) {
    if (!fecha) {
      return "Fecha pendiente";
    }

    const fechaConvertida = new Date(`${fecha}T00:00:00`);

    return new Intl.DateTimeFormat("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(fechaConvertida);
  }

  function crearMediaAPOD(apod) {
    if (!apod) {
      return null;
    }

    if (apod.media_type === "video") {
      const iframe = document.createElement("iframe");
      iframe.src = obtenerURLVideoEmbebido(apod.url);
      iframe.title = apod.title || "Video APOD";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      return iframe;
    }

    const imagen = document.createElement("img");
    imagen.src = apod.url;
    imagen.alt = apod.title || "Imagen APOD";
    imagen.loading = "eager";
    return imagen;
  }

  function mostrarAPOD(apod) {
    const contenedorMedia = document.getElementById("apod-media");
    const titulo = document.getElementById("apod-title");
    const fecha = document.getElementById("apod-date-text");
    const explicacion = document.getElementById("apod-explanation");

    if (!contenedorMedia || !titulo || !fecha || !explicacion) {
      return;
    }

    contenedorMedia.innerHTML = "";

    const media = crearMediaAPOD(apod);

    if (media) {
      contenedorMedia.appendChild(media);
    } else {
      contenedorMedia.innerHTML = '<div class="image-placeholder"><span>No hay contenido disponible para esta APOD.</span></div>';
    }

    titulo.textContent = apod?.title || "Titulo de la imagen";
    fecha.textContent = formatearFecha(apod?.date);
    explicacion.textContent = apod?.explanation || "No hay descripcion disponible para esta APOD.";
  }

  function mostrarErrorAPOD(mensaje, fechaSolicitada = "") {
    const contenedorMedia = document.getElementById("apod-media");
    const titulo = document.getElementById("apod-title");
    const fecha = document.getElementById("apod-date-text");
    const explicacion = document.getElementById("apod-explanation");

    if (!contenedorMedia || !titulo || !fecha || !explicacion) {
      return;
    }

    contenedorMedia.innerHTML = '<div class="image-placeholder"><span>No se pudo cargar la APOD.</span></div>';
    titulo.textContent = "No fue posible cargar la APOD";
    fecha.textContent = formatearFecha(fechaSolicitada);
    explicacion.textContent = mensaje || "Intenta nuevamente en unos segundos.";
  }

  window.mostrarAPOD = mostrarAPOD;
  window.mostrarErrorAPOD = mostrarErrorAPOD;
})();
