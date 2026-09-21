import senderosData from "../data/senderos.json";
import { glossary } from "../data/lexico.js";
import { ceibaStage, getState } from "../app/store.js";
import { ceibaSvg } from "../components/svg/index.js";
import { escapeHtml, trailProgress } from "../app/helpers.js";

const STAGE_COPY = [
  "Semilla en la arena: el cuidado apenas empieza.",
  "Brote: las primeras palabras ya tocan tierra.",
  "Renuevo: el monte reconoce tu racha de atención.",
  "Joven ceiba: las raíces buscan agua y memoria.",
  "Dosel que se abre: hay sombra para otros seres.",
  "Ceiba guardiana: cielo y raíz se reconocen en ti.",
];

export function renderCeiba() {
  const state = getState();
  const stage = ceibaStage();
  const words = state.palabrasVistas
    .map((id) => glossary.find((w) => w.id === id))
    .filter(Boolean);

  const trails = senderosData.senderos
    .map((trail) => {
      const { count, total } = trailProgress(trail, state.leccionesHechas);
      return `<li class="flex justify-between gap-3 text-sm"><span>${escapeHtml(trail.titulo)}</span><span class="tabular-nums text-caoba-clara">${count}/${total}</span></li>`;
    })
    .join("");

  const chips = words.length
    ? words
        .map(
          (w) =>
            `<li class="rounded-full bg-arena-2 px-3 py-1 text-xs font-medium text-caoba">${escapeHtml(w.palabra_taino)}</li>`,
        )
        .join("")
    : `<li class="text-sm text-caoba-clara">Aún no has encontrado palabras. El primer sendero espera.</li>`;

  return `
    <section class="mx-auto max-w-lg px-4 pb-16 pt-6">
      <div class="card-stone p-6 text-center">
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-palma">Árbol guardián</p>
        <h1 class="mt-1 font-display text-3xl font-semibold">La Ceiba</h1>
        <div class="mt-2 grid place-items-center">${ceibaSvg({ size: 240, stage })}</div>
        <p class="text-sm leading-relaxed text-caoba-clara">${STAGE_COPY[stage]}</p>
        <dl class="mt-6 grid grid-cols-3 gap-2 text-center">
          <div class="rounded-2xl bg-arena-2 p-3">
            <dt class="text-[10px] uppercase tracking-wide text-caoba-clara">Gotas</dt>
            <dd class="font-display text-2xl">${state.gotas}</dd>
          </div>
          <div class="rounded-2xl bg-arena-2 p-3">
            <dt class="text-[10px] uppercase tracking-wide text-caoba-clara">Racha</dt>
            <dd class="font-display text-2xl">${state.racha}</dd>
          </div>
          <div class="rounded-2xl bg-arena-2 p-3">
            <dt class="text-[10px] uppercase tracking-wide text-caoba-clara">Palabras</dt>
            <dd class="font-display text-2xl">${words.length}</dd>
          </div>
        </dl>
      </div>
      <div class="card-stone mt-5 p-5">
        <h2 class="font-display text-lg font-semibold">Senderos</h2>
        <ul class="mt-3 space-y-2">${trails}</ul>
      </div>
      <div class="card-stone mt-5 p-5">
        <h2 class="font-display text-lg font-semibold">Palabras halladas</h2>
        <ul class="mt-3 flex flex-wrap gap-2">${chips}</ul>
      </div>
    </section>
  `;
}
