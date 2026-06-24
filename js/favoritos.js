(function () {
  const STORAGE_KEY = "apodFavoritos";

  // Inicio: estado y utilidades del modulo de favoritos
  const estado = {
    apodActual: null,
    elementos: {}
  };

  function agruparFavoritos(favoritos, tamanoGrupo = 2) {
    const grupos = [];

    for (let indice = 0; indice < favoritos.length; indice += tamanoGrupo) {
      grupos.push(favoritos.slice(indice, indice + tamanoGrupo));
    }

    return grupos;
  }

  function obtenerResumen(texto) {
    if (!texto) {
      return "Imagen o video guardado en tu coleccion.";
    }

    return texto.length > 120 ? `${texto.slice(0, 117)}...` : texto;
  }

  function obtenerFavoritos() {
    const favoritosGuardados = localStorage.getItem(STORAGE_KEY);

    if (!favoritosGuardados) {
      return [];
    }

    try {
      const favoritos = JSON.parse(favoritosGuardados);
      return Array.isArray(favoritos) ? favoritos : [];
    } catch (error) {
      console.warn("No se pudieron leer los favoritos guardados.", error);
      return [];
    }
  }

  function guardarFavoritos(favoritos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
  }

  function normalizarAPOD(apod) {
    if (!apod || !apod.date) {
      return null;
    }

    return {
      title: apod.title || "APOD sin titulo",
      date: apod.date,
      explanation: apod.explanation || "",
      url: apod.url || "",
      hdurl: apod.hdurl || "",
      media_type: apod.media_type || "image",
      thumbnail_url: apod.thumbnail_url || ""
    };
  }

  function existeFavorito(fecha) {
    return obtenerFavoritos().some((favorito) => favorito.date === fecha);
  }
  // Fin: estado y utilidades del modulo de favoritos

  // Inicio: comportamiento del boton y visibilidad de la seccion
  function actualizarBoton() {
    const boton = estado.elementos.botonFavorito;
    const botonAgregar = estado.elementos.botonAgregar;
    const seccion = estado.elementos.seccionFavoritos;
    const yaGuardado = estado.apodActual ? existeFavorito(estado.apodActual.date) : false;

    if (!boton) {
      return;
    }

    const textoHeader = seccion && !seccion.hidden ? "Ver favoritos" : "Favoritos";
    boton.disabled = false;
    boton.setAttribute("aria-label", textoHeader);
    boton.setAttribute("title", textoHeader);

    if (botonAgregar) {
      if (!estado.apodActual) {
        botonAgregar.disabled = true;
        botonAgregar.classList.remove("is-saved");
        botonAgregar.setAttribute("aria-label", "Agregar a favoritos");
        botonAgregar.setAttribute("title", "Agregar a favoritos");
        return;
      }

      botonAgregar.disabled = yaGuardado;
      botonAgregar.classList.toggle("is-saved", yaGuardado);
      botonAgregar.setAttribute("aria-label", yaGuardado ? "Ya esta en favoritos" : "Agregar a favoritos");
      botonAgregar.setAttribute("title", yaGuardado ? "Ya esta en favoritos" : "Agregar a favoritos");
    }
  }

  function actualizarVisibilidadSeccion(totalFavoritos) {
    const seccion = estado.elementos.seccionFavoritos;
    const mensajeVacio = estado.elementos.mensajeVacio;
    const botonAnterior = estado.elementos.botonAnterior;
    const botonSiguiente = estado.elementos.botonSiguiente;
    const indicadores = estado.elementos.indicadores;

    if (seccion) {
      seccion.hidden = totalFavoritos === 0;
    }

    if (mensajeVacio) {
      mensajeVacio.hidden = totalFavoritos > 0;
    }

    const mostrarCarrusel = totalFavoritos > 2;

    if (botonAnterior) {
      botonAnterior.hidden = !mostrarCarrusel;
    }

    if (botonSiguiente) {
      botonSiguiente.hidden = !mostrarCarrusel;
    }

    if (indicadores) {
      indicadores.hidden = !mostrarCarrusel;
    }
  }

  function irASeccionFavoritos() {
    const seccion = estado.elementos.seccionFavoritos;

    if (seccion && !seccion.hidden) {
      seccion.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  // Fin: comportamiento del boton y visibilidad de la seccion

  // Inicio: renderizado del carrusel/lista de favoritos
  function renderizarFavoritos() {
    const lista = estado.elementos.listaFavoritos;
    const contador = estado.elementos.contador;
    const contadorBoton = estado.elementos.contadorBoton;
    const indicadores = estado.elementos.indicadores;

    if (!lista) {
      return;
    }

    const favoritos = obtenerFavoritos();
    lista.innerHTML = "";
    if (indicadores) {
      indicadores.innerHTML = "";
    }

    if (contador) {
      contador.textContent = favoritos.length;
    }

    if (contadorBoton) {
      contadorBoton.textContent = favoritos.length;
    }

    actualizarVisibilidadSeccion(favoritos.length);

    const grupos = agruparFavoritos(favoritos);

    grupos.forEach((grupo, indiceGrupo) => {
      const slide = document.createElement("div");
      slide.className = `carousel-item favorites-slide${indiceGrupo === 0 ? " active" : ""}`;

      const contenedor = document.createElement("div");
      contenedor.className = "favorites-slide__grid";

      grupo.forEach((favorito) => {
        const item = document.createElement("article");
        item.className = "favorite-item";

        const botonCargar = document.createElement("button");
        botonCargar.className = "favorite-load";
        botonCargar.type = "button";

        const titulo = document.createElement("strong");
        titulo.textContent = favorito.title;

        const fecha = document.createElement("span");
        fecha.textContent = favorito.date;

        const resumen = document.createElement("p");
        resumen.className = "favorite-summary";
        resumen.textContent = obtenerResumen(favorito.explanation);

        botonCargar.append(titulo, fecha);
        botonCargar.addEventListener("click", () => cargarFavorito(favorito));

        const botonEliminar = document.createElement("button");
        botonEliminar.className = "favorite-delete";
        botonEliminar.type = "button";
        botonEliminar.textContent = "X";
        botonEliminar.setAttribute("aria-label", `Eliminar ${favorito.title} de favoritos`);
        botonEliminar.addEventListener("click", () => eliminarFavorito(favorito.date));

        item.append(botonCargar, resumen, botonEliminar);
        contenedor.appendChild(item);
      });

      slide.appendChild(contenedor);
      lista.appendChild(slide);

      if (indicadores) {
        const indicador = document.createElement("button");
        indicador.type = "button";
        indicador.setAttribute("data-bs-target", "#favorites-carousel");
        indicador.setAttribute("data-bs-slide-to", indiceGrupo);
        indicador.setAttribute("aria-label", `Ir al grupo ${indiceGrupo + 1} de favoritos`);

        if (indiceGrupo === 0) {
          indicador.className = "active";
          indicador.setAttribute("aria-current", "true");
        }

        indicadores.appendChild(indicador);
      }
    });

    actualizarBoton();
  }
  // Fin: renderizado del carrusel/lista de favoritos

  // Inicio: acciones sobre favoritos
  function guardarActualEnFavoritos() {
    const apod = normalizarAPOD(estado.apodActual);

    if (!apod) {
      return;
    }

    const favoritos = obtenerFavoritos();
    const yaGuardado = favoritos.some((favorito) => favorito.date === apod.date);

    if (!yaGuardado) {
      favoritos.unshift(apod);
      guardarFavoritos(favoritos);
    }

    renderizarFavoritos();
  }

  function eliminarFavorito(fecha) {
    const favoritosActualizados = obtenerFavoritos().filter((favorito) => favorito.date !== fecha);
    guardarFavoritos(favoritosActualizados);
    renderizarFavoritos();
  }
  // Fin: acciones sobre favoritos

  // Inicio: integracion con la APOD actual y arranque del modulo
  function cargarFavorito(favorito) {
    setActual(favorito);

    const selectorFecha = document.getElementById("seleccion-fecha");
    if (selectorFecha && favorito.date) {
      selectorFecha.value = favorito.date;
    }

    document.dispatchEvent(new CustomEvent("favorito:seleccionado", {
      detail: favorito
    }));

    if (typeof window.mostrarAPOD === "function") {
      window.mostrarAPOD(favorito);
    }
  }

  function setActual(apod) {
    estado.apodActual = normalizarAPOD(apod);
    actualizarBoton();
  }

  function iniciarFavoritos() {
    estado.elementos = {
      botonFavorito: document.getElementById("btn-favoritos"),
      botonAgregar: document.getElementById("btn-agregar-favorito"),
      seccionFavoritos: document.getElementById("favorites-section"),
      listaFavoritos: document.getElementById("lista-favoritos"),
      indicadores: document.getElementById("favorites-indicators"),
      mensajeVacio: document.getElementById("favoritos-vacio"),
      contador: document.getElementById("favorites-count"),
      contadorBoton: document.getElementById("favorites-badge"),
      botonAnterior: document.getElementById("favorites-prev"),
      botonSiguiente: document.getElementById("favorites-next")
    };

    if (estado.elementos.botonFavorito) {
      estado.elementos.botonFavorito.addEventListener("click", irASeccionFavoritos);
    }

    if (estado.elementos.botonAgregar) {
      estado.elementos.botonAgregar.addEventListener("click", guardarActualEnFavoritos);
    }

    if (estado.elementos.botonAnterior && estado.elementos.listaFavoritos) {
      estado.elementos.botonAnterior.hidden = true;
    }

    if (estado.elementos.botonSiguiente && estado.elementos.listaFavoritos) {
      estado.elementos.botonSiguiente.hidden = true;
    }

    document.addEventListener("apod:cargado", (evento) => {
      setActual(evento.detail);
    });

    renderizarFavoritos();
  }

  window.FavoritosAPOD = {
    iniciar: iniciarFavoritos,
    setActual,
    guardarActual: guardarActualEnFavoritos,
    obtener: obtenerFavoritos,
    eliminar: eliminarFavorito,
    renderizar: renderizarFavoritos
  };
  // Fin: integracion con la APOD actual y arranque del modulo
})();
