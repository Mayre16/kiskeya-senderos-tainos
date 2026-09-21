import senderosData from "../data/senderos.json";
import { glossary, usos } from "../data/lexico.js";
import aplicaciones from "../data/aplicaciones.json";
import {
  addGotas,
  completeLesson,
  getState,
  isLessonUnlockedIn,
  markPalabra,
  setNombrePropio,
} from "../app/store.js";
import { iconSvg } from "../components/svg/index.js";
import {
  byId,
  chunk,
  escapeHtml,
  FUENTE_CLASS,
  FUENTE_LABEL,
  getLeccion,
  getSendero,
  matchesPatron,
  normalizeText,
  parsePresentacion,
  samePhrase,
  shortGlosa,
  shuffle,
} from "../app/helpers.js";
import { playWord } from "../app/speech.js";
import { hasClip, isRecording, startRecording, stopRecording } from "../app/recordings.js";
import { navigate } from "../app/router.js";

let session = null;

const STEP_LABEL = {
  match: "Empareja",
  leer: "Lee la frase",
  write: "Escribe la frase",
  build: "Arma la frase",
  presentar: "Preséntate",
  aplicar: "Usar",
  escena: "En la vida",
};

function wordById(id) {
  return byId(glossary, id);
}

function leerOpciones(word, lessonWords) {
  const uso = usos[word.id];
  const correcta = uso?.es || word.traduccion_es;
  const pool = lessonWords
    .filter((item) => item.id !== word.id)
    .map((item) => usos[item.id]?.es || item.traduccion_es)
    .filter((text) => text && normalizeText(text) !== normalizeText(correcta));
  const extra = glossary
    .filter((item) => item.id !== word.id)
    .map((item) => usos[item.id]?.es || shortGlosa(item))
    .filter((text) => text && normalizeText(text) !== normalizeText(correcta));
  const distractores = shuffle([...new Set([...pool, ...extra])]).slice(0, 2);
  return shuffle([
    { texto: correcta, correcta: true, asset: word.asset_visual },
    ...distractores.map((texto, i) => ({
      texto,
      correcta: false,
      asset: lessonWords[i + 1]?.asset_visual || "tau",
    })),
  ]);
}

function buildSteps(words, lessonId) {
  const steps = [];
  for (const group of chunk(words, 5)) {
    steps.push({ type: "match", wordIds: group.map((word) => word.id) });
  }
  for (const word of words) {
    if (!usos[word.id]) continue;
    steps.push({ type: "leer", wordId: word.id });
    steps.push({ type: "build", wordId: word.id });
    steps.push({ type: "write", wordId: word.id });
  }
  for (const app of aplicaciones[lessonId] || []) {
    steps.push({ type: app.tipo, app });
  }
  return steps;
}

function prepareStep(step) {
  session.feedback = null;
  session.draft = "";
  session.picked = [];
  session.pickLeft = null;
  session.pickRight = null;
  session.mismatch = null;
  if (step.type === "match") {
    const pairs = step.wordIds.map((id) => {
      const word = wordById(id);
      return { id, taino: word.palabra_taino, es: shortGlosa(word), asset: word.asset_visual };
    });
    session.matchLeft = shuffle(pairs);
    session.matchRight = shuffle(pairs.map((pair) => ({ id: pair.id, es: pair.es, asset: pair.asset })));
    session.matched = [];
  }
  if (step.type === "leer") {
    session.options = leerOpciones(wordById(step.wordId), session.words);
  }
  if (step.type === "build") {
    const uso = usos[step.wordId];
    session.tiles = shuffle([...uso.tokens, ...uso.distractores]);
  }
  if (step.type === "escena") {
    session.options = shuffle(step.app.opciones);
  }
}

