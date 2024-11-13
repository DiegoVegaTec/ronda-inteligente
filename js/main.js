// Proyecto de mejora tecnológica para YOUTOPIA creado por DIEGO VEGA

function obtenerParametro(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function mostrarFechaHora() {
  const fecha = new Date();
  document.getElementById("fecha").textContent = fecha.toLocaleDateString();
  document.getElementById("hora").textContent = fecha.toLocaleTimeString();
}

function contarVisitas() {
  const seccion = obtenerParametro("seccion");
  let visitas = localStorage.getItem(`visitas_${seccion}`) || 0;
  visitas++;
  localStorage.setItem(`visitas_${seccion}`, visitas);
  document.getElementById("visitas").textContent = visitas;
}

// Función para registrar la ronda
function registrarRonda() {
  const seccion = obtenerParametro("seccion");
  const fechaHora = new Date();
  const registro = {
    zona: seccion,
    fecha: fechaHora.toLocaleDateString(),
    hora: fechaHora.toLocaleTimeString(),
  };

  // Obtener el historial actual, agregar el nuevo registro y guardarlo
  const historial = JSON.parse(localStorage.getItem("historial_rondas")) || [];
  historial.push(registro);
  localStorage.setItem("historial_rondas", JSON.stringify(historial));

  // Mostrar mensaje de confirmación
  const mensajeRonda = document.getElementById("mensaje-ronda");
  mensajeRonda.textContent = `Ronda realizada en ${registro.zona} a las ${registro.hora} el ${registro.fecha}`;
  mensajeRonda.style.display = "block";
}

// Función para inicializar la página
function inicializarPagina() {
  const seccion = obtenerParametro("seccion");
  document.getElementById("zona-nombre").textContent = `Zona: ${seccion}`; // Muestra el nombre de la zona
  mostrarFechaHora();
  contarVisitas();
}

// Llamada a la función de inicialización
window.onload = inicializarPagina;