import { glossary } from "../data/lexico.js";
import { getState, setVoiceURI } from "../app/store.js";
import { listSpanishVoices, playWord, speak, waitForVoices } from "../app/speech.js";
import {
  deleteClip,
  hasClip,
  isRecording,
  listClipIds,
  startRecording,
  stopRecording,
} from "../app/recordings.js";
import { escapeHtml } from "../app/helpers.js";

let recordingId = null;

function voiceOptions(selected) {
  const voices = listSpanishVoices();
  if (!voices.length) {
    return `<option value="">Aún no hay voces en español en este aparato</option>`;
  }
  return voices
    .map((voice) => {
      const label = `${voice.name} (${voice.lang})`;
      const current = voice.voiceURI === selected ? "selected" : "";
      return `<option value="${escapeHtml(voice.voiceURI)}" ${current}>${escapeHtml(label)}</option>`;
    })
    .join("");
}

export function renderVoces() {
  const state = getState();
  const rows = glossary
    .map(
      (word) => `
        <li class="card-stone flex flex-wrap items-center gap-3 p-4" data-word="${escapeHtml(word.id)}">
          <div class="min-w-0 flex-1">
            <p class="font-display text-xl font-semibold">${escapeHtml(word.palabra_taino)}</p>
            <p class="text-xs text-caoba-clara">${escapeHtml(word.fonetica_intuitiva)} · ${escapeHtml(word.traduccion_es)}</p>
            <p class="voice-badge mt-1 text-[11px] font-semibold uppercase tracking-wide text-terracota">Síntesis</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="btn-ghost px-3 text-xs" data-play="${escapeHtml(word.id)}">Oír</button>
            <button type="button" class="btn-primary px-3 text-xs" data-rec="${escapeHtml(word.id)}">Grabar</button>
            <button type="button" class="btn-ghost px-3 text-xs" data-del="${escapeHtml(word.id)}" hidden>Borrar</button>
          </div>
        </li>
      `,
    )
    .join("");

  return `
    <section class="mx-auto max-w-lg px-4 pb-16 pt-6">
      <div class="card-stone mb-5 p-5">
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-cenote">Voz viva</p>
        <h1 class="mt-1 font-display text-3xl font-semibold">Tu pronunciación</h1>
        <p class="mt-3 text-sm leading-relaxed text-caoba-clara">
          No existe un sintetizador taíno. El aparato solo puede imitar español
          —priorizamos voces femeninas caribeñas o latinas, nunca inglés si hay español—.
          Si grabas tú, esa voz se vuelve la base: Escuchar usará tu audio.
        </p>
        <label class="mt-4 block text-xs font-semibold uppercase tracking-wide text-caoba-clara" for="voice-select">Voz de reserva (español)</label>
        <select id="voice-select" class="mt-2 min-h-11 w-full rounded-2xl border border-arena-3 bg-white px-3 text-sm text-caoba">
          ${voiceOptions(state.voiceURI)}
        </select>
        <button type="button" id="btn-probar-voz" class="btn-ghost mt-3 w-full">Probar voz de reserva con «Tau»</button>
        <p class="mt-4 text-xs leading-relaxed text-caoba-clara">
          El léxico mezcla voces atestiguadas, comparativas y de revival.
          La bibliografía del taíno clásico está en
          <a href="/fuentes" data-link class="text-cenote underline">Fuentes</a>.
        </p>
      </div>
      <ol class="space-y-3">${rows}</ol>
    </section>
  `;
}

async function paintClips(root) {
  const ids = new Set(await listClipIds());
  root.querySelectorAll("[data-word]").forEach((row) => {
    const id = row.dataset.word;
    const has = ids.has(id);
    const badge = row.querySelector(".voice-badge");
    const del = row.querySelector("[data-del]");
    if (badge) {
      badge.textContent = has ? "Tu voz" : "Síntesis";
      badge.classList.toggle("text-palma", has);
      badge.classList.toggle("text-terracota", !has);
    }
    if (del) del.hidden = !has;
  });
}

function setRecLabel(root, wordId, recording) {
  root.querySelectorAll("[data-rec]").forEach((btn) => {
    const active = recording && btn.dataset.rec === wordId;
    btn.textContent = active ? "Detener" : "Grabar";
    btn.classList.toggle("bg-terracota", active);
    btn.classList.toggle("text-arena", active);
  });
}

export async function hydrateVoces(root) {
  await waitForVoices();
  const select = root.querySelector("#voice-select");
  if (select) {
    select.innerHTML = voiceOptions(getState().voiceURI);
    select.addEventListener("change", () => setVoiceURI(select.value));
  }

  root.querySelector("#btn-probar-voz")?.addEventListener("click", () => {
    speak("Tau", { voiceURI: getState().voiceURI || select?.value });
  });

  await paintClips(root);

  root.querySelectorAll("[data-play]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.play;
      const word = glossary.find((item) => item.id === id);
      const result = await playWord(id, word?.palabra_taino || id);
      if (result.source === "ninguna") btn.textContent = word?.fonetica_intuitiva || "—";
    });
  });

  root.querySelectorAll("[data-rec]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.rec;
      try {
        if (isRecording() && recordingId === id) {
          await stopRecording(id);
          recordingId = null;
          setRecLabel(root, id, false);
          await paintClips(root);
          await playWord(id, glossary.find((item) => item.id === id)?.palabra_taino);
          return;
        }
        if (isRecording()) await stopRecording(recordingId);
        await startRecording();
        recordingId = id;
        setRecLabel(root, id, true);
      } catch (error) {
        recordingId = null;
        setRecLabel(root, id, false);
        btn.textContent = "Sin micrófono";
        console.warn(error);
      }
    });
  });

  root.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await deleteClip(btn.dataset.del);
      await paintClips(root);
    });
  });
}
