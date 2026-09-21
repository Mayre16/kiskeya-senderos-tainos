import { getState } from "./store.js";
import { playClip } from "./recordings.js";

let audioCtx = null;
let ambientNodes = null;

const CARIBE = ["es-do", "es-pr", "es-cu", "es-mx", "es-co", "es-ve", "es-us", "es-pa", "es-cr"];
const FEMENINA = /female|mujer|woman|paulina|sabina|helena|luc[ií]a|m[oó]nica|elvira|soledad|mar[ií]a|carmen|pilar|isabel|conchita|google español|microsoft sabina|microsoft helena|microsoft lucia/i;
const MASCULINA = /male|hombre|man|david|jorge|pablo|diego|raul|raúl|jorge|google us english|microsoft david|alex/i;

function voiceScore(voice) {
  const lang = voice.lang.toLowerCase();
  const label = `${voice.name} ${voice.lang}`;
  let score = 0;
  if (lang.startsWith("en")) score -= 40;
  if (lang.startsWith("es")) score += 12;
  if (CARIBE.some((code) => lang.startsWith(code))) score += 10;
  if (FEMENINA.test(label)) score += 14;
  if (MASCULINA.test(label) && !FEMENINA.test(label)) score -= 8;
  return score;
}

export function listSpanishVoices() {
  if (!("speechSynthesis" in window)) return [];
  return speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith("es"))
    .sort((a, b) => voiceScore(b) - voiceScore(a));
}

export function waitForVoices() {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) {
      resolve([]);
      return;
    }
    const settle = () => resolve(listSpanishVoices());
    if (listSpanishVoices().length) {
      settle();
      return;
    }
    speechSynthesis.addEventListener("voiceschanged", settle, { once: true });
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      if (listSpanishVoices().length || n > 12) {
        clearInterval(id);
        settle();
      }
    }, 200);
  });
}

export function pickVoice(preferredURI = getState().voiceURI) {
  const voices = speechSynthesis.getVoices();
  if (preferredURI) {
    const chosen = voices.find((voice) => voice.voiceURI === preferredURI);
    if (chosen) return chosen;
  }
  const spanish = listSpanishVoices();
  return spanish[0] || voices.find((voice) => !voice.lang.toLowerCase().startsWith("en")) || null;
}

export function speak(text, { mute = false, voiceURI } = {}) {
  if (mute || !text || !("speechSynthesis" in window)) return false;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(voiceURI);
  utter.lang = voice?.lang || "es-MX";
  utter.rate = 0.72;
  utter.pitch = voice && FEMENINA.test(`${voice.name} ${voice.lang}`) ? 1 : 1.08;
  if (voice) utter.voice = voice;
  speechSynthesis.speak(utter);
  return true;
}

export async function playWord(wordId, text, { mute = false } = {}) {
  if (mute) return { source: "silencio" };
  try {
    if (wordId && (await playClip(wordId))) return { source: "grabada" };
  } catch {
    /* fallback TTS */
  }
  const ok = speak(text, { mute: false, voiceURI: getState().voiceURI });
  return { source: ok ? "sintesis" : "ninguna" };
}

export function stopSpeech() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

function ensureCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

export async function startAmbient() {
  const ctx = ensureCtx();
  if (ctx.state === "suspended") await ctx.resume();
  if (ambientNodes) return;

  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * 0.35;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 620;
  filter.Q.value = 0.7;

  const gain = ctx.createGain();
  gain.gain.value = 0.045;

  const swell = ctx.createOscillator();
  swell.type = "sine";
  swell.frequency.value = 0.07;
  const swellGain = ctx.createGain();
  swellGain.gain.value = 0.018;
  swell.connect(swellGain).connect(gain.gain);

  const wave = ctx.createOscillator();
  wave.type = "sine";
  wave.frequency.value = 82;
  const waveGain = ctx.createGain();
  waveGain.gain.value = 0.012;

  noise.connect(filter).connect(gain).connect(ctx.destination);
  wave.connect(waveGain).connect(ctx.destination);
  noise.start();
  swell.start();
  wave.start();

  ambientNodes = { noise, swell, wave, gain };
}

export function stopAmbient() {
  if (!ambientNodes) return;
  try {
    ambientNodes.noise.stop();
    ambientNodes.swell.stop();
    ambientNodes.wave.stop();
  } catch {
    /* already stopped */
  }
  ambientNodes = null;
}

export function isAmbientOn() {
  return Boolean(ambientNodes);
}
