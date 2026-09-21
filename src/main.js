import "./styles/main.css";
import { parseRoute, start } from "./app/router.js";
import { getState, setAmbiente, setMute, touchStreak } from "./app/store.js";
import { isAmbientOn, startAmbient, stopAmbient, stopSpeech } from "./app/speech.js";
import { renderHeader } from "./components/header.js";
import { renderHome } from "./views/home.js";
import { renderSendero } from "./views/sendero.js";
import { hydratePractica, renderPractica, resetPractica } from "./views/practica.js";
import { hydrateSabiduria, renderSabiduria } from "./views/sabiduria.js";
import { hydratePausa, renderPausa } from "./views/pausa.js";
import { renderCeiba } from "./views/ceiba.js";
import { hydrateVoces, renderVoces } from "./views/voces.js";
import { renderFuentes } from "./views/fuentes.js";
import { msHastaCambioSaludo } from "./app/saludo-hora.js";

const root = document.getElementById("app");

function renderNotFound() {
  return `<section class="mx-auto max-w-lg px-4 py-16 text-center">
    <h1 class="font-display text-2xl">Este camino no está en el mapa</h1>
    <a href="/" data-link class="btn-primary mt-6">Volver a Kiskeya</a>
  </section>`;
}

function hydrateHeader() {
  const btn = root.querySelector("#btn-sound");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const current = getState();
    const nextMute = !current.mute;
    setMute(nextMute);
    if (nextMute) {
      stopSpeech();
      stopAmbient();
      setAmbiente(false);
    } else {
      setAmbiente(true);
      await startAmbient();
    }
    render(parseRoute());
  });
}

function render(route = parseRoute()) {
  touchStreak();
  if (route.name !== "practica") resetPractica();

  let body = "";
  switch (route.name) {
    case "home":
      body = renderHome();
      break;
    case "sendero":
      body = renderSendero(route);
      break;
    case "practica":
      body = renderPractica(route);
      break;
    case "sabiduria":
      body = renderSabiduria(route);
      break;
    case "pausa":
      body = renderPausa(route);
      break;
    case "ceiba":
      body = renderCeiba();
      break;
    case "voces":
      body = renderVoces();
      break;
    case "fuentes":
      body = renderFuentes();
      break;
    default:
      body = renderNotFound();
  }

  root.innerHTML = `${renderHeader(route)}<main id="main">${body}</main>`;
  hydrateHeader();

  if (route.name === "practica") hydratePractica(root);
  if (route.name === "sabiduria") hydrateSabiduria(route);
  if (route.name === "pausa") hydratePausa(route);
  if (route.name === "voces") hydrateVoces(root);

  window.scrollTo(0, 0);
}

let saludoTimer = 0;
function scheduleSaludoRefresh() {
  window.clearTimeout(saludoTimer);
  saludoTimer = window.setTimeout(() => {
    render(parseRoute());
    scheduleSaludoRefresh();
  }, msHastaCambioSaludo());
}

start(render);
render();
scheduleSaludoRefresh();

if (getState().ambienteOn && !getState().mute && !isAmbientOn()) {
  document.addEventListener(
    "pointerdown",
    () => {
      startAmbient();
    },
    { once: true },
  );
}

if (import.meta.env.PROD) {
  import("virtual:pwa-register")
    .then(({ registerSW }) => {
      registerSW({ immediate: true });
    })
    .catch(() => {});
}
