const btnContacto = document.getElementById("btnContacto");

const modalContacto = document.getElementById("modalContacto");

const cerrarModal = document.getElementById("cerrarModal");

const aceptarModal = document.getElementById("aceptarModal");

const anio = document.getElementById("anio");

btnContacto.addEventListener(
    "click", function () {modalContacto.classList.add("activo");}
    );

cerrarModal.addEventListener(
    "click", function () {modalContacto.classList.remove("activo");}
    );

aceptarModal.addEventListener(
    "click", function () {modalContacto.classList.remove("activo");}
     );

modalContacto.addEventListener(
    "click", function (evento) {
        if (evento.target === modalContacto) {
            modalContacto.classList.remove("activo");
        }
    }
    );

document.addEventListener(
    "keydown", function (evento) {
        if (evento.key === "Escape") {
            modalContacto.classList.remove("activo");
        }
    }
    );

const fechaActual = new Date();
anio.textContent = "\u00A9" + fechaActual.getFullYear() + " TechService";


//registro del service worker
if ("serviceWorker" in navigator){
    window.addEventListener("load",function(){
        .register("./service-worker.js")
        .then(function (registro) {
            console.log("Service worker registrado correctamente.",registro.scope);
        })
        .catch(function (error){
            console.error("Error al registar el service worker.",error);
        });
    });
}else{
    console.warn("Este navegador no admite service worker");
    
}

//Instalacion de la pwa
const btnInstalar = document.getElementById("btnInstalar");
const estadoInstalacion = document.getElementById("estadoInstalacion");
let eventoInstalacion = null;

window.addEventListener("beforeintallprompt", function(evento) {
    evento.preventDefault();
    eventoInstalacion = evento;

    if (btnInstalar){
        btnInstalar.hidden = false;
    }
});

if (btnInstalar) {
    btnInstalar.addEventListener("click", async function () {
        if(!eventoInstalacion){
            if (estadoInstalacion) {
                estadoInstalacion.textContent = "La instalación se gestiona desde las opciones del navegador"
                console.log("la instalacion procede desde las opciones del navegador")
            }
            return
        }
        eventoInstalacion.prompt()
        const RESULTADO = await eventoInstalacion.userChoice
        if(estadoInstalacion){
            estadoInstalacion.textContent = RESULTADO.outcome === "accepted"
            ? "Insatalación aceptada" : "Instalación cancelada"
        }
        eventoInstalacion = null
        btnInstalar.hidden = true
    })
}

window.addEventListener("appinstaleld", function(){
    if(estadoInstalacion){
        estadoInstalacion.textContent = "TechServices fue instalada correctamente."
    }

    if(btnInstalar){
        btnInstalar.hidden = true
    }
    
    eventoInstalacion = null
})

if(window.m matchMedia("(display-mode: standalone)").matches && btnInstalar){
    btnInstalar.hidden = trueñ
}