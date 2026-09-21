import senderosData from "../data/senderos.json";
import { glossary } from "../data/lexico.js";
import aplicaciones from "../data/aplicaciones.json";
import { getState, isLessonUnlockedIn, isSenderoUnlocked } from "../app/store.js";
import { featuredSvg, iconSvg } from "../components/svg/index.js";
import { byId, escapeHtml, getSendero, trailProgress } from "../app/helpers.js";

export function renderSendero(route) {
  const trail = getSendero(senderosData.senderos, route.id);
  if (!trail) {
    return `<section class="mx-auto max-w-lg px-4 py-16 text-center"><p>Ese sendero no existe.</p><a href="/" data-link class="btn-primary mt-4">Volver</a></section>`;
  }

  const state = getState();
  const unlockedTrail = isSenderoUnlocked(trail.id, senderosData.senderos);
  if (!unlockedTrail) {
    return `<section class="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 class="font-display text-2xl">Aún cerrado</h1>
      <p class="mt-2 text-sm text-caoba-clara">Completa el sendero anterior para abrir este camino.</p>
      <a href="/" data-link class="btn-primary mt-6">Volver al mapa</a>
    </section>`;
  }

  const { count, total } = trailProgress(trail, state.leccionesHechas);
  const complete = count === total;
  const heroAsset = trail.icono === "manati" || trail.icono === "ceiba" ? trail.icono : trail.icono;

  const lessons = trail.lecciones
    .map((lesson, index) => {
      const open = isLessonUnlockedIn(trail, index, senderosData.senderos);
      const done = state.leccionesHechas.includes(lesson.id);
      const firstWord = byId(glossary, lesson.palabras[0]);
      const asset = firstWord?.asset_visual || "tau";

      return `
        <${open ? `a href="/practica/${trail.id}/${index + 1}" data-link` : "div"}
          class="card-stone flex items-center gap-4 p-4 ${open ? "hover:-translate-y-0.5 transition" : "opacity-55"}"
        >
          <div class="grid h-14 w-14 place-items-center rounded-full ${done ? "bg-palma/15" : "bg-arena-2"}">
            ${iconSvg(asset, 44)}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-cenote">Nodo ${index + 1}</p>
            <h2 class="font-display text-lg font-semibold">${escapeHtml(lesson.titulo)}</h2>
            <p class="text-xs text-caoba-clara">${lesson.palabras.length === 1 ? "1 palabra" : `${lesson.palabras.length} palabras`} · ${(aplicaciones[lesson.id] || []).map((a) => a.titulo).join(" · ") || "escribir y usar"}</p>
          </div>
          <span class="text-xs font-semibold ${done ? "text-palma" : "text-caoba-clara"}">${done ? "Hecho" : open ? "Entrar" : "Cerrado"}</span>
        </${open ? "a" : "div"}>
      `;
    })
    .join("");

  return `
    <section class="mx-auto max-w-lg px-4 pb-16 pt-6">
      <div class="card-stone mb-6 p-5">
        <div class="mb-3 grid place-items-center">${featuredSvg(heroAsset, { size: 160, stage: 4 })}</div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracota">Sendero ${trail.id}</p>
        <h1 class="font-display text-3xl font-semibold text-caoba">${escapeHtml(trail.titulo)}</h1>
        <p class="mt-3 text-sm leading-relaxed text-caoba-clara">${escapeHtml(trail.intro)}</p>
        <p class="mt-3 text-xs font-medium text-palma">${count} / ${total} lecciones</p>
      </div>
      <div class="space-y-3">${lessons}</div>
      ${
        complete
          ? `<a href="/pausa/${trail.id}" data-link class="btn-primary mt-6 w-full">Pausa de silencio y presencia</a>`
          : ""
      }
    </section>
  `;
}
