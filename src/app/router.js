const listeners = new Set();

export function currentPath() {
  return location.pathname.replace(/\/+$/, "") || "/";
}

export function parseRoute(pathname = currentPath()) {
  const p = pathname;
  if (p === "/") return { name: "home" };
  if (p === "/ceiba") return { name: "ceiba" };
  if (p === "/voces") return { name: "voces" };
  if (p === "/fuentes") return { name: "fuentes" };

  let m = p.match(/^\/sendero\/(\d+)$/);
  if (m) return { name: "sendero", id: Number(m[1]) };

  m = p.match(/^\/practica\/(\d+)\/(\d+)$/);
  if (m) return { name: "practica", senderoId: Number(m[1]), leccionN: Number(m[2]) };

  m = p.match(/^\/sabiduria\/(\d+)\/(\d+)$/);
  if (m) return { name: "sabiduria", senderoId: Number(m[1]), leccionN: Number(m[2]) };

  m = p.match(/^\/pausa\/(\d+)$/);
  if (m) return { name: "pausa", senderoId: Number(m[1]) };

  return { name: "notfound" };
}

export function navigate(path, { replace = false } = {}) {
  const next = path.startsWith("/") ? path : `/${path}`;
  if (next === currentPath()) {
    listeners.forEach((fn) => fn(parseRoute()));
    return;
  }
  if (replace) history.replaceState({ path: next }, "", next);
  else history.pushState({ path: next }, "", next);
  listeners.forEach((fn) => fn(parseRoute()));
}

export function start(onChange) {
  listeners.add(onChange);
  window.addEventListener("popstate", () => onChange(parseRoute()));
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-link]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("mailto:")) return;
    event.preventDefault();
    navigate(href);
  });
}
