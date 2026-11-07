// Generates DripVora's locally bundled fashion artwork and product-image fallbacks.
// Run: node scripts/generate-art.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { SCENES } from "./scenes.mjs";

const OUT = new URL("../public/art/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, v + amt));
  const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

/* ---------- garment silhouettes (800 x 1000 space) ---------- */
const G = {
  tee: (c, o = {}) => ({
    body: "M270 175 L340 150 Q400 215 460 150 L530 175 L650 265 L592 372 L538 332 L538 812 Q400 832 262 812 L262 332 L208 372 L150 265 Z",
    detail: `
      <path d="M340 150 Q400 215 460 150" fill="none" stroke="${shade(c, -45)}" stroke-width="16" stroke-linecap="round"/>
      <path d="M262 332 L262 812" stroke="${shade(c, -22)}" stroke-width="2" opacity=".5"/>
      <path d="M262 800 Q400 820 538 800" fill="none" stroke="${shade(c, -30)}" stroke-width="3" opacity=".6"/>
      ${o.graphic ? `<circle cx="400" cy="440" r="62" fill="none" stroke="${o.graphic}" stroke-width="5"/><path d="M400 395 L412 428 L447 430 L420 452 L429 486 L400 466 L371 486 L380 452 L353 430 L388 428 Z" fill="${o.graphic}"/>` : ""}
      ${o.stripe ? [0,1,2,3,4,5,6,7].map(i=>`<rect x="262" y="${250+i*72}" width="276" height="22" fill="${o.stripe}" opacity=".9"/>`).join("") : ""}
      ${o.chest ? `<text x="400" y="330" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="34" fill="${o.chest}">dripvora</text>` : ""}`,
  }),
  hoodie: (c) => ({
    back: `<path d="M322 188 Q318 70 400 62 Q482 70 478 188 Q400 245 322 188 Z" fill="${shade(c, -28)}"/>`,
    body: "M285 200 L345 178 Q400 238 455 178 L515 200 L652 310 L704 722 L612 738 L562 468 L548 826 Q400 850 252 826 L238 468 L188 738 L96 722 L148 310 Z",
    detail: `
      <path d="M345 178 Q400 238 455 178 Q440 262 400 270 Q360 262 345 178Z" fill="${shade(c, -70)}" opacity=".85"/>
      <path d="M372 262 L368 400" stroke="#f4efe6" stroke-width="7" stroke-linecap="round"/>
      <path d="M428 262 L432 400" stroke="#f4efe6" stroke-width="7" stroke-linecap="round"/>
      <path d="M296 610 L504 610 L538 744 L262 744 Z" fill="${shade(c, -14)}" stroke="${shade(c, -45)}" stroke-width="3"/>
      <path d="M238 790 Q400 816 562 790" stroke="${shade(c, -45)}" stroke-width="14" fill="none" opacity=".55"/>
      <path d="M120 700 L205 714 M595 714 L680 700" stroke="${shade(c, -45)}" stroke-width="14" opacity=".55"/>`,
  }),
  shirt: (c, o = {}) => ({
    body: "M272 172 L345 150 L400 205 L455 150 L528 172 L650 270 L688 700 L612 712 L556 400 L540 820 Q400 840 260 820 L244 400 L188 712 L112 700 L150 270 Z",
    detail: `
      <path d="M345 150 L400 205 L372 252 L318 190 Z M455 150 L400 205 L428 252 L482 190 Z" fill="${shade(c, 28)}" stroke="${shade(c, -45)}" stroke-width="3"/>
      <path d="M400 205 L400 828" stroke="${shade(c, -42)}" stroke-width="3"/>
      ${[290,390,490,590,690].map(y=>`<circle cx="400" cy="${y}" r="7" fill="${shade(c, -60)}"/>`).join("")}
      ${o.check ? Array.from({length:9},(_,i)=>`<path d="M${244+i*34} 230 V820" stroke="${o.check}" stroke-width="4" opacity=".55"/>`).join("")+Array.from({length:12},(_,i)=>`<path d="M244 ${240+i*50} H556" stroke="${o.check}" stroke-width="4" opacity=".55"/>`).join("") : ""}
      <rect x="440" y="360" width="76" height="82" rx="4" fill="none" stroke="${shade(c, -45)}" stroke-width="3"/>`,
  }),
  jacket: (c) => ({
    body: "M270 160 L345 140 L400 215 L455 140 L530 160 L662 270 L704 760 L612 774 L560 420 L548 860 Q400 884 252 860 L240 420 L188 774 L96 760 L138 270 Z",
    detail: `
      <path d="M345 140 L400 215 L330 410 L246 300 Z M455 140 L400 215 L470 410 L554 300 Z" fill="${shade(c, 22)}" stroke="${shade(c, -50)}" stroke-width="3"/>
      <path d="M400 215 L400 866" stroke="${shade(c, -55)}" stroke-width="3"/>
      ${[470,570,670].map(y=>`<circle cx="${y===470?372:372}" cy="${y}" r="9" fill="${shade(c, -70)}"/>`).join("")}
      <rect x="276" y="600" width="92" height="112" rx="5" fill="none" stroke="${shade(c, -50)}" stroke-width="3"/>
      <rect x="432" y="600" width="92" height="112" rx="5" fill="none" stroke="${shade(c, -50)}" stroke-width="3"/>`,
  }),
  dress: (c, o = {}) => ({
    body: "M332 120 L360 120 Q400 200 440 120 L468 120 L492 300 L466 362 Q560 640 664 930 Q400 972 136 930 Q240 640 334 362 L308 300 Z",
    detail: `
      <path d="M334 362 Q400 392 466 362" fill="none" stroke="${shade(c, -50)}" stroke-width="12"/>
      <path d="M360 120 Q400 200 440 120" fill="none" stroke="${shade(c, -45)}" stroke-width="5"/>
      ${[0,1,2,3,4,5].map(i=>`<path d="M${400+(i-2.5)*20} 392 Q${400+(i-2.5)*52} 700 ${400+(i-2.5)*92} 940" stroke="${shade(c, -30)}" stroke-width="2.5" opacity=".5" fill="none"/>`).join("")}
      ${o.dots ? [[320,520],[470,560],[380,640],[520,720],[260,760],[420,820],[580,860],[330,900]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9" fill="${o.dots}" opacity=".9"/>`).join("") : ""}`,
  }),
  jeans: (c) => ({
    body: "M262 150 L538 150 L558 276 L618 900 L452 912 L400 470 L348 912 L182 900 L242 276 Z",
    detail: `
      <rect x="262" y="150" width="276" height="40" fill="${shade(c, -30)}" opacity=".7"/>
      ${[290,400,510].map(x=>`<rect x="${x-9}" y="150" width="18" height="40" fill="${shade(c, -55)}" opacity=".8"/>`).join("")}
      <path d="M400 190 L400 470" stroke="${shade(c, -55)}" stroke-width="3"/>
      <path d="M400 190 Q440 260 418 330" fill="none" stroke="${shade(c, 50)}" stroke-width="3" stroke-dasharray="8 6"/>
      <path d="M262 195 Q312 250 336 215 M538 195 Q488 250 464 215" fill="none" stroke="${shade(c, 50)}" stroke-width="3" stroke-dasharray="8 6"/>
      <path d="M312 600 L296 880 M488 600 L504 880" stroke="${shade(c, -30)}" stroke-width="3" opacity=".5"/>
      <path d="M184 880 L342 892 M458 892 L616 880" stroke="${shade(c, 50)}" stroke-width="3" stroke-dasharray="8 6"/>`,
  }),
  skirt: (c) => ({
    body: "M290 210 L510 210 L664 840 Q400 884 136 840 Z",
    detail: `
      <rect x="290" y="210" width="220" height="38" fill="${shade(c, -35)}" opacity=".7"/>
      ${Array.from({length:11},(_,i)=>{const t=i/10;return `<path d="M${296+t*208} 248 L${150+t*500} 850" stroke="${shade(c, -38)}" stroke-width="3" opacity=".55"/>`}).join("")}`,
  }),
  cargo: (c) => ({
    body: "M262 150 L538 150 L566 276 L626 900 L456 912 L400 460 L344 912 L174 900 L234 276 Z",
    detail: `
      <rect x="262" y="150" width="276" height="36" fill="${shade(c, -35)}" opacity=".7"/>
      <rect x="226" y="520" width="104" height="132" rx="6" fill="${shade(c, 10)}" stroke="${shade(c, -50)}" stroke-width="3"/>
      <rect x="470" y="520" width="104" height="132" rx="6" fill="${shade(c, 10)}" stroke="${shade(c, -50)}" stroke-width="3"/>
      <path d="M226 548 H330 M470 548 H574" stroke="${shade(c, -50)}" stroke-width="3"/>
      <path d="M400 186 L400 460" stroke="${shade(c, -55)}" stroke-width="3"/>
      <path d="M180 860 H340 M460 860 H620" stroke="${shade(c, -55)}" stroke-width="12" opacity=".5"/>`,
  }),
  knit: (c, o = {}) => ({
    body: "M278 180 L346 156 Q400 206 454 156 L522 180 L662 330 L704 760 L616 774 L560 450 L548 840 Q400 862 252 840 L240 450 L184 774 L96 760 L138 330 Z",
    detail: `
      <path d="M346 156 Q400 206 454 156" fill="none" stroke="${shade(c, -40)}" stroke-width="20" stroke-linecap="round"/>
      ${Array.from({length:22},(_,i)=>`<path d="M${256+i*13} 790 V840" stroke="${shade(c, -30)}" stroke-width="3" opacity=".6"/>`).join("")}
      ${Array.from({length:16},(_,i)=>`<path d="M250 ${300+i*30} Q400 ${312+i*30} 550 ${300+i*30}" stroke="${shade(c, -20)}" stroke-width="2" fill="none" opacity=".35"/>`).join("")}
      ${o.band ? `<rect x="240" y="470" width="320" height="34" fill="${o.band}" opacity=".95"/>` : ""}`,
  }),
  kidtee: (c, o = {}) => {
    const t = G.tee(c, o);
    return { ...t, scale: 0.82, dy: 120 };
  },
  kidhoodie: (c) => ({ ...G.hoodie(c), scale: 0.82, dy: 100 }),
  shorts: (c) => ({
    body: "M262 270 L538 270 L566 330 L626 700 L452 712 L400 470 L348 712 L174 700 L234 330 Z",
    detail: `
      <rect x="262" y="270" width="276" height="34" fill="${shade(c, -30)}" opacity=".7"/>
      <path d="M400 304 L400 470" stroke="${shade(c, -55)}" stroke-width="3"/>
      <path d="M380 304 Q380 390 400 392 M420 304 Q420 390 400 392" stroke="#f4efe6" stroke-width="5" fill="none" opacity=".8"/>`,
  }),
};

const garmentSVG = (kind, color, opts = {}, tx = 0, ty = 0, s = 1) => {
  const g = G[kind](color, opts);
  const scale = (g.scale ?? 1) * s;
  const dy = g.dy ?? 0;
  const id = `g${Math.random().toString(36).slice(2, 8)}`;
  return `
  <g transform="translate(${tx} ${ty}) translate(400 500) scale(${scale}) translate(-400 -500) translate(0 ${dy})">
    <defs>
      <linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#000" stop-opacity=".14"/>
        <stop offset=".35" stop-color="#fff" stop-opacity=".10"/>
        <stop offset=".7" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".18"/>
      </linearGradient>
    </defs>
    <ellipse cx="400" cy="${kind === "dress" || kind === "skirt" ? 950 : 905}" rx="250" ry="22" fill="#000" opacity=".12"/>
    ${g.back ?? ""}
    <path d="${g.body}" fill="${color}" stroke="${shade(color, -45)}" stroke-width="3" stroke-linejoin="round"/>
    <path d="${g.body}" fill="url(#${id})"/>
    ${g.detail}
  </g>`;
};

const frame = (inner, bg, extra = "", w = 800, h = 1000) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <rect width="${w}" height="${h}" fill="${bg}"/>${extra}${inner}
</svg>`;

/* ---------- editorial scenes ---------- */
for (const sc of SCENES) {
  const inner = sc.items.map((it) => garmentSVG(it.kind, it.color, it.opts || {}, it.x, it.y, it.s)).join("");
  writeFileSync(`${OUT}${sc.slug}.svg`, frame(inner, sc.bg, sc.back || "", sc.w || 800, sc.h || 1000));
}
console.log(`Wrote ${SCENES.length} SVGs to public/art`);
