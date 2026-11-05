// Uso: node scripts/set-domain.mjs https://www.seudominio.com.br
// Troca o domínio provisório em canonical, Open Graph, JSON-LD, robots e sitemap.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

const target = (process.argv[2] || "").replace(/\/+$/, "");
if (!/^https:\/\/[^\s/]+\.[^\s/]+$/.test(target)) {
  console.error("Informe o domínio completo com https. Ex.: node scripts/set-domain.mjs https://www.seudominio.com.br");
  process.exit(1);
}
// Detecta o domínio atual a partir do canonical do index.html (permite trocar mais de uma vez).
const m = /<link rel="canonical" href="(https:\/\/[^\/"]+)/.exec(readFileSync("index.html", "utf8"));
const CURRENT = m ? m[1] : "https://landingpage-alisson-palestrante.ltabordaferrei.workers.dev";
const exts = new Set([".html", ".xml", ".txt"]);
let changed = 0;
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".git")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (exts.has(extname(p))) {
      const src = readFileSync(p, "utf8");
      if (src.includes(CURRENT)) { writeFileSync(p, src.split(CURRENT).join(target)); changed++; console.log("atualizado:", p); }
    }
  }
})(process.cwd());
console.log(`Pronto: ${changed} arquivo(s) atualizado(s) para ${target}`);