function startSession(trail, lesson) {
  const words = lesson.palabras.map((id) => wordById(id)).filter(Boolean);
  session = {
    key: lesson.id,
    trailId: trail.id,
    lessonN: trail.lecciones.indexOf(lesson) + 1,
    words,
    steps: buildSteps(words, lesson.id),
    index: 0,
    feedback: null,
    options: [],
    tiles: [],
    picked: [],
    draft: "",
  };
  prepareStep(session.steps[0]);
}

function currentStep() {
  return session?.steps[session.index];
}

function currentWord() {
  const step = currentStep();
  if (!step?.wordId) return null;
  return wordById(step.wordId);
}

function nextLabel() {
  return session.index < session.steps.length - 1 ? "Siguiente" : "Píldora de sabiduría";
}

function finishFeedback(ok, extra = {}) {
  const step = currentStep();
  const word = currentWord();
  if (word) markPalabra(word.id);
  if (ok) addGotas(step.type === "presentar" || step.type === "match" ? 2 : 1);
  session.feedback = { ok, ...extra };
  navigate(`/practica/${session.trailId}/${session.lessonN}`, { replace: true });
}

function matchButtonClass(side, id) {
  const matched = session.matched.includes(id);
  const picked = side === "left" ? session.pickLeft === id : session.pickRight === id;
  const bad = session.mismatch && (session.mismatch.left === id || session.mismatch.right === id);
  if (matched) return "border-palma bg-palma/10 text-palma";
  if (bad) return "border-terracota bg-terracota/10";
  if (picked) return "border-cenote bg-cenote/10";
  return "border-arena-3 bg-white/80 hover:border-cenote/50";
}

function renderMatch() {
  const left = session.matchLeft
    .map(
      (pair) => `
        <button type="button" data-match-left="${escapeHtml(pair.id)}" class="card-stone min-h-14 border-2 px-3 py-2 text-left font-display text-lg ${matchButtonClass("left", pair.id)}" ${session.feedback || session.matched.includes(pair.id) ? "disabled" : ""}>
          ${escapeHtml(pair.taino)}
        </button>`,
    )
    .join("");
  const right = session.matchRight
    .map(
      (pair) => `
        <button type="button" data-match-right="${escapeHtml(pair.id)}" class="card-stone flex min-h-14 items-center gap-2 border-2 px-3 py-2 text-left text-sm ${matchButtonClass("right", pair.id)}" ${session.feedback || session.matched.includes(pair.id) ? "disabled" : ""}>
          <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-arena-2">${iconSvg(pair.asset, 32)}</span>
          <span>${escapeHtml(pair.es)}</span>
        </button>`,
    )
    .join("");

  return `
    <article class="card-stone p-5">
      <p class="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-cenote">Empareja</p>
      <h1 class="mt-2 text-center font-display text-2xl font-semibold">Une cada voz con su significado</h1>
      <p class="mt-2 text-center text-sm text-caoba-clara">Toca una palabra taína y luego su glosa.</p>
    </article>
    <div class="mt-4 grid grid-cols-2 gap-3">
      <div class="grid gap-2 content-start">${left}</div>
      <div class="grid gap-2 content-start">${right}</div>
    </div>
  `;
}

