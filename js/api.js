const URL_BASE = `https://api.nasa.gov/planetary/apod?api_key=iGLfI4rlDiv5ag7nuy9waYv3P99T8kAoJeleFF6K`;

async function cargarAPOD(fecha = "") {
    try {

        let urlFinal = URL_BASE;
        if (fecha !== "") {
            urlFinal = URL_BASE + "&date=" + fecha;
        }

        const respuesta = await fetch(urlFinal);

        if (!respuesta.ok) {
            throw new Error("Error al obtener los datos");
        }

        const data = await respuesta.json();

        console.log(data)
        console.log(data.title);
        console.log(data.date);
        console.log(data.explanation);
        console.log(data.url);
        
    } catch (error) {
        console.error(error);
        alert("No fue posible cargar la información.");
    }
}

cargarAPOD();