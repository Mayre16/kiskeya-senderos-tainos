/** Saludos temporales neotaínos: tai + astro. Día = sol (guey), noche = luna (Karaya). */

export const HORA_SOL = 6;
export const HORA_LUNA = 18;

export function esDeSol(date = new Date()) {
  const hour = date.getHours();
  return hour >= HORA_SOL && hour < HORA_LUNA;
}

export function getSaludoHora(date = new Date()) {
  if (esDeSol(date)) {
    return {
      id: "taiguey",
      frase: "TaiGuey",
      es: "Buen sol. Buenos días.",
      astro: "sol",
      wordId: "taiguey",
    };
  }
  return {
    id: "taikaraye",
      frase: "TaiKarayá",
    es: "Buena luna. Buenas noches.",
    astro: "luna",
    wordId: "taikaraye",
  };
}

export function msHastaCambioSaludo(date = new Date()) {
  const next = new Date(date);
  next.setSeconds(0, 0);
  next.setMinutes(0);
  if (esDeSol(date)) next.setHours(HORA_LUNA);
  else if (date.getHours() < HORA_SOL) next.setHours(HORA_SOL);
  else {
    next.setDate(next.getDate() + 1);
    next.setHours(HORA_SOL);
  }
  return Math.max(1000, next.getTime() - date.getTime());
}

function solSvg(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="3.2" fill="#D4A04A"/>
    <path d="M8 1.4v1.8M8 12.8v1.8M1.4 8h1.8M12.8 8h1.8M3.2 3.2l1.3 1.3M11.5 11.5l1.3 1.3M12.8 3.2l-1.3 1.3M4.5 11.5l-1.3 1.3" stroke="#C45C26" stroke-width="1.4" stroke-linecap="round"/>
  </svg>`;
}

function lunaSvg(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M10.2 2.4a5.6 5.6 0 1 0 3.2 10 4.6 4.6 0 0 1-3.2-10z" fill="#2A6B7C"/>
  </svg>`;
}

export function astroSvg(astro, size = 16) {
  return astro === "luna" ? lunaSvg(size) : solSvg(size);
}

export function renderSaludoChip({ compact = false } = {}) {
  const saludo = getSaludoHora();
  const icon = astroSvg(saludo.astro, compact ? 14 : 18);
  const label = saludo.astro === "sol" ? "Saludo del sol" : "Saludo de la luna";
  return `
    <span class="inline-flex items-center gap-1.5 ${compact ? "text-[11px]" : "text-sm"} font-display font-semibold text-caoba" title="${label}: ${saludo.es}">
      ${icon}
      <span>${saludo.frase}</span>
      <span class="sr-only"> — ${saludo.es}</span>
    </span>
  `;
}
