// Obtener el historial de rondas del localStorage
function cargarRegistro() {
    const historial = JSON.parse(localStorage.getItem("historial_rondas")) || [];
    const tabla = document.getElementById("tabla-registro").querySelector("tbody");

    // Limpiar la tabla antes de agregar los datos
    tabla.innerHTML = "";

    // Agregar los registros a la tabla
    historial.forEach((ronda) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${ronda.fecha}</td>
            <td>${ronda.hora}</td>
            <td>${ronda.zona}</td>
        `;
        tabla.appendChild(fila);
    });
}

// Exportar la tabla a Excel
function exportarExcel() {
    const historial = JSON.parse(localStorage.getItem("historial_rondas")) || [];
    let csvContent = "data:text/csv;charset=utf-8,Fecha,Hora,Zona\n";

    historial.forEach((ronda) => {
        csvContent += `${ronda.fecha},${ronda.hora},${ronda.zona}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registro_rondas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Inicializar la página
window.onload = () => {
    cargarRegistro();
    document.getElementById("exportar-excel").addEventListener("click", exportarExcel);
};
