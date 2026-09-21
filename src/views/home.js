import senderosData from "../data/senderos.json";
import {
  ceibaStage,
  getState,
  isSenderoUnlocked,
} from "../app/store.js";
import { ceibaSvg, featuredSvg, iconSvg } from "../components/svg/index.js";
import { escapeHtml, trailProgress } from "../app/helpers.js";
import { astroSvg, getSaludoHora } from "../app/saludo-hora.js";

const ICONS = {
  1: "tau",
  2: "manati",
  3: "ceiba",
  4: "behique",
  5: "batey",
};

function saludoHoraHero() {
  const saludo = getSaludoHora();
  return `
    <p class="mb-4 inline-flex items-center gap-2 rounded-full border border-arena-3 bg-arena-2/80 px-4 py-2">
      ${astroSvg(saludo.astro, 22)}
      <span class="font-display text-xl font-semibold text-caoba">${escapeHtml(saludo.frase)}</span>
      <span class="text-xs text-caoba-clara">${escapeHtml(saludo.es)}</span>
    </p>
  `;
}

export function renderHome() {
  const state = getState();
  const stage = ceibaStage();
  const trails = senderosData.senderos;

  const nodes = trails
    .map((trail, index) => {
      const unlocked = isSenderoUnlocked(trail.id, trails);
      const { count, total } = trailProgress(trail, state.leccionesHechas);
      const done = count === total;
      const featured = trail.id === 2 ? "manati" : trail.id === 3 ? "ceiba" : null;

      return `
        <li class="relative">
          ${index < trails.length - 1 ? `<div class="absolute left-8 top-16 h-[calc(100%-1rem)] w-px bg-arena-3" aria-hidden="true"></div>` : ""}
          <${unlocked ? `a href="/sendero/${trail.id}" data-link` : "div"}
            class="card-stone relative flex gap-4 p-4 ${unlocked ? "transition hover:-translate-y-0.5" : "opacity-60"}"
            ${unlocked ? "" : `aria-disabled="true"`}
          >
            <div class="grid h-16 w-16 shrink-0 place-items-center rounded-full ${done ? "bg-palma text-arena" : unlocked ? "bg-arena-2" : "bg-arena-3"} ring-4 ring-arena">
              ${featured ? featuredSvg(featured, { size: 56, stage: 3 }) : iconSvg(ICONS[trail.id], 40)}
            </div>
            <div class="min-w-0">
              <p class="text-[11px] font-semibold uppercase tracking-wider text-terracota">Sendero ${trail.id}</p>
              <h2 class="font-display text-xl font-semibold text-caoba">${escapeHtml(trail.titulo)}</h2>
              <p class="text-sm text-caoba-clara">${escapeHtml(trail.subtitulo)}</p>
              <p class="mt-2 text-xs font-medium ${done ? "text-palma" : "text-caoba-clara"}">
                ${unlocked ? `${count} de ${total} lecciones` : "Se abre al completar el sendero anterior"}
              </p>
            </div>
          </${unlocked ? "a" : "div"}>
        </li>
      `;
    })
    .join("");

  return `
    <section class="glyph-bg mx-auto max-w-lg px-4 pb-16 pt-6">
      <div class="card-stone mb-8 overflow-hidden p-5 text-center">
        ${saludoHoraHero()}
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-terracota">Aprender es cuidar</p>
        <h1 class="mt-1 font-display text-3xl font-semibold text-caoba">La palabra como pacto</h1>
        <p class="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-caoba-clara">
          El taíno no solo nombra: establece un acuerdo de respeto con Kiskeya.
          Cada lección riega la Ceiba guardiana.
        </p>
        <div class="mx-auto mt-2 grid place-items-center">${ceibaSvg({ size: 200, stage })}</div>
        <p class="text-xs text-caoba-clara">${state.gotas} gotas · ${state.palabrasVistas.length} palabras encontradas</p>
      </div>
      <ol class="space-y-4">${nodes}</ol>
      <a href="/fuentes" data-link class="card-stone mt-6 block p-5">
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-cenote">Honestidad léxica</p>
        <h2 class="mt-1 font-display text-xl font-semibold text-caoba">Fuentes del taíno</h2>
        <p class="mt-2 text-sm leading-relaxed text-caoba-clara">
          No hay un diccionario colonial completo. Granberry y Vescelius (2004)
          reúnen el léxico académico más citado; Pané, Tejera y las crónicas
          sostienen las voces atestiguadas. El resto se marca como neotaíno.
        </p>
      </a>
    </section>
  `;
}
