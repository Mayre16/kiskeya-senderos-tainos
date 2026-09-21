const KEY = "kiskeya-senderos-v1";

const defaultState = () => ({
  version: 1,
  racha: 0,
  lastVisit: null,
  gotas: 0,
  leccionesHechas: [],
  palabrasVistas: [],
  reflexionesLeidas: [],
  senderosCompletos: [],
  mute: true,
  ambienteOn: false,
  nombrePropio: "",
  voiceURI: "",
});

let state = load();
const listeners = new Set();

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function dayDiff(from, to) {
  const a = new Date(`${from}T12:00:00`);
  const b = new Date(`${to}T12:00:00`);
  return Math.round((b - a) / 86400000);
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((fn) => fn(state));
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function touchStreak() {
  const today = todayISO();
  if (state.lastVisit === today) return state;
  if (!state.lastVisit) {
    state = { ...state, lastVisit: today, racha: Math.max(1, state.racha) };
  } else {
    const diff = dayDiff(state.lastVisit, today);
    if (diff === 1) state = { ...state, lastVisit: today, racha: state.racha + 1 };
    else if (diff > 1) state = { ...state, lastVisit: today, racha: 1 };
    else state = { ...state, lastVisit: today };
  }
  persist();
  return state;
}

export function addGotas(n) {
  state = { ...state, gotas: state.gotas + n };
  persist();
  return state;
}

export function markPalabra(id) {
  if (state.palabrasVistas.includes(id)) return state;
  state = { ...state, palabrasVistas: [...state.palabrasVistas, id] };
  persist();
  return state;
}

export function completeLesson(lessonId, senderoId, lessonIdsOfTrail) {
  const leccionesHechas = state.leccionesHechas.includes(lessonId)
    ? state.leccionesHechas
    : [...state.leccionesHechas, lessonId];
  const trailDone = lessonIdsOfTrail.every((id) => leccionesHechas.includes(id));
  const senderosCompletos =
    trailDone && !state.senderosCompletos.includes(senderoId)
      ? [...state.senderosCompletos, senderoId]
      : state.senderosCompletos;
  state = { ...state, leccionesHechas, senderosCompletos };
  persist();
  return { state, trailDone };
}

export function markReflexion(id) {
  if (state.reflexionesLeidas.includes(id)) return state;
  state = { ...state, reflexionesLeidas: [...state.reflexionesLeidas, id] };
  persist();
  return state;
}

export function setMute(mute) {
  state = { ...state, mute };
  persist();
  return state;
}

export function setNombrePropio(nombrePropio) {
  const clean = String(nombrePropio || "").trim();
  if (!clean) return state;
  state = { ...state, nombrePropio: clean };
  persist();
  return state;
}

export function setVoiceURI(voiceURI) {
  state = { ...state, voiceURI: String(voiceURI || "") };
  persist();
  return state;
}

export function setAmbiente(ambienteOn) {
  state = { ...state, ambienteOn };
  persist();
  return state;
}

export function ceibaStage(doneCount = state.leccionesHechas.length) {
  if (doneCount <= 0) return 0;
  if (doneCount <= 3) return 1;
  if (doneCount <= 6) return 2;
  if (doneCount <= 9) return 3;
  if (doneCount <= 12) return 4;
  return 5;
}

export function isSenderoUnlocked(senderoId, senderos) {
  if (senderoId <= 1) return true;
  const prev = senderos.find((s) => s.id === senderoId - 1);
  if (!prev) return false;
  return prev.lecciones.every((l) => state.leccionesHechas.includes(l.id));
}

export function isLessonUnlockedIn(sendero, lessonIndex, allSenderos) {
  if (!isSenderoUnlocked(sendero.id, allSenderos)) return false;
  if (lessonIndex === 0) return true;
  const prev = sendero.lecciones[lessonIndex - 1];
  return Boolean(prev && state.leccionesHechas.includes(prev.id));
}