function renderLeer(word) {
  const uso = usos[word.id];
  const frase = uso?.modelo || word.palabra_taino;
  const options = session.options
    .map((opt, i) => {
      let extra = "border-arena-3 bg-white/80 hover:border-cenote/50";
      if (session.feedback) {
        if (opt.correcta) extra = "border-palma bg-palma/10";
        else if (session.feedback.chosen === i && !opt.correcta) extra = "border-terracota bg-terracota/10";
        else extra = "border-arena-3 bg-white/50 opacity-70";
      }
      return `
        <button type="button" data-option="${i}" class="card-stone flex min-h-16 items-center gap-3 border-2 p-3 text-left ${extra}" ${session.feedback ? "disabled" : ""}>
          <span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-arena-2">${iconSvg(opt.asset, 48)}</span>
          <span class="text-sm font-medium leading-snug">${escapeHtml(opt.texto)}</span>
        </button>
      `;
    })
    .join("");

  return `
    <article class="card-stone ${session.feedback?.ok ? "feedback-ok border-2 border-palma" : session.feedback && !session.feedback.ok ? "border-2 border-terracota" : ""} p-5">
      <p class="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-terracota">Lee la frase</p>
      <p class="mt-2 text-center"><span class="source-pill ${FUENTE_CLASS[word.fuente_tipo]}">${FUENTE_LABEL[word.fuente_tipo]}</span></p>
      <h1 class="mt-3 text-center font-display text-4xl font-semibold tracking-wide text-caoba">${escapeHtml(frase)}</h1>
      ${normalizeText(frase) === normalizeText(word.palabra_taino) ? `<p class="mt-2 text-center text-sm text-cenote">${escapeHtml(word.fonetica_intuitiva)}</p>` : ""}
      <p id="voice-source" class="mt-2 text-center text-[11px] font-semibold uppercase tracking-wide text-caoba-clara">Voz en español</p>
      <div class="mt-3 flex justify-center gap-2">
        <button type="button" id="btn-speak" class="btn-primary">Oír la frase</button>
        <button type="button" id="btn-rec" class="btn-ghost">Grabar</button>
      </div>
    </article>
    <p class="mt-4 text-center text-sm text-caoba-clara">¿Qué dice?</p>
    <div class="mt-3 grid gap-3">${options}</div>
  `;
}

function renderWrite(word) {
  const uso = usos[word.id];
  return `
    <article class="card-stone ${session.feedback?.ok ? "feedback-ok border-2 border-palma" : session.feedback && !session.feedback.ok ? "border-2 border-terracota" : ""} p-5">
      <p class="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-terracota">Escribe la frase</p>
      <h1 class="mt-2 text-center font-display text-2xl font-semibold">${escapeHtml(uso?.es || word.traduccion_es)}</h1>
      <p class="mt-2 text-center text-sm text-caoba-clara">${uso?.tokens?.length > 1 ? "Escríbela en taíno, con todas las voces de la frase." : "Escríbela en taíno."}</p>
      <form id="form-write" class="mt-5 space-y-3">
        <label class="sr-only" for="input-write">Frase taína</label>
        <input id="input-write" class="field-write" name="respuesta" autocomplete="off" spellcheck="false" autocapitalize="words" inputmode="text" placeholder="Escríbela en taíno" value="${escapeHtml(session.draft)}" ${session.feedback ? "disabled" : ""} />
        ${session.feedback ? "" : `<button type="submit" class="btn-primary w-full">Comprobar</button>`}
      </form>
    </article>
  `;
}

function renderBuild(word) {
  const uso = usos[word.id];
  const picked = session.picked
    .map(
      (token, i) =>
        `<button type="button" data-unpick="${i}" class="tile-word bg-arena-2" ${session.feedback ? "disabled" : ""}>${escapeHtml(token)}</button>`,
    )
    .join("");
  const bank = session.tiles
    .map((token, i) => {
      const used = session.picked.filter((t) => t === token).length;
      const available = session.tiles.filter((t) => t === token).length;
      const disabled = session.feedback || used >= available;
      return `<button type="button" data-tile="${i}" class="tile-word" ${disabled ? "disabled" : ""}>${escapeHtml(token)}</button>`;
    })
    .join("");

  return `
    <article class="card-stone ${session.feedback?.ok ? "feedback-ok border-2 border-palma" : session.feedback && !session.feedback.ok ? "border-2 border-terracota" : ""} p-5">
      <p class="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-cenote">Arma la frase</p>
      <p class="mt-2 text-center text-sm text-caoba-clara">${escapeHtml(uso.es)}</p>
      <div class="mt-4 min-h-16 rounded-2xl border border-dashed border-arena-3 bg-arena/80 p-3">
        <div class="flex flex-wrap justify-center gap-2">${picked || `<span class="text-sm text-caoba-clara">Toca las palabras en orden</span>`}</div>
      </div>
      <div class="mt-4 flex flex-wrap justify-center gap-2">${bank}</div>
      ${session.feedback ? "" : `<button type="button" id="btn-check-build" class="btn-primary mt-5 w-full">Comprobar frase</button>`}
    </article>
  `;
}

