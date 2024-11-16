// Proyecto de mejora tecnológica creado por DIEGO VEGA

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCncx8Xi1u1bBTmRcf8t6kLyb5eAuI3TVI",
  authDomain: "ronda-inteligente.firebaseapp.com",
  projectId: "ronda-inteligente",
  storageBucket: "ronda-inteligente.firebasestorage.app",
  messagingSenderId: "151154056379",
  appId: "1:151154056379:web:4d42783b837113c1e59d9e",
  measurementId: "G-HTBPR6DEX9"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para obtener parámetros de la URL
function obtenerParametro(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Función para mostrar fecha y hora actualizadas
function mostrarFechaHora() {
  const fecha = new Date();
  document.getElementById("fecha").textContent = fecha.toLocaleDateString();
  document.getElementById("hora").textContent = fecha.toLocaleTimeString();
}

// Función para contar visitas por zona
function contarVisitas() {
  const seccion = obtenerParametro("seccion");
  if (!seccion) return;

  const visitasKey = `visitas_${seccion}`;
  const visitas = Number(localStorage.getItem(visitasKey) || 0) + 1;
  localStorage.setItem(visitasKey, visitas);
  document.getElementById("visitas").textContent = visitas;
}

// Función para registrar una ronda
async function registrarRonda() {
  const seccion = obtenerParametro("seccion");
  if (!seccion) {
    console.error("No se pudo determinar la sección.");
    return;
  }

  const fechaHora = new Date();
  const registro = {
    zona: seccion,
    fecha: fechaHora.toLocaleDateString(),
    hora: fechaHora.toLocaleTimeString(),
  };

  try {
    await addDoc(collection(db, "rondas"), registro);
    console.log("Ronda registrada en Firestore.");

    const mensajeRonda = document.getElementById("mensaje-ronda");
    if (mensajeRonda) {
      mensajeRonda.textContent = `Ronda realizada en ${registro.zona} a las ${registro.hora} el ${registro.fecha}`;
      mensajeRonda.style.display = "block";
    }
  } catch (error) {
    console.error("Error registrando la ronda: ", error);
  }
}

// Función para cargar el historial de rondas
async function cargarHistorial() {
  const tabla = document.getElementById("tabla-registro")?.querySelector("tbody");
  if (!tabla) {
    console.error("No se encontró la tabla para cargar el historial.");
    return;
  }

  tabla.innerHTML = ""; // Limpiar la tabla

  try {
    const querySnapshot = await getDocs(collection(db, "rondas"));
    querySnapshot.forEach((doc) => {
      const { fecha, hora, zona } = doc.data();
      const fila = `
        <tr>
          <td>${fecha}</td>
          <td>${hora}</td>
          <td>${zona}</td>
        </tr>
      `;
      tabla.innerHTML += fila;
    });
  } catch (error) {
    console.error("Error cargando el historial: ", error);
  }
}

// Función para inicializar la página
function inicializarPagina() {
  const seccion = obtenerParametro("seccion");
  if (seccion) {
    const zonaNombre = document.getElementById("zona-nombre");
    if (zonaNombre) zonaNombre.textContent = `Zona: ${seccion}`;
  }

  mostrarFechaHora();
  contarVisitas();
}

// Inicializar funciones específicas por página
if (window.location.pathname.includes("zona.html")) {
  window.onload = inicializarPagina;
  const registrarBtn = document.getElementById("registrar-btn");
  if (registrarBtn) registrarBtn.addEventListener("click", registrarRonda);
}

if (window.location.pathname.includes("registro.html")) {
  window.onload = cargarHistorial;
}