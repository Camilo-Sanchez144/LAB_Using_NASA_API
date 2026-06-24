document.addEventListener("DOMContentLoaded", () => {
  if (window.FavoritosAPOD) {
    window.FavoritosAPOD.iniciar();
  }

  if (typeof window.cargarAPOD === "function") {
    window.cargarAPOD();
  }
});