function renderAplicar(app) {
  return `
    <article class="card-stone ${session.feedback?.ok ? "feedback-ok border-2 border-palma" : session.feedback && !session.feedback.ok ? "border-2 border-terracota" : ""} p-5">
      <p class="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-terracota">Aplicación práctica</p>
      <h1 class="mt-2 text-center font-display text-2xl font-semibold">${escapeHtml(app.titulo)}</h1>
      <p class="mt-3 text-sm leading-relaxed text-caoba">${escapeHtml(app.prompt)}</p>
      <p class="mt-1 text-center text-sm text-caoba-clara">${escapeHtml(app.es)}</p>
      ${
        session.feedback
          ? `<p class="mt-3 text-center font-display text-xl text-cenote">${escapeHtml(app.modelo)}</p>
             <p class="mt-1 text-center text-xs text-caoba-clara">${escapeHtml(app.ayuda)}</p>`
          : `<p class="mt-2 text-center text-xs text-caoba-clara">Arma la frase. El modelo aparece después.</p>`
      }
      <form id="form-aplicar" class="mt-5 space-y-3">
        <label class="sr-only" for="input-aplicar">Frase en taíno</label>
        <input id="input-aplicar" class="field-write" autocomplete="off" spellcheck="false" autocapitalize="words" placeholder="${escapeHtml(app.placeholder || "")}" value="${escapeHtml(session.draft)}" ${session.feedback ? "disabled" : ""} />
        ${session.feedback ? "" : `<button type="submit" class="btn-primary w-full">Usar la lengua</button>`}
      </form>
    </article>
  `;
}

function renderEscena(app) {
  const options = session.options
    .map((opt, i) => {
      let extra = "border-arena-3 bg-white/80 hover:border-cenote/50";
      if (session.feedback) {
        if (opt.correcta) extra = "border-palma bg-palma/10";
        else if (session.feedback.chosen === i && !opt.correcta) extra = "border-terracota bg-terracota/10";
        else extra = "border-arena-3 bg-white/50 opacity-70";
      }
      return `
        <button type="button" data-option="${i}" class="card-stone flex min-h-16 items-center gap-3 border-2 p-3 text-left ${extra}" ${session.feedback ? "disabled" : ""}>
          <span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-arena-2">${iconSvg(opt.asset, 48)}</span>
          <span class="font-display text-lg">${escapeHtml(opt.texto)}</span>
        </button>
      `;
    })
    .join("");

  return `
    <article class="card-stone p-5">
      <p class="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-cenote">En la vida</p>
      <h1 class="mt-2 text-center font-display text-2xl font-semibold">${escapeHtml(app.titulo)}</h1>
      <p class="mt-3 text-sm leading-relaxed text-caoba">${escapeHtml(app.prompt)}</p>
    </article>
    <div class="mt-5 grid gap-3">${options}</div>
  `;
}

