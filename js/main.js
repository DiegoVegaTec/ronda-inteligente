// main.js actualizado para trabajar con la estructura actual en Firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCncx8Xi1u1bBTmRcf8t6kLyb5eAuI3TVI",
  authDomain: "ronda-inteligente.firebaseapp.com",
  projectId: "ronda-inteligente",
  storageBucket: "ronda-inteligente.firebasestorage.app",
  messagingSenderId: "151154056379",
  appId: "1:151154056379:web:4d42783b837113c1e59d9e",
  measurementId: "G-HTBPR6DEX9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mostrar fecha y hora en la página
function mostrarFechaHora() {
  const fecha = new Date();
  document.getElementById("fecha").textContent = fecha.toLocaleDateString();
  document.getElementById("hora").textContent = fecha.toLocaleTimeString();
}

// Registrar la ronda en Firestore
async function registrarRonda() {
  const zona = obtenerParametro("seccion");
  const fechaHora = new Date();
  const registro = {
    zona,
    fecha: fechaHora.toLocaleDateString(),
    hora: fechaHora.toLocaleTimeString()
  };

  try {
    await addDoc(collection(db, "rondas"), registro);
    document.getElementById("mensaje-ronda").textContent = `Ronda registrada en ${zona} el ${registro.fecha} a las ${registro.hora}`;
    document.getElementById("mensaje-ronda").style.display = "block";
  } catch (error) {
    console.error("Error al registrar la ronda: ", error);
  }
}

// Cargar historial de rondas desde Firestore
async function cargarHistorial() {
  const tabla = document.getElementById("tabla-registro").querySelector("tbody");
  tabla.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "rondas"));
    querySnapshot.forEach(doc => {
      const { fecha, hora, zona } = doc.data();
      const fila = document.createElement("tr");
      fila.innerHTML = `<td>${fecha}</td><td>${hora}</td><td>${zona}</td>`;
      tabla.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar el historial: ", error);
  }
}

// Obtener parámetro de la URL
function obtenerParametro(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Inicializar página principal
function inicializarZona() {
  const zona = obtenerParametro("seccion");
  document.getElementById("zona-nombre").textContent = `Zona: ${zona}`;
  mostrarFechaHora();
}

// Llamadas según página
if (window.location.pathname.includes("zona.html")) {
  window.onload = () => {
    inicializarZona();
    document.getElementById("registrar-ronda").addEventListener("click", registrarRonda);
  };
} else if (window.location.pathname.includes("registro.html")) {
  window.onload = cargarHistorial;
}
