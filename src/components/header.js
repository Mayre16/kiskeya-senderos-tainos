import { getState } from "../app/store.js";
import { ceibaSvg } from "./svg/index.js";
import { ceibaStage } from "../app/store.js";
import { renderSaludoChip } from "../app/saludo-hora.js";

export function renderHeader(route) {
  const s = getState();
  const stage = ceibaStage();
  const home = route.name === "home";

  return `
    <header class="sticky top-0 z-20 border-b border-arena-3/70 bg-arena/90 backdrop-blur-md">
      <div class="mx-auto flex max-w-lg items-center justify-between gap-2 px-4 py-3">
        <a href="/" data-link class="flex min-h-11 items-center gap-2 rounded-full pr-2">
          <span class="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-arena-2">${ceibaSvg({ size: 40, stage })}</span>
          <span class="leading-tight">
            <span class="block font-display text-lg font-semibold text-caoba">Kiskeya</span>
            ${renderSaludoChip({ compact: true })}
            <span class="sr-only">${home ? "Senderos de Conexión" : "Volver al mapa"}</span>
          </span>
        </a>
        <div class="flex items-center gap-1.5">
          <a href="/ceiba" data-link class="btn-ghost gap-1.5 px-2.5 text-xs" title="Gotas de lluvia">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2c3 4 5 6.2 5 8.2A5 5 0 1 1 3 10.2C3 8.2 5 6 8 2z" fill="#2A6B7C"/></svg>
            <span class="tabular-nums">${s.gotas}</span>
            <span class="sr-only">gotas de lluvia</span>
          </a>
          <p class="btn-ghost gap-1.5 px-2.5 text-xs" title="Racha diaria">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5c2 3 1.2 5-.4 6.2C9.6 7 12 8.6 12 11a4 4 0 1 1-7.4-2.1C6.2 7.2 6.4 5.2 8 1.5z" fill="#C45C26"/></svg>
            <span class="tabular-nums">${s.racha}</span>
            <span class="sr-only">días de racha</span>
          </p>
          <a href="/voces" data-link class="btn-ghost h-11 w-11 px-0" title="Voces y grabaciones" aria-label="Voces y grabaciones">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 2.5a2.4 2.4 0 0 0-2.4 2.4v4.2a2.4 2.4 0 1 0 4.8 0V4.9A2.4 2.4 0 0 0 9 2.5z" stroke="#4A2C1A" stroke-width="1.5"/><path d="M4.2 8.6a4.8 4.8 0 0 0 9.6 0M9 13.4v2.2" stroke="#4A2C1A" stroke-width="1.5" stroke-linecap="round"/></svg>
          </a>
          <button type="button" id="btn-sound" class="btn-ghost h-11 w-11 px-0" aria-pressed="${s.mute ? "false" : "true"}" aria-label="${s.mute ? "Activar brisa y voz" : "Silenciar brisa y voz"}" title="${s.mute ? "Activar sonido" : "Silenciar"}">
            ${
              s.mute
                ? `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 7.5h3l4-3v9l-4-3H3z" fill="#4A2C1A"/><path d="M12 6l4 6M16 6l-4 6" stroke="#C45C26" stroke-width="1.6" stroke-linecap="round"/></svg>`
                : `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 7.5h3l4-3v9l-4-3H3z" fill="#4A2C1A"/><path d="M12 6.5c1.2 1 1.8 2.2 1.8 3.5S13.2 12 12 13M14.2 5c1.8 1.6 2.6 3.4 2.6 5s-.8 3.4-2.6 5" stroke="#2A6B7C" stroke-width="1.5" stroke-linecap="round"/></svg>`
            }
          </button>
        </div>
      </div>
    </header>
  `;
}