function renderPresentar(persona) {
  const saved = getState().nombrePropio;
  const isYo = persona === "daka";
  const modelo = isYo ? "Tau, Maireni daka, guáka boití." : "Guacanagarí turi.";
  const title = isYo ? "Tau, tu nombre, daka" : "Su nombre, turi";
  const help = isYo
    ? "Como en las crónicas: el nombre va antes de daka. Ejemplo: Tau, Maireni daka, guáka boití."
    : "El nombre va antes de turi. Ejemplo: Guacanagarí turi.";
  const placeholder = isYo ? "Tau, Maireni daka, guáka boití" : "Guacanagarí turi";
  const preset = session.draft || (isYo && saved ? `Tau, ${saved} daka, guáka boití` : "");

  return `
    <article class="card-stone ${session.feedback?.ok ? "feedback-ok border-2 border-palma" : session.feedback && !session.feedback.ok ? "border-2 border-terracota" : ""} p-5">
      <p class="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ocre">Uso vivo</p>
      <h1 class="mt-2 text-center font-display text-2xl font-semibold">${escapeHtml(title)}</h1>
      <p class="mt-3 text-center font-display text-xl text-cenote">${escapeHtml(modelo)}</p>
      <p class="mt-2 text-center text-sm text-caoba-clara">${escapeHtml(help)}</p>
      <form id="form-presentar" class="mt-5 space-y-3">
        <label class="sr-only" for="input-presentar">Frase de presentación</label>
        <input id="input-presentar" class="field-write" autocomplete="off" spellcheck="false" autocapitalize="words" placeholder="${placeholder}" value="${escapeHtml(preset)}" ${session.feedback ? "disabled" : ""} />
        ${session.feedback ? "" : `<button type="submit" class="btn-primary w-full">Decirlo</button>`}
      </form>
    </article>
  `;
}

function renderFeedback(word) {
  if (!session.feedback) return "";
  const step = currentStep();
  const uso = word ? usos[word.id] : null;
  let detail = "";
  if (step.type === "match") {
    detail = session.feedback.ok
      ? "Cada voz encontró su significado. Ahora las usamos en frase."
      : "Vuelve a unir cada palabra con su glosa.";
  } else if (step.type === "leer") {
    detail = session.feedback.ok
      ? `Así se oye: ${uso?.modelo || word.palabra_taino} — ${uso?.es || word.traduccion_es}`
      : `La frase ${uso?.modelo || word.palabra_taino} dice: ${uso?.es || word.traduccion_es}`;
  } else if (step.type === "write") {
    detail = session.feedback.ok
      ? `Bien. Se dice ${uso?.modelo || word.palabra_taino}.`
      : `Se escribe ${uso?.modelo || word.palabra_taino}.`;
  } else if (step.type === "build") {
    detail = session.feedback.ok
      ? `Así se dice: ${uso.modelo}`
      : `El orden es: ${uso.modelo}`;
  } else if (step.type === "presentar") {
    detail = session.feedback.ok
      ? session.feedback.echo
      : step.persona === "daka"
        ? "El nombre va antes de daka. Ejemplo: Tau, Maireni daka, guáka boití."
        : "El nombre va antes de turi. Ejemplo: Guacanagarí turi.";
  } else if (step.type === "aplicar") {
    const app = step.app;
    detail = session.feedback.ok
      ? `${app.consciencia} Se dice: ${app.modelo}`
      : `Prueba así: ${app.modelo} — ${app.ayuda}`;
  } else if (step.type === "escena") {
    detail = session.feedback.ok
      ? step.app.consciencia
      : `${step.app.consciencia} La voz que cabe aquí es otra.`;
  }

  return `
    <div class="card-stone mt-4 p-4">
      <p class="text-sm leading-relaxed text-caoba">${escapeHtml(detail)}</p>
      ${word && step.type === "leer" ? `<p class="mt-2 text-[11px] text-caoba-clara">${escapeHtml(word.fuente_nota)}</p>` : ""}
      <button type="button" id="btn-next" class="btn-primary mt-4 w-full">${nextLabel()}</button>
    </div>
  `;
}

