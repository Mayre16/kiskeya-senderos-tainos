const DB_NAME = "kiskeya-voces-v1";
const STORE = "clips";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveClip(wordId, blob) {
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, wordId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getClip(wordId) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(wordId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function hasClip(wordId) {
  return Boolean(await getClip(wordId));
}

export async function deleteClip(wordId) {
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(wordId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function listClipIds() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAllKeys();
    req.onsuccess = () => resolve(req.result.map(String));
    req.onerror = () => reject(req.error);
  });
}

let recorder = null;
let chunks = [];
let stream = null;

function pickMime() {
  const options = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
  return options.find((type) => MediaRecorder.isTypeSupported?.(type)) || "";
}

export async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Este navegador no permite grabar audio.");
  }
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  chunks = [];
  const mime = pickMime();
  recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : {});
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };
  recorder.start();
}

export async function stopRecording(wordId) {
  if (!recorder) return null;
  const blob = await new Promise((resolve, reject) => {
    recorder.onstop = () => {
      stream?.getTracks().forEach((track) => track.stop());
      stream = null;
      const type = recorder.mimeType || "audio/webm";
      recorder = null;
      resolve(new Blob(chunks, { type }));
    };
    recorder.onerror = () => reject(recorder.error);
    recorder.stop();
  });
  if (wordId) await saveClip(wordId, blob);
  return blob;
}

export function isRecording() {
  return Boolean(recorder && recorder.state === "recording");
}

export async function playClip(wordId) {
  const blob = await getClip(wordId);
  if (!blob) return false;
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  await audio.play();
  audio.addEventListener("ended", () => URL.revokeObjectURL(url), { once: true });
  return true;
}
