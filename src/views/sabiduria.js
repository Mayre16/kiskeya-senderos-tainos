import senderosData from "../data/senderos.json";
import { glossary } from "../data/lexico.js";
import { getState, markReflexion } from "../app/store.js";
import { rosaSvg, ceibaSvg } from "../components/svg/index.js";
import { ceibaStage } from "../app/store.js";
import { byId, escapeHtml, getLeccion, getSendero } from "../app/helpers.js";

export function renderSabiduria(route) {
  const trail = getSendero(senderosData.senderos, route.senderoId);
  const lesson = getLeccion(trail, route.leccionN);
  if (!trail || !lesson) {
    return `<section class="mx-auto max-w-lg px-4 py-16 text-center"><a href="/" data-link class="btn-primary">Volver</a></section>`;
  }

  const word = byId(glossary, lesson.palabras[lesson.palabras.length - 1]);
  const trailDone = trail.lecciones.every((l) => getState().leccionesHechas.includes(l.id));

  return `
    <section class="mx-auto max-w-lg px-4 pb-16 pt-6">
      <div class="card-stone p-6 text-center">
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-terracota">Píldora de sabiduría</p>
        <div class="mt-2 grid place-items-center">${rosaSvg({ size: 180, blooming: true })}</div>
        <h1 class="font-display text-2xl font-semibold text-caoba">${escapeHtml(word?.palabra_taino || lesson.titulo)}</h1>
        <blockquote class="mt-4 text-base leading-relaxed text-caoba-clara">
          “${escapeHtml(word?.pilula_sabiduria || trail.cierre)}”
        </blockquote>
        <div class="mt-6 grid place-items-center">${ceibaSvg({ size: 160, stage: ceibaStage() })}</div>
        <p class="text-xs text-palma">La Ceiba reverdece. Ganaste gotas de lluvia.</p>
      </div>
      <div class="mt-6 flex flex-col gap-3">
        ${
          trailDone
            ? `<a href="/pausa/${trail.id}" data-link class="btn-primary w-full">Pausa de silencio y presencia</a>`
            : `<a href="/sendero/${trail.id}" data-link class="btn-primary w-full">Seguir el sendero</a>`
        }
        <a href="/ceiba" data-link class="btn-ghost w-full">Mirar la Ceiba guardiana</a>
      </div>
    </section>
  `;
}

export function hydrateSabiduria(route) {
  const trail = getSendero(senderosData.senderos, route.senderoId);
  const lesson = getLeccion(trail, route.leccionN);
  if (lesson) markReflexion(lesson.id);
}