export function renderPractica(route) {
  const trail = getSendero(senderosData.senderos, route.senderoId);
  const lesson = getLeccion(trail, route.leccionN);
  if (!trail || !lesson) {
    return `<section class="mx-auto max-w-lg px-4 py-16 text-center"><p>Lección no encontrada.</p><a class="btn-primary mt-4" href="/" data-link>Volver</a></section>`;
  }

  if (!isLessonUnlockedIn(trail, route.leccionN - 1, senderosData.senderos)) {
    return `<section class="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 class="font-display text-2xl">Este nodo aún duerme</h1>
      <a class="btn-primary mt-6" href="/sendero/${trail.id}" data-link>Volver al sendero</a>
    </section>`;
  }

  if (!session || session.key !== lesson.id) startSession(trail, lesson);

  const step = currentStep();
  const word = currentWord();
  const total = session.steps.length;
  const n = session.index + 1;
  let body = "";
  if (step.type === "match") body = renderMatch();
  else if (step.type === "leer") body = renderLeer(word);
  else if (step.type === "write") body = renderWrite(word);
  else if (step.type === "build") body = renderBuild(word);
  else if (step.type === "presentar") body = renderPresentar(step.persona);
  else if (step.type === "aplicar") body = renderAplicar(step.app);
  else if (step.type === "escena") body = renderEscena(step.app);

  const live = session.feedback
    ? session.feedback.ok
      ? "Acierto."
      : "Aún no. Mira el modelo e inténtalo al seguir."
    : STEP_LABEL[step.type];

  return `
    <section class="mx-auto max-w-lg px-4 pb-20 pt-5">
      <div class="mb-4 flex items-center justify-between gap-3 text-xs text-caoba-clara">
        <a href="/sendero/${trail.id}" data-link class="btn-ghost px-3">Sendero</a>
        <p class="text-right">${escapeHtml(lesson.titulo)} · ${STEP_LABEL[step.type]} · ${n} / ${total}</p>
      </div>
      ${body}
      <p class="sr-only" aria-live="polite">${escapeHtml(live)}</p>
      ${renderFeedback(word)}
    </section>
  `;
}

function goNext() {
  if (session.index < session.steps.length - 1) {
    session.index += 1;
    prepareStep(session.steps[session.index]);
    navigate(`/practica/${session.trailId}/${session.lessonN}`, { replace: true });
    return;
  }
  const trail = getSendero(senderosData.senderos, session.trailId);
  const lessonIds = trail.lecciones.map((l) => l.id);
  const already = getState().leccionesHechas.includes(session.key);
  if (!already) addGotas(3);
  completeLesson(session.key, trail.id, lessonIds);
  const { lessonN, trailId } = session;
  session = null;
  navigate(`/sabiduria/${trailId}/${lessonN}`);
}

