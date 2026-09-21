export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export const FUENTE_LABEL = {
  atestiguado: "crónica",
  comparativo: "lenguas hermanas",
  neotaino: "voz viva",
};

export const FUENTE_CLASS = {
  atestiguado: "bg-cenote/10 text-cenote",
  comparativo: "bg-palma/10 text-palma",
  neotaino: "bg-terracota/10 text-terracota-oscura",
};

export function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getSendero(senderos, id) {
  return senderos.find((s) => s.id === Number(id)) || null;
}

export function getLeccion(sendero, n) {
  return sendero?.lecciones[Number(n) - 1] || null;
}

export function byId(glossary, id) {
  return glossary.find((w) => w.id === id);
}

export function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function samePhrase(a, b) {
  return normalizeText(a) === normalizeText(b);
}

export function sameWord(a, b) {
  return normalizeText(a).replaceAll(" ", "") === normalizeText(b).replaceAll(" ", "");
}

export function matchesPatron(value, patron) {
  if (!patron) return false;
  return new RegExp(patron).test(normalizeText(value));
}

/** Orden de crónica: (Tau,) Nombre daka (, guáka boití) */
export function parsePresentacion(value) {
  const tokens = normalizeText(value).split(" ").filter(Boolean);
  let i = 0;
  if (tokens[i] === "tau") i += 1;
  const dakaAt = tokens.indexOf("daka", i);
  if (dakaAt < i + 1) return null;
  const nombre = tokens.slice(i, dakaAt).join(" ");
  if (nombre.replace(/\s+/g, "").length < 2) return null;
  const rest = tokens.slice(dakaAt + 1);
  const cierreOk =
    rest.length === 0 || (rest.length === 2 && rest[0] === "guaka" && rest[1] === "boiti");
  if (!cierreOk) return null;
  return { nombre, conGuakaBoiti: rest.length === 2 };
}

export function shortGlosa(word) {
  const raw = String(word?.traduccion_es || "");
  return raw.split(";")[0].trim() || raw;
}

export function chunk(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

export function trailProgress(sendero, done) {
  const total = sendero.lecciones.length;
  const count = sendero.lecciones.filter((l) => done.includes(l.id)).length;
  return { count, total, ratio: total ? count / total : 0 };
}
