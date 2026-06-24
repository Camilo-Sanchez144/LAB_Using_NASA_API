const seleccionFecha = document.getElementById('seleccion-fecha');

// Bloqueo
const hoy = new Date().toISOString().split('T')[0];
seleccionFecha.max = hoy;


seleccionFecha.addEventListener('change', function() {
    const fechaSeleccionada = seleccionFecha.value;
    if (fechaSeleccionada) {
        cargarAPOD(fechaSeleccionada); 
    }
});