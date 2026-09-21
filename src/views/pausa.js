import senderosData from "../data/senderos.json";
import { getState, markReflexion } from "../app/store.js";
import { ceibaSvg, rosaSvg } from "../components/svg/index.js";
import { ceibaStage } from "../app/store.js";
import { escapeHtml, getSendero, trailProgress } from "../app/helpers.js";

export function renderPausa(route) {
  const trail = getSendero(senderosData.senderos, route.senderoId);
  if (!trail) {
    return `<section class="mx-auto max-w-lg px-4 py-16"><a href="/" data-link class="btn-primary">Volver</a></section>`;
  }
  const { count, total } = trailProgress(trail, getState().leccionesHechas);
  const ready = count === total;

  return `
    <section class="mx-auto max-w-lg px-4 pb-16 pt-10 text-center">
      <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-cenote">Pausa de silencio</p>
      <h1 class="mt-2 font-display text-3xl font-semibold text-caoba">${escapeHtml(trail.titulo)}</h1>
      <div class="mt-4 grid place-items-center">${rosaSvg({ size: 140, blooming: ready })}</div>
      <div class="card-stone mx-auto mt-4 max-w-md p-6">
        <p class="text-base leading-relaxed text-caoba">${escapeHtml(trail.cierre)}</p>
      </div>
      <div class="mt-4 grid place-items-center">${ceibaSvg({ size: 180, stage: ceibaStage() })}</div>
      <p class="mt-2 text-xs text-caoba-clara">Quédate un momento. No hay que ganar nada más aquí.</p>
      <div class="mt-8 flex flex-col gap-3">
        <a href="/" data-link class="btn-primary w-full">Regresar al mapa</a>
        <a href="/ceiba" data-link class="btn-ghost w-full">Ceiba guardiana</a>
      </div>
    </section>
  `;
}

export function hydratePausa(route) {
  markReflexion(`pausa-${route.senderoId}`);
}
