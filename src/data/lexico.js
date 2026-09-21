import core from "./glossary.json";
import extra from "./glossary-ampliado.json";
import basico from "./glossary-basico.json";
import folklore from "./glossary-folklore.json";
import usosCore from "./usos.json";
import usosExtra from "./usos-ampliado.json";
import usosBasico from "./usos-basico.json";
import usosFolklore from "./usos-folklore.json";
import fuentes from "./fuentes.json";

const seen = new Set();
export const glossary = [...core, ...extra, ...basico, ...folklore].filter((word) => {
  if (seen.has(word.id)) return false;
  seen.add(word.id);
  return true;
});
export const usos = { ...usosCore, ...usosExtra, ...usosBasico, ...usosFolklore };
export { fuentes };
export default glossary;
