function svgWrap(className, inner, { size = 160, view = "0 0 160 120" } = {}) {
  return `<svg class="${className}" width="${size}" height="${Math.round((size * 120) / 160)}" viewBox="${view}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
}

function petroglyphDots(x, y, color = "#4A2C1A", o = 0.18) {
  return `<g opacity="${o}">
    <circle cx="${x}" cy="${y}" r="1.4" fill="${color}"/>
    <circle cx="${x + 6}" cy="${y}" r="1.4" fill="${color}"/>
    <circle cx="${x + 3}" cy="${y + 5}" r="1.4" fill="${color}"/>
  </g>`;
}

export function manatiSvg({ size = 200 } = {}) {
  return svgWrap(
    "svg-manati",
    `
    <ellipse cx="80" cy="88" rx="58" ry="14" fill="#4A8A9A" opacity=".18"/>
    <path class="water" d="M10 94c20-8 32 4 50 0s32-10 52 2 30 4 40-4" stroke="#4A8A9A" stroke-width="2.4" stroke-linecap="round"/>
    <path class="water" d="M18 104c18-5 36 3 52-2 20-6 34 4 56 0" stroke="#2A6B7C" stroke-width="1.6" opacity=".45" stroke-linecap="round"/>
    <ellipse cx="82" cy="58" rx="52" ry="24" fill="#3D7A88"/>
    <ellipse cx="80" cy="56" rx="46" ry="19" fill="#2A6B7C"/>
    <path d="M122 54c14 3 24 10 28 18-12-1-22-2-32-10-5-4-6-7-4-8z" class="fin" fill="#4A8A9A"/>
    <path d="M32 66c-12 5-18 12-20 18 14-2 22-7 28-16 2-3-1-5-8-2z" fill="#4A8A9A"/>
    <circle cx="46" cy="50" r="3.2" fill="#FDFBF7"/>
    <circle cx="45.2" cy="49.3" r="1.4" fill="#4A2C1A"/>
    <path d="M38 60c8 4 16 4 24 0" stroke="#F5EFE4" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>
    ${petroglyphDots(72, 52, "#FDFBF7", 0.32)}
  `,
    { size },
  );
}

export function guaniSvg({ size = 180 } = {}) {
  return svgWrap(
    "svg-guani",
    `
    <path d="M108 78c12-18 8-32-6-38-8 10-8 22 0 34 2 4 4 6 6 4z" fill="#C45C26"/>
    <path d="M104 70c8-4 14-2 18 6" stroke="#3D6B4A" stroke-width="2" stroke-linecap="round"/>
    <circle cx="118" cy="78" r="5" fill="#5C8A64"/>
    <g class="wing">
      <path d="M62 44c-22-18-20-8-6 10 8 10 16 12 22 6-4-6-10-12-16-16z" fill="#2A6B7C"/>
    </g>
    <ellipse cx="78" cy="58" rx="16" ry="10" fill="#4A8A9A"/>
    <path d="M92 56c10-2 14-8 12-14-8 2-14 6-16 12 0 2 2 3 4 2z" fill="#2A6B7C"/>
    <path d="M102 46l10-2-8 6-2-4z" fill="#D4A04A"/>
    <circle cx="96" cy="50" r="1.4" fill="#FDFBF7"/>
    <path d="M70 64c8 10 4 18-6 16" stroke="#3D6B4A" stroke-width="2" stroke-linecap="round"/>
    ${petroglyphDots(72, 54, "#FDFBF7", 0.3)}
  `,
    { size },
  );
}

export function ciguaSvg({ size = 180 } = {}) {
  return svgWrap(
    "svg-cigua",
    `
    <path class="frond" d="M28 108c18-46 38-70 72-86 4 22-8 48-28 70-12 14-28 20-44 16z" fill="#3D6B4A"/>
    <path class="frond" d="M40 108c10-36 28-56 58-68-6 24-20 42-40 58-8 6-14 10-18 10z" fill="#5C8A64"/>
    <rect x="78" y="86" width="8" height="22" rx="3" fill="#6B4530"/>
    <g class="bird">
      <ellipse cx="96" cy="62" rx="14" ry="9" fill="#C45C26"/>
      <path d="M108 60c8-6 10-4 8 2l-10 4-2-6z" fill="#9A4318"/>
      <path d="M116 61l8 1-8 3v-4z" fill="#D4A04A"/>
      <circle cx="104" cy="58" r="1.3" fill="#FDFBF7"/>
      <path d="M86 66c-6 4-6 8-2 8" stroke="#4A2C1A" stroke-width="1.4"/>
    </g>
  `,
    { size },
  );
}

export function careySvg({ size = 180 } = {}) {
  return svgWrap(
    "svg-carey",
    `
    <path class="water" d="M16 96c20-8 40 4 64-2 22-6 40 4 64 0" stroke="#4A8A9A" stroke-width="2" stroke-linecap="round"/>
    <ellipse class="flipper" cx="42" cy="72" rx="16" ry="7" fill="#3D6B4A" transform="rotate(-20 42 72)"/>
    <ellipse class="flipper" cx="118" cy="78" rx="14" ry="6" fill="#3D6B4A" transform="rotate(18 118 78)"/>
    <ellipse cx="80" cy="64" rx="36" ry="24" fill="#C45C26"/>
    <ellipse cx="80" cy="64" rx="28" ry="18" fill="#9A4318"/>
    <path d="M58 58h44M80 48v32M64 50l32 28M96 50L64 78" stroke="#D4A04A" stroke-width="1.4" opacity=".7"/>
    <ellipse cx="48" cy="60" rx="10" ry="7" fill="#6B4530"/>
    <circle cx="44" cy="58" r="1.4" fill="#FDFBF7"/>
    ${petroglyphDots(74, 60, "#FDFBF7", 0.25)}
  `,
    { size },
  );
}

export function rosaSvg({ size = 180, blooming = false } = {}) {
  return svgWrap(
    `svg-rosa${blooming ? " blooming" : ""}`,
    `
    <circle class="halo" cx="80" cy="62" r="40" fill="#C45C26" opacity=".12"/>
    <path d="M80 70c2 16 2 28 0 38" stroke="#3D6B4A" stroke-width="3" stroke-linecap="round"/>
    <path d="M80 96c-16 4-22-6-18-16" stroke="#5C8A64" stroke-width="3" fill="none"/>
    <g class="petal"><ellipse cx="80" cy="48" rx="12" ry="20" fill="#C45C26"/></g>
    <g class="petal"><ellipse cx="62" cy="58" rx="11" ry="18" fill="#9A4318" transform="rotate(-40 62 58)"/></g>
    <g class="petal"><ellipse cx="98" cy="58" rx="11" ry="18" fill="#9A4318" transform="rotate(40 98 58)"/></g>
    <g class="petal"><ellipse cx="70" cy="72" rx="10" ry="16" fill="#C45C26" transform="rotate(-20 70 72)"/></g>
    <g class="petal"><ellipse cx="90" cy="72" rx="10" ry="16" fill="#C45C26" transform="rotate(20 90 72)"/></g>
    <circle cx="80" cy="64" r="7" fill="#D4A04A"/>
    <circle cx="80" cy="64" r="3" fill="#4A2C1A"/>
  `,
    { size },
  );
}

export function ceibaSvg({ size = 220, stage = 0 } = {}) {
  const canopy =
    stage >= 5
      ? `<ellipse cx="80" cy="42" rx="54" ry="28" fill="#3D6B4A"/>
         <ellipse cx="52" cy="52" rx="28" ry="18" fill="#5C8A64"/>
         <ellipse cx="108" cy="52" rx="28" ry="18" fill="#5C8A64"/>
         <circle class="leaf" cx="40" cy="40" r="6" fill="#3D6B4A"/>
         <circle class="leaf" cx="120" cy="36" r="6" fill="#3D6B4A"/>`
      : stage >= 4
        ? `<ellipse cx="80" cy="48" rx="44" ry="24" fill="#3D6B4A"/>
           <ellipse cx="56" cy="56" rx="22" ry="14" fill="#5C8A64"/>
           <ellipse cx="104" cy="56" rx="22" ry="14" fill="#5C8A64"/>`
        : stage >= 3
          ? `<ellipse cx="80" cy="52" rx="32" ry="20" fill="#3D6B4A"/>
             <ellipse cx="80" cy="44" rx="18" ry="12" fill="#5C8A64"/>`
          : stage >= 2
            ? `<ellipse cx="80" cy="58" rx="20" ry="14" fill="#3D6B4A"/>
               <circle class="leaf" cx="68" cy="52" r="6" fill="#5C8A64"/>
               <circle class="leaf" cx="92" cy="50" r="6" fill="#5C8A64"/>`
            : stage >= 1
              ? `<path d="M80 88c-8-18-4-28 0-40 4 12 8 22 0 40z" fill="#3D6B4A"/>
                 <circle class="leaf" cx="80" cy="48" r="8" fill="#5C8A64"/>`
              : `<ellipse cx="80" cy="96" rx="10" ry="6" fill="#6B4530"/>
                 <circle cx="80" cy="90" r="5" fill="#C45C26"/>`;

  const trunk =
    stage >= 2
      ? `<path d="M72 108c2-28 2-48 8-70 6 22 6 42 8 70-6 6-12 6-16 0z" fill="#6B4530"/>
         <path d="M68 108c-10-4-18 0-24 8" stroke="#6B4530" stroke-width="4" fill="none" stroke-linecap="round"/>
         <path d="M92 108c10-4 18 0 24 8" stroke="#6B4530" stroke-width="4" fill="none" stroke-linecap="round"/>`
      : stage >= 1
        ? `<path d="M77 90c1-10 1-18 3-28 2 10 2 18 3 28z" fill="#6B4530"/>`
        : "";

  return svgWrap(
    "svg-ceiba",
    `
    <ellipse cx="80" cy="112" rx="46" ry="6" fill="#E8D9C0"/>
    ${trunk}
    ${canopy}
    ${stage >= 4 ? petroglyphDots(74, 40, "#FDFBF7", 0.35) : ""}
  `,
    { size, view: "0 0 160 120" },
  );
}

function iconBase(inner, { size = 88 } = {}) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
}

const icons = {
  tau: `<circle cx="40" cy="40" r="22" stroke="#C45C26" stroke-width="3"/>
        <path d="M40 22c6 8 6 14 0 22-6-8-6-14 0-22zM40 36c6 8 6 14 0 22" stroke="#4A2C1A" stroke-width="2"/>`,
  jajom: `<circle cx="40" cy="40" r="16" fill="#D4A04A"/>
          <path d="M40 18v8M40 54v8M18 40h8M54 40h8M24 24l6 6M50 50l6 6M56 24l-6 6M30 50l-6 6" stroke="#C45C26" stroke-width="3" stroke-linecap="round"/>`,
  daka: `<circle cx="40" cy="32" r="10" fill="#6B4530"/>
         <path d="M22 58c4-14 12-18 18-18s14 4 18 18" fill="#C45C26"/>`,
  turi: `<circle cx="28" cy="34" r="8" fill="#6B4530"/>
         <circle cx="52" cy="34" r="8" fill="#2A6B7C"/>
         <path d="M20 58c2-10 8-14 14-14M46 44c6 0 12 4 14 14" stroke="#4A2C1A" stroke-width="3" fill="none"/>`,
  taiway: `<circle cx="40" cy="40" r="12" fill="#D4A04A"/>
           <path d="M40 16v8M40 56v8M16 40h8M56 40h8" stroke="#C45C26" stroke-width="3" stroke-linecap="round"/>`,
  taiguey: `<circle cx="40" cy="40" r="14" fill="#D4A04A"/>
            <path d="M40 12v8M40 60v8M12 40h8M60 40h8M20 20l6 6M54 54l6 6M60 20l-6 6M26 54l-6 6" stroke="#C45C26" stroke-width="3" stroke-linecap="round"/>`,
  taikaraye: `<path d="M48 18a20 20 0 1 0 0 44 16 16 0 0 1 0-44z" fill="#2A6B7C"/>
              <circle cx="54" cy="26" r="2" fill="#FDFBF7"/>`,
  jutia: `<ellipse cx="42" cy="46" rx="20" ry="12" fill="#6B4530"/>
          <ellipse cx="24" cy="40" rx="8" ry="7" fill="#4A2C1A"/>
          <circle cx="21" cy="38" r="1.4" fill="#FDFBF7"/>
          <path d="M56 40c8-10 10-6 6 2" stroke="#4A2C1A" stroke-width="3" fill="none"/>`,
  iguana: `<path d="M18 50c16-18 28-20 44-8 8 6 12 8 16 6-8 8-22 12-40 10-10-1-16 2-20 8" fill="#3D6B4A"/>
           <path d="M30 42c4-8 10-8 12-2" stroke="#5C8A64" stroke-width="2"/>
           <circle cx="22" cy="44" r="1.4" fill="#FDFBF7"/>`,
  yuca: `<path d="M36 22c-4 16-2 28 4 40 6-12 8-24 4-40z" fill="#E8D9C0" stroke="#6B4530" stroke-width="2"/>
         <path d="M40 20c-12-8-16 4-8 10M40 20c12-8 16 4 8 10" fill="#3D6B4A"/>`,
  caoba: `<rect x="36" y="38" width="8" height="28" rx="2" fill="#6B4530"/>
          <ellipse cx="40" cy="34" rx="22" ry="16" fill="#9A4318"/>
          <ellipse cx="40" cy="30" rx="14" ry="10" fill="#C45C26"/>`,
  guayacan: `<rect x="37" y="40" width="6" height="26" rx="2" fill="#4A2C1A"/>
             <circle cx="40" cy="36" r="16" fill="#3D6B4A"/>
             <circle cx="32" cy="30" r="4" fill="#D4A04A"/>`,
  mangle: `<path d="M40 24v20" stroke="#6B4530" stroke-width="4"/>
           <path d="M40 44c-12 10-16 18-16 24M40 44c12 10 16 18 16 24M40 44c0 12-4 20-8 24M40 44c0 12 4 20 8 24" stroke="#4A2C1A" stroke-width="3" fill="none"/>
           <ellipse cx="40" cy="22" rx="16" ry="10" fill="#3D6B4A"/>`,
  guazabara: `<path d="M40 66c0-22 0-36 0-48" stroke="#3D6B4A" stroke-width="8" stroke-linecap="round"/>
              <path d="M28 40c8 4 16 4 24 0M30 52c6 3 14 3 20 0" stroke="#5C8A64" stroke-width="3"/>
              <circle cx="40" cy="20" r="5" fill="#C45C26"/>`,
  behique: `<rect x="28" y="30" width="24" height="28" rx="6" fill="#6B4530"/>
            <circle cx="40" cy="26" r="10" fill="#C45C26"/>
            <path d="M30 26h20M40 16v8" stroke="#D4A04A" stroke-width="2"/>
            <circle cx="36" cy="40" r="2" fill="#FDFBF7"/>
            <circle cx="44" cy="40" r="2" fill="#FDFBF7"/>`,
  boiti: `<circle cx="40" cy="40" r="20" stroke="#C45C26" stroke-width="3"/>
          <path d="M40 24c8 8 8 16 0 24-8-8-8-16 0-24z" fill="#D4A04A"/>`,
  waribo: `<path d="M20 50c8-20 16-24 20-24s12 4 20 24" stroke="#2A6B7C" stroke-width="4" fill="none"/>
           <circle cx="40" cy="28" r="6" fill="#C45C26"/>`,
  "taino-ti": `<circle cx="40" cy="40" r="22" stroke="#4A2C1A" stroke-width="2"/>
               <circle cx="28" cy="40" r="6" fill="#C45C26"/>
               <circle cx="52" cy="40" r="6" fill="#3D6B4A"/>
               <circle cx="40" cy="28" r="6" fill="#2A6B7C"/>`,
  opia: `<ellipse cx="40" cy="40" rx="16" ry="22" fill="#2A6B7C" opacity=".85"/>
         <circle cx="34" cy="36" r="2" fill="#FDFBF7"/>
         <circle cx="46" cy="36" r="2" fill="#FDFBF7"/>
         <path d="M34 50c4 4 8 4 12 0" stroke="#F5EFE4" stroke-width="2"/>`,
  batey: `<rect x="14" y="14" width="52" height="52" rx="4" stroke="#4A2C1A" stroke-width="2"/>
          <circle cx="40" cy="40" r="14" stroke="#C45C26" stroke-width="3"/>
          <circle cx="40" cy="40" r="4" fill="#D4A04A"/>`,
  batu: `<circle cx="40" cy="40" r="16" fill="#C45C26"/>
         <circle cx="40" cy="40" r="8" fill="#D4A04A"/>
         <path d="M18 40h8M54 40h8M40 18v8M40 54v8" stroke="#4A2C1A" stroke-width="2"/>`,
  cemi: `<path d="M40 14l18 50H22L40 14z" fill="#6B4530"/>
         <circle cx="34" cy="44" r="3" fill="#FDFBF7"/>
         <circle cx="46" cy="44" r="3" fill="#FDFBF7"/>
         <path d="M32 54h16" stroke="#C45C26" stroke-width="2"/>`,
  cohoba: `<ellipse cx="40" cy="50" rx="16" ry="8" fill="#6B4530"/>
           <path d="M28 50c0-16 6-28 12-28s12 12 12 28" stroke="#4A2C1A" stroke-width="3" fill="none"/>
           <circle cx="40" cy="22" r="5" fill="#C45C26"/>`,
  areito: `<path d="M16 52c8-16 16-16 24 0s16 16 24 0" stroke="#C45C26" stroke-width="3" fill="none"/>
           <circle cx="24" cy="36" r="5" fill="#2A6B7C"/>
           <circle cx="40" cy="30" r="5" fill="#3D6B4A"/>
           <circle cx="56" cy="36" r="5" fill="#C45C26"/>`,
  hamaca: `<path d="M12 28c18 24 38 24 56 0" stroke="#C45C26" stroke-width="4" fill="none"/>
           <path d="M16 30c14 16 34 16 48 0" stroke="#D4A04A" stroke-width="2"/>
           <path d="M14 22v12M66 22v12" stroke="#4A2C1A" stroke-width="3"/>`,
  canoa: `<path d="M12 44c8 16 48 16 56 0-6 4-50 4-56 0z" fill="#6B4530"/>
          <path d="M20 44c8-8 32-8 40 0" stroke="#4A2C1A" stroke-width="2"/>`,
  casabe: `<circle cx="40" cy="40" r="22" fill="#E8D9C0" stroke="#C45C26" stroke-width="3"/>
           <circle cx="40" cy="40" r="8" fill="#D4A04A"/>
           <path d="M26 30l8 6M54 30l-8 6M26 50l8-4M54 50l-8-4" stroke="#6B4530" stroke-width="2"/>`,
  aito: `<circle cx="28" cy="40" r="12" stroke="#C45C26" stroke-width="3"/>
         <circle cx="52" cy="40" r="12" stroke="#2A6B7C" stroke-width="3"/>`,
  bagua: `<path d="M10 36c10-8 20 8 30 0s20 8 30 0" stroke="#2A6B7C" stroke-width="3" fill="none"/>
          <path d="M10 50c10-8 20 8 30 0s20 8 30 0" stroke="#4A8A9A" stroke-width="3" fill="none"/>`,
  conuco: `<path d="M16 56h48" stroke="#6B4530" stroke-width="4"/>
           <path d="M24 56V36M40 56V28M56 56V38" stroke="#3D6B4A" stroke-width="4"/>
           <circle cx="24" cy="32" r="4" fill="#D4A04A"/><circle cx="40" cy="24" r="4" fill="#C45C26"/><circle cx="56" cy="34" r="4" fill="#5C8A64"/>`,
  bohio: `<path d="M16 40l24-16 24 16v24H16V40z" fill="#C45C26"/>
          <rect x="34" y="46" width="12" height="18" fill="#4A2C1A"/>`,
  cacique: `<circle cx="40" cy="26" r="10" fill="#D4A04A"/>
            <path d="M22 62c4-16 12-20 18-20s14 4 18 20" fill="#6B4530"/>
            <path d="M28 24h24" stroke="#C45C26" stroke-width="3"/>`,
  naboria: `<circle cx="28" cy="30" r="7" fill="#6B4530"/><circle cx="52" cy="30" r="7" fill="#6B4530"/>
            <path d="M16 58c2-12 8-16 12-16s10 4 12 16M40 58c2-12 8-16 12-16s10 4 12 16" fill="#C45C26"/>`,
  yukayeke: `<circle cx="40" cy="40" r="22" stroke="#4A2C1A" stroke-width="2"/>
             <rect x="22" y="36" width="12" height="10" fill="#C45C26"/>
             <rect x="46" y="36" width="12" height="10" fill="#C45C26"/>
             <circle cx="40" cy="40" r="4" fill="#D4A04A"/>`,
  maiz: `<ellipse cx="40" cy="42" rx="10" ry="22" fill="#D4A04A"/>
         <path d="M40 18c-12 8-10 16-4 20M40 18c12 8 10 16 4 20" fill="#3D6B4A"/>`,
  aji: `<path d="M42 20c-2 8 8 14 8 24 0 14-20 22-20 8 0-12 10-16 12-32z" fill="#C45C26"/>
        <path d="M42 18c4-6 10-2 8 4" stroke="#3D6B4A" stroke-width="3"/>`,
  batata: `<ellipse cx="40" cy="44" rx="22" ry="14" fill="#C45C26"/>
           <path d="M36 30c-4-10 0-16 6-16" stroke="#3D6B4A" stroke-width="3"/>`,
  huracan: `<path d="M40 16c16 8 20 20 12 28-10 8-24 4-24-8 0-10 10-12 18-8" stroke="#2A6B7C" stroke-width="3" fill="none"/>
            <circle cx="40" cy="40" r="4" fill="#C45C26"/>`,
  atabey: `<circle cx="40" cy="32" r="12" fill="#4A8A9A"/>
           <path d="M22 62c6-16 12-18 18-18s12 2 18 18" fill="#2A6B7C"/>
           <path d="M18 48c8 4 36 4 44 0" stroke="#4A8A9A" stroke-width="2"/>`,
  yocahu: `<path d="M40 18v18" stroke="#3D6B4A" stroke-width="4"/>
           <path d="M28 28c8 4 16 4 24 0" stroke="#5C8A64" stroke-width="3"/>
           <path d="M28 52c4-10 8-16 12-16s8 6 12 16" fill="#D4A04A"/>
           <path d="M32 56c2-6 4-10 8-10s6 4 8 10" fill="#C45C26"/>`,
  karaya: `<path d="M48 20a18 18 0 1 0 0 40 14 14 0 0 1 0-40z" fill="#D4A04A"/>
           <circle cx="54" cy="28" r="2" fill="#FDFBF7"/>`,
  mayohuacan: `<rect x="16" y="30" width="48" height="22" rx="10" fill="#6B4530"/>
               <path d="M28 30v22M40 30v22M52 30v22" stroke="#4A2C1A" stroke-width="2"/>
               <path d="M22 26c6-8 30-8 36 0" stroke="#C45C26" stroke-width="3" fill="none"/>`,
  guamo: `<path d="M22 50c0-16 10-28 24-28 10 0 16 8 16 16 0 14-12 22-22 22-6 0-10-4-12-8" fill="#E8D9C0" stroke="#C45C26" stroke-width="2"/>
          <path d="M18 48c6 6 10 8 16 8" stroke="#4A2C1A" stroke-width="3" fill="none"/>
          <circle cx="40" cy="36" r="3" fill="#6B4530"/>`,
  boria: `<path d="M20 56l12-24 8 12 8-16 12 28" stroke="#6B4530" stroke-width="3" fill="none"/>
          <circle cx="32" cy="32" r="4" fill="#C45C26"/>`,
  domi: `<path d="M16 44c12-16 36-16 48 0" stroke="#2A6B7C" stroke-width="3" fill="none"/>
         <ellipse cx="40" cy="50" rx="16" ry="8" fill="#6B4530"/>`,
  dujo: `<rect x="22" y="40" width="36" height="10" rx="3" fill="#6B4530"/>
         <path d="M24 50v12M56 50v12M28 40V28h24v12" stroke="#4A2C1A" stroke-width="3"/>
         <circle cx="40" cy="24" r="5" fill="#C45C26"/>`,
  caney: `<path d="M12 44h56v20H12z" fill="#9A4318"/>
          <path d="M12 44l28-18 28 18" fill="#C45C26"/>`,
  macana: `<path d="M36 16h8v40l-4 12-4-12V16z" fill="#6B4530"/>
           <ellipse cx="40" cy="22" rx="8" ry="6" fill="#4A2C1A"/>`,
  kiskeya: `<path d="M16 50c8-20 16-28 24-28s16 8 24 28" fill="#3D6B4A"/>
            <path d="M22 50c6-10 12-14 18-14s12 4 18 14" fill="#5C8A64"/>
            <path d="M14 56h52" stroke="#2A6B7C" stroke-width="4" stroke-linecap="round"/>`,
  ceiba: `<rect x="37" y="40" width="6" height="26" fill="#6B4530"/>
          <ellipse cx="40" cy="36" rx="20" ry="16" fill="#3D6B4A"/>`,
  manati: `<ellipse cx="42" cy="42" rx="24" ry="12" fill="#2A6B7C"/>
           <circle cx="26" cy="38" r="2" fill="#FDFBF7"/>`,
  guani: `<ellipse cx="40" cy="42" rx="12" ry="8" fill="#2A6B7C"/>
          <path d="M28 36c-10-10-8-2 0 6" fill="#4A8A9A"/>
          <path d="M52 38l10-4-8 6z" fill="#D4A04A"/>`,
  cigua: `<path d="M20 58c10-24 22-34 40-40" stroke="#3D6B4A" stroke-width="4" fill="none"/>
          <ellipse cx="50" cy="36" rx="10" ry="6" fill="#C45C26"/>`,
  carey: `<ellipse cx="40" cy="40" rx="20" ry="14" fill="#C45C26"/>
          <path d="M28 34h24M40 28v24" stroke="#D4A04A"/>`,
  rosa: `<ellipse cx="40" cy="30" rx="8" ry="14" fill="#C45C26"/>
         <ellipse cx="28" cy="40" rx="8" ry="12" fill="#9A4318"/>
         <ellipse cx="52" cy="40" rx="8" ry="12" fill="#9A4318"/>
         <circle cx="40" cy="40" r="5" fill="#D4A04A"/>`,
};

export function iconSvg(asset, size = 88) {
  const inner = icons[asset] || icons.tau;
  return iconBase(inner, { size });
}

export function featuredSvg(asset, options = {}) {
  switch (asset) {
    case "manati":
      return manatiSvg(options);
    case "guani":
      return guaniSvg(options);
    case "cigua":
      return ciguaSvg(options);
    case "carey":
      return careySvg(options);
    case "ceiba":
      return ceibaSvg({ ...options, stage: options.stage ?? 4 });
    case "rosa":
      return rosaSvg(options);
    default:
      return `<div class="grid place-items-center">${iconSvg(asset, options.size || 140)}</div>`;
  }
}

export const FEATURED = new Set(["manati", "guani", "cigua", "carey", "ceiba", "rosa"]);
