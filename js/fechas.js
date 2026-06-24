(function () {
  const seleccionFecha = document.getElementById("seleccion-fecha");
  const botonBuscar = document.getElementById("btn-search");

  if (!seleccionFecha) {
    return;
  }

  const hoy = new Date().toISOString().split("T")[0];
  seleccionFecha.max = hoy;

  function buscarFechaActual() {
    const fechaSeleccionada = seleccionFecha.value;

    if (fechaSeleccionada > hoy) {
      alert("No puedes seleccionar una fecha futura.");
      seleccionFecha.value = hoy;
      return;
    }

    if (fechaSeleccionada && typeof window.cargarAPOD === "function") {
      window.cargarAPOD(fechaSeleccionada);
    }
  }

  seleccionFecha.addEventListener("change", buscarFechaActual);

  if (botonBuscar) {
    botonBuscar.addEventListener("click", () => {
      if (!seleccionFecha.value && typeof window.cargarAPOD === "function") {
        window.cargarAPOD();
        return;
      }

      buscarFechaActual();
    });
  }
})();