export function hydratePractica(root) {
  if (!session) return;
  const step = currentStep();
  const word = currentWord();

  const source = root.querySelector("#voice-source");
  if (word && source) {
    hasClip(word.id).then((own) => {
      source.textContent = own ? "Tu voz" : "Voz en español";
      source.classList.toggle("text-palma", own);
    });
  }

  root.querySelector("#btn-speak")?.addEventListener("click", async () => {
    const frase = step.type === "leer" ? usos[word.id]?.modelo || word.palabra_taino : word.palabra_taino;
    const result = await playWord(step.type === "leer" ? "" : word.id, frase);
    if (result.source === "ninguna") {
      const btn = root.querySelector("#btn-speak");
      if (btn) btn.textContent = word.fonetica_intuitiva;
    }
  });

  root.querySelector("#btn-rec")?.addEventListener("click", async () => {
    const btn = root.querySelector("#btn-rec");
    try {
      if (isRecording()) {
        await stopRecording(word.id);
        btn.textContent = "Grabar";
        if (source) {
          source.textContent = "Tu voz";
          source.classList.add("text-palma");
        }
        await playWord(word.id, word.palabra_taino);
        return;
      }
      await startRecording();
      btn.textContent = "Detener";
    } catch {
      btn.textContent = "Sin micrófono";
    }
  });

  root.querySelectorAll("[data-option]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (session.feedback) return;
      const chosen = Number(btn.dataset.option);
      const opt = session.options[chosen];
      finishFeedback(Boolean(opt.correcta), { chosen });
    });
  });

  const writeForm = root.querySelector("#form-write");
  writeForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (session.feedback) return;
    const value = root.querySelector("#input-write").value;
    session.draft = value;
    const expected = usos[word.id]?.modelo || word.palabra_taino;
    finishFeedback(samePhrase(value, expected));
  });

  function tryMatchPair() {
    if (!session.pickLeft || !session.pickRight) {
      navigate(`/practica/${session.trailId}/${session.lessonN}`, { replace: true });
      return;
    }
    if (session.pickLeft === session.pickRight) {
      session.matched = [...session.matched, session.pickLeft];
      session.pickLeft = null;
      session.pickRight = null;
      session.mismatch = null;
      if (session.matched.length === session.matchLeft.length) {
        finishFeedback(true);
        return;
      }
    } else {
      session.mismatch = { left: session.pickLeft, right: session.pickRight };
      session.pickLeft = null;
      session.pickRight = null;
      window.setTimeout(() => {
        if (!session || session.feedback) return;
        session.mismatch = null;
        navigate(`/practica/${session.trailId}/${session.lessonN}`, { replace: true });
      }, 420);
    }
    navigate(`/practica/${session.trailId}/${session.lessonN}`, { replace: true });
  }

  root.querySelectorAll("[data-match-left]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (session.feedback) return;
      session.pickLeft = btn.dataset.matchLeft;
      session.mismatch = null;
      tryMatchPair();
    });
  });

  root.querySelectorAll("[data-match-right]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (session.feedback) return;
      session.pickRight = btn.dataset.matchRight;
      session.mismatch = null;
      tryMatchPair();
    });
  });

  root.querySelectorAll("[data-tile]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (session.feedback) return;
      session.picked = [...session.picked, session.tiles[Number(btn.dataset.tile)]];
      navigate(`/practica/${session.trailId}/${session.lessonN}`, { replace: true });
    });
  });

  root.querySelectorAll("[data-unpick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (session.feedback) return;
      const i = Number(btn.dataset.unpick);
      session.picked = session.picked.filter((_, idx) => idx !== i);
      navigate(`/practica/${session.trailId}/${session.lessonN}`, { replace: true });
    });
  });

  root.querySelector("#btn-check-build")?.addEventListener("click", () => {
    if (session.feedback) return;
    const uso = usos[word.id];
    finishFeedback(samePhrase(session.picked.join(" "), uso.tokens.join(" ")));
  });

  const aplicarForm = root.querySelector("#form-aplicar");
  aplicarForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (session.feedback) return;
    const app = step.app;
    const value = root.querySelector("#input-aplicar").value;
    session.draft = value;
    const ok = matchesPatron(value, app.patron);
    if (ok && app.guardar_nombre) {
      const parsed = parsePresentacion(value);
      if (parsed?.nombre) setNombrePropio(parsed.nombre);
    }
    finishFeedback(ok);
  });

  const presentarForm = root.querySelector("#form-presentar");
  presentarForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (session.feedback) return;
    const value = root.querySelector("#input-presentar").value;
    session.draft = value;
    let ok = false;
    let echo = "";
    if (step.persona === "daka") {
      const parsed = parsePresentacion(value);
      ok = Boolean(parsed);
      if (parsed) {
        setNombrePropio(parsed.nombre);
        echo = parsed.conGuakaBoiti
          ? `Así se dice: ${value.trim()}. Soy ${parsed.nombre}. Guáka boití.`
          : `Así se dice: ${value.trim()}. Soy ${parsed.nombre}.`;
      }
    } else {
      const parts = normalizeText(value).split(" ").filter(Boolean);
      ok = parts.length >= 2 && parts[parts.length - 1] === "turi" && parts.slice(0, -1).join("").length >= 2;
      if (ok) echo = `Así se dice: ${value.trim()}. Tú eres ${value.trim().split(/\s+/).slice(0, -1).join(" ")}.`;
    }
    finishFeedback(ok, { echo });
  });

  root.querySelector("#btn-next")?.addEventListener("click", goNext);

  const focusable = root.querySelector("#input-write, #input-presentar, #input-aplicar");
  if (focusable && !session.feedback) focusable.focus();
}

export function resetPractica() {
  session = null;
}
