import { fuentes } from "../data/lexico.js";
import { escapeHtml } from "../app/helpers.js";

function sourceCard(item) {
  const meta = [item.autores, item.anio, item.editorial, item.lugar]
    .filter(Boolean)
    .join(" · ");
  const access = item.acceso
    ? item.acceso.startsWith("http")
      ? `<p class="mt-2 text-xs"><a class="text-cenote underline" href="${escapeHtml(item.acceso)}" target="_blank" rel="noopener noreferrer">Consultar ficha editorial</a></p>`
      : `<p class="mt-2 text-xs text-caoba-clara">${escapeHtml(item.acceso)}</p>`
    : "";
  const chapter = item.capitulo
    ? `<p class="mt-2 text-xs text-caoba-clara">${escapeHtml(item.capitulo)}</p>`
    : "";
  return `
    <article class="card-stone p-5">
      <h3 class="font-display text-xl font-semibold text-caoba">${escapeHtml(item.titulo)}</h3>
      <p class="mt-1 text-xs text-terracota">${escapeHtml(meta)}</p>
      ${chapter}
      <p class="mt-3 text-sm leading-relaxed text-caoba-clara">${escapeHtml(item.por_que)}</p>
      ${access}
    </article>
  `;
}

export function renderFuentes() {
  return `
    <section class="mx-auto max-w-lg px-4 pb-16 pt-6">
      <div class="card-stone mb-5 p-5">
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-cenote">Léxico y honestidad</p>
        <h1 class="mt-1 font-display text-3xl font-semibold">Fuentes del taíno</h1>
        <p class="mt-3 text-sm leading-relaxed text-caoba-clara">${escapeHtml(fuentes.aviso)}</p>
      </div>
      <h2 class="mb-3 font-display text-2xl font-semibold">Clásico (académico y crónicas)</h2>
      <div class="space-y-3">${fuentes.clasico.map(sourceCard).join("")}</div>
      <h2 class="mb-3 mt-8 font-display text-2xl font-semibold">Apoyo comparativo</h2>
      <div class="space-y-3">${fuentes.apoyo.map(sourceCard).join("")}</div>
      <h2 class="mb-3 mt-8 font-display text-2xl font-semibold">Revival (neotaíno)</h2>
      <div class="space-y-3">${fuentes.revival.map(sourceCard).join("")}</div>
      <p class="mt-8 text-center text-sm">
        <a href="/voces" data-link class="text-cenote underline">Oír y grabar el léxico</a>
      </p>
    </section>
  `;
}
