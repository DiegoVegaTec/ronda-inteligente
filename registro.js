// Archivo optimizado registro.js para el proyecto
import { getFirestore, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const db = getFirestore();

// Cargar historial de rondas desde Firestore
async function cargarRegistroDesdeFirebase() {
    const tabla = document.getElementById("tabla-registro")?.querySelector("tbody");
    if (!tabla) {
        console.error("No se encontró la tabla para cargar el historial.");
        return;
    }

    tabla.innerHTML = ""; // Limpiar la tabla

    try {
        const querySnapshot = await getDocs(collection(db, "rondas"));
        if (querySnapshot.empty) {
            const filaVacia = document.createElement("tr");
            filaVacia.innerHTML = `<td colspan="3">No hay rondas registradas.</td>`;
            tabla.appendChild(filaVacia);
            return;
        }

        querySnapshot.forEach((doc) => {
            const { fecha, hora, zona } = doc.data();
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${fecha}</td>
                <td>${hora}</td>
                <td>${zona}</td>
            `;
            tabla.appendChild(fila);
        });
    } catch (error) {
        console.error("Error cargando las rondas desde Firestore: ", error);
        alert("No se pudieron cargar las rondas. Intenta nuevamente más tarde.");
    }
}

// Exportar datos a CSV
function exportarExcel() {
    const tabla = document.getElementById("tabla-registro");
    if (!tabla) {
        console.error("No se encontró la tabla para exportar.");
        return;
    }

    const filas = tabla.querySelectorAll("tr");
    if (filas.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Fecha,Hora,Zona\n";

    filas.forEach((fila) => {
        const columnas = fila.querySelectorAll("td");
        const datos = Array.from(columnas).map((columna) => columna.textContent).join(",");
        if (datos) csvContent += datos + "\n";
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
document.addEventListener("DOMContentLoaded", () => {
    cargarRegistroDesdeFirebase();

    const exportarBtn = document.getElementById("exportar-excel");
    if (exportarBtn) {
        exportarBtn.addEventListener("click", exportarExcel);
    }
});
