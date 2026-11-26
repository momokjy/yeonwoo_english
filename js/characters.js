// The three friends. Original designs (cute and kid-friendly:
// a pink bunny, a fluffy sky-blue puppy and a little heart fairy).
// Parents can rename them and use their own pictures in the parent page.
//
// All three share one body template (viewBox 200x240) so that body parts,
// wear slots and scrub zones are in the same place for everyone.

import { h, flash } from './core/util.js';
import { store } from './core/store.js';
import { speak } from './core/speech.js';
import { W } from './content/vocab.js';

export const ORDER = ['momo', 'puff', 'lulu'];

export const CHARS = {
  momo: { id: 'momo', name: 'Momo', kind: 'bunny', pitch: 1.55, body: '#FFEAF2', belly: '#FFFFFF', inner: '#FFB9CF', accent: '#FF7FAA', nose: '#FF8FB0', eye: '#B0567E', ears: [[79, 12], [154, 12]] },
  puff: { id: 'puff', name: 'Puff', kind: 'puppy', pitch: 1.4, body: '#EEF8FF', belly: '#FFFFFF', inner: '#CDE9FC', accent: '#B5DDF8', nose: '#6A86A8', eye: '#4F86C2', ears: [[26, 110], [174, 110]] },
  lulu: { id: 'lulu', name: 'Lulu', kind: 'fairy', pitch: 1.7, body: '#FFDDEE', belly: '#FFF5FA', inner: '#FFB3D3', accent: '#FF6FA8', nose: '#FF7FAA', eye: '#B04D8C', ears: [[28, 60], [172, 60]] },
};

export const MOODS = ['happy', 'joy', 'sad', 'angry', 'sleepy', 'scared', 'surprised', 'yummy', 'love', 'hungry'];
const MOOD_EMOJI = { joy: '😄', sad: '😢', angry: '😠', sleepy: '😴', scared: '😱', surprised: '😮', yummy: '😋', love: '😍', hungry: '🤤' };

export const charName = (id) => store.settings.names?.[id]?.trim() || CHARS[id]?.name || id;
export const friendOf = (id) => ORDER[(ORDER.indexOf(id) + 1) % 3];
export const friend2Of = (id) => ORDER[(ORDER.indexOf(id) + 2) % 3];

/** Fill {name} {buddy} {friend} {momo}… placeholders. mode 'say' uses the TTS spelling of the child's name. */
export function fill(text, mode = 'show') {
  const s = store.settings;
  return String(text ?? '').replace(/\{(\w+)\}/g, (m, k) => {
    if (k === 'name') return mode === 'say' ? s.childSay || s.childName || 'friend' : s.childName || 'friend';
    if (k === 'buddy') return charName(s.buddy);
    if (k === 'friend') return charName(friendOf(s.buddy));
    if (k === 'friend2') return charName(friend2Of(s.buddy));
    if (CHARS[k]) return charName(k);
    return m;
  });
}

// ---------------------------------------------------------------- SVG art
// Chibi proportions: big head, tiny body, big sparkly eyes set low on the face.

const L = '#7A4D63';
const SW = `stroke="${L}" stroke-width="3" stroke-linejoin="round"`;
const MOUTH = '#C2456A';
const TONGUE = '#FF9EB2';

export const heartPath = (x, y, s) =>
  `M${x} ${y + s * 0.9} C ${x - s * 1.6} ${y - s * 0.1}, ${x - s * 0.7} ${y - s * 1.25}, ${x} ${y - s * 0.35} C ${x + s * 0.7} ${y - s * 1.25}, ${x + s * 1.6} ${y - s * 0.1}, ${x} ${y + s * 0.9} Z`;

function starPath(cx, cy, r) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.5 : r;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1) + ' ';
  }
  return d + 'Z';
}

const mirror = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${200 - +x} ${y}`);

function backParts(c) {
  if (c.kind === 'bunny')
    return `
    <g class="c-ear c-ear-l"><ellipse cx="74" cy="32" rx="17" ry="44" transform="rotate(-10 74 32)" fill="${c.body}" ${SW}/><ellipse cx="74" cy="34" rx="8.5" ry="32" transform="rotate(-10 74 34)" fill="${c.inner}"/></g>
    <g class="c-ear c-ear-r"><ellipse cx="142" cy="34" rx="16" ry="40" transform="rotate(30 142 34)" fill="${c.body}" ${SW}/><ellipse cx="141" cy="37" rx="8" ry="28" transform="rotate(30 141 37)" fill="${c.inner}"/></g>`;
  if (c.kind === 'puppy') {
    const tail = 'M134 210 C 160 214, 170 190, 158 180 C 150 174, 141 184, 149 190';
    return `<path class="c-tail" d="${tail}" fill="none" stroke="${L}" stroke-width="11" stroke-linecap="round"/><path class="c-tail" d="${tail}" fill="none" stroke="${c.body}" stroke-width="5.5" stroke-linecap="round"/>`;
  }
  // fairy: wings, pointy ears, heart antenna
  const up = 'M72 182 C 42 142, 4 150, 12 178 C 18 198, 52 196, 72 188 Z';
  const low = 'M74 194 C 52 202, 34 222, 48 228 C 60 232, 72 214, 76 198 Z';
  const earL = 'M48 68 L16 36 L36 110 Z';
  const earLi = 'M44 70 L24 48 L36 96 Z';
  return `
    <g class="c-wings" fill="#FFFFFF" fill-opacity=".94" stroke="${c.accent}" stroke-width="2.5" stroke-linejoin="round">
      <path d="${up}"/><path d="${low}"/><path d="${mirror(up)}"/><path d="${mirror(low)}"/>
    </g>
    <path d="${heartPath(30, 172, 5)}" fill="${c.inner}"/><path d="${heartPath(170, 172, 5)}" fill="${c.inner}"/>
    <g class="c-ear c-ear-l"><path d="${earL}" fill="${c.body}" ${SW}/><path d="${earLi}" fill="${c.inner}"/></g>
    <g class="c-ear c-ear-r"><path d="${mirror(earL)}" fill="${c.body}" ${SW}/><path d="${mirror(earLi)}" fill="${c.inner}"/></g>
    <path d="M100 38 Q 93 28 100 21" fill="none" stroke="${L}" stroke-width="3" stroke-linecap="round"/>
    <g class="c-heart"><path d="${heartPath(100, 13, 9.5)}" fill="${c.accent}" ${SW}/><ellipse cx="95" cy="9" rx="2.6" ry="1.8" fill="#fff" opacity=".85"/></g>`;
}

function frontParts(c) {
  if (c.kind === 'bunny') {
    const loop = 'M100 36 C 90 22, 72 26, 74 38 C 76 50, 90 46, 100 36 Z';
    return `<g class="c-bow">
      <path d="${loop}" fill="${c.accent}" ${SW}/><path d="${mirror(loop)}" fill="${c.accent}" ${SW}/>
      <circle cx="86" cy="35" r="2.4" fill="#fff"/><circle cx="80" cy="41" r="1.7" fill="#fff"/><circle cx="114" cy="35" r="2.4" fill="#fff"/><circle cx="120" cy="41" r="1.7" fill="#fff"/>
      <circle cx="100" cy="36" r="5.5" fill="${c.accent}" ${SW}/></g>`;
  }
  if (c.kind === 'puppy') {
    const ear = 'M60 44 C 30 40, 6 80, 8 120 C 9 146, 22 160, 34 152 C 46 144, 46 120, 50 100 C 54 80, 66 56, 60 44 Z';
    return `
    <g class="c-ear c-ear-l"><path d="${ear}" fill="${c.accent}" ${SW}/></g>
    <g class="c-ear c-ear-r"><path d="${mirror(ear)}" fill="${c.accent}" ${SW}/></g>
    <path d="${starPath(100, 52, 10)}" fill="#FFE066" stroke="${L}" stroke-width="2.2" stroke-linejoin="round"/>`;
  }
  return '';
}

function eyesSvg(mood, c) {
  const n = (cx) =>
    `<ellipse cx="${cx}" cy="108" rx="11" ry="13.5" fill="#3E2A37"/><ellipse cx="${cx}" cy="113" rx="6.5" ry="5" fill="${c.eye}" opacity=".8"/>` +
    `<ellipse cx="${cx + 3.6}" cy="102.6" rx="4.6" ry="5.2" fill="#fff"/><circle cx="${cx - 4}" cy="113.5" r="2.1" fill="#fff"/>`;
  const arc = (cx) => `<path d="M${cx - 11} 111 Q${cx} 96 ${cx + 11} 111" fill="none" stroke="${L}" stroke-width="5" stroke-linecap="round"/>`;
  const closed = (cx) => `<path d="M${cx - 11} 107 Q${cx} 116 ${cx + 11} 107" fill="none" stroke="${L}" stroke-width="4.5" stroke-linecap="round"/>`;
  const big = (cx) => `<circle cx="${cx}" cy="108" r="12.5" fill="#fff" stroke="${L}" stroke-width="3"/><circle cx="${cx}" cy="109" r="4.8" fill="#3E2A37"/><circle cx="${cx + 1.6}" cy="107.4" r="1.5" fill="#fff"/>`;
  const wide = (cx) =>
    `<ellipse cx="${cx}" cy="107" rx="12" ry="15.5" fill="#3E2A37"/><ellipse cx="${cx}" cy="113" rx="7" ry="5.5" fill="${c.eye}" opacity=".8"/><ellipse cx="${cx + 4}" cy="100.5" rx="5" ry="5.8" fill="#fff"/><circle cx="${cx - 4.5}" cy="113" r="2.4" fill="#fff"/>`;
  const heart = (cx) => `<path d="${heartPath(cx, 108, 10)}" fill="#FF4F8B" stroke="${L}" stroke-width="2.2"/><ellipse cx="${cx - 5}" cy="103" rx="2.6" ry="1.8" fill="#fff" opacity=".9"/>`;
  switch (mood) {
    case 'joy':
    case 'yummy':
      return arc(70) + arc(130);
    case 'sleepy':
      return closed(70) + closed(130);
    case 'scared':
      return big(70) + big(130);
    case 'surprised':
      return wide(70) + wide(130);
    case 'love':
      return heart(70) + heart(130);
    default:
      return `<g class="c-blink">${n(70)}${n(130)}</g>`;
  }
}

function browsSvg(mood) {
  const s = `fill="none" stroke="${L}" stroke-width="3.5" stroke-linecap="round"`;
  if (mood === 'sad') return `<path d="M56 90 L80 84" ${s}/><path d="M144 90 L120 84" ${s}/>`;
  if (mood === 'angry') return `<path d="M56 83 L81 92" ${s}/><path d="M144 83 L119 92" ${s}/>`;
  if (mood === 'surprised' || mood === 'scared') return `<path d="M58 87 Q70 78 82 87" ${s}/><path d="M118 87 Q130 78 142 87" ${s}/>`;
  return '';
}

function mouthSvg(mood) {
  const st = `fill="none" stroke="${L}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"`;
  const fillM = `fill="${MOUTH}" stroke="${L}" stroke-width="2.8" stroke-linejoin="round"`;
  const open = `<g class="m-open"><path d="M91 124 Q100 141 109 124 Z" ${fillM}/><ellipse cx="100" cy="133" rx="4.6" ry="2.8" fill="${TONGUE}"/></g>`;
  let closed;
  switch (mood) {
    case 'sad':
      closed = `<path d="M93 132 Q100 125 107 132" ${st}/>`;
      break;
    case 'angry':
      closed = `<path d="M91 131 Q95 126 100 129 Q105 126 109 131" ${st}/>`;
      break;
    case 'sleepy':
      closed = `<ellipse cx="100" cy="129" rx="3.6" ry="4.6" ${fillM}/>`;
      break;
    case 'scared':
      closed = `<path d="M88 129 q3 -4 6 0 q3 4 6 0 q3 -4 6 0 q3 4 6 0" ${st}/>`;
      break;
    case 'surprised':
      closed = `<ellipse cx="100" cy="130" rx="6" ry="7.5" ${fillM}/>`;
      break;
    case 'hungry':
      closed = `<ellipse cx="100" cy="129" rx="5.5" ry="6.2" ${fillM}/><path d="M107 132 q3 7 0 10 q-3 -3 0 -10z" fill="#9FD8FF"/>`;
      break;
    case 'yummy':
      closed = `<path d="M89 123 Q100 141 111 123 Z" ${fillM}/><path d="M97 129 Q104 144 110 127 Z" fill="${TONGUE}" stroke="${L}" stroke-width="2"/>`;
      break;
    case 'joy':
    case 'love':
      closed = `<path d="M89 123 Q100 143 111 123 Z" ${fillM}/><ellipse cx="100" cy="134" rx="5" ry="3" fill="${TONGUE}"/>`;
      break;
    default:
      closed = `<path d="M91 125 Q95.5 130.5 100 126 Q104.5 130.5 109 125" ${st}/>`;
  }
  return `<g class="m-closed">${closed}</g>${open}`;
}

function cheeksSvg(mood, c) {
  const col = mood === 'angry' ? '#FF6B6B' : '#FF9EBB';
  const op = mood === 'angry' || mood === 'love' || mood === 'joy' || mood === 'yummy' ? 0.8 : 0.6;
  const [lx, rx] = c.kind === 'puppy' ? [56, 144] : [47, 153];
  const lines = (x) =>
    `<g stroke="#FF7FA3" stroke-width="1.7" stroke-linecap="round" opacity=".75"><path d="M${x - 6} 123 l-2.5 4.5"/><path d="M${x} 123 l-2.5 4.5"/><path d="M${x + 6} 123 l-2.5 4.5"/></g>`;
  return `<ellipse cx="${lx}" cy="126" rx="12.5" ry="7.5" fill="${col}" opacity="${op}"/><ellipse cx="${rx}" cy="126" rx="12.5" ry="7.5" fill="${col}" opacity="${op}"/>${lines(lx + 1)}${lines(rx + 1)}`;
}

function extrasSvg(mood) {
  if (mood === 'sad') return `<path class="c-tear" d="M58 124 q-6 9 0 12 q6 -3 0 -12z" fill="#8FD3FF" stroke="#5AAFE0" stroke-width="1.5"/>`;
  if (mood === 'angry')
    return `<g transform="translate(160 58)" stroke="#FF4D4D" stroke-width="4" stroke-linecap="round" fill="none"><path d="M-9 -3 Q-3 -3 -3 -9"/><path d="M9 -3 Q3 -3 3 -9"/><path d="M-9 3 Q-3 3 -3 9"/><path d="M9 3 Q3 3 3 9"/></g>`;
  if (mood === 'sleepy')
    return `<g class="c-zz" fill="#7C8CE0" font-family="Fredoka, Arial, sans-serif" font-weight="700"><text x="154" y="52" font-size="24">z</text><text x="170" y="34" font-size="17">z</text><text x="182" y="20" font-size="12">z</text></g>`;
  if (mood === 'scared') return `<path d="M160 64 q-6 9 0 12 q6 -3 0 -12z" fill="#8FD3FF" stroke="#5AAFE0" stroke-width="1.5"/>`;
  if (mood === 'love') return `<path class="c-float-heart" d="${heartPath(172, 46, 7)}" fill="#FF6F9C"/>`;
  return '';
}

function noseSvg(c) {
  if (c.kind === 'puppy') return `<ellipse cx="100" cy="118" rx="6.2" ry="4.3" fill="${c.nose}"/><ellipse cx="98" cy="116.6" rx="2" ry="1.1" fill="#fff" opacity=".75"/>`;
  if (c.kind === 'fairy') return `<ellipse cx="100" cy="118" rx="2.8" ry="2.1" fill="${c.nose}"/>`;
  return `<ellipse cx="100" cy="118" rx="4.2" ry="3.1" fill="${c.nose}"/>`;
}

export function charSVG(id, mood = 'happy') {
  const c = CHARS[id] || CHARS.momo;
  const tummyHeart = c.kind === 'fairy' ? `<path d="${heartPath(100, 203, 5.5)}" fill="${c.inner}"/>` : '';
  const arm = (x, r) => `<ellipse cx="${x}" cy="190" rx="10.5" ry="15.5" transform="rotate(${r} ${x} 190)" fill="${c.body}" ${SW}/>`;
  return `<svg class="char-svg kind-${c.kind}" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g class="c-all">
    <ellipse cx="100" cy="236" rx="46" ry="4" fill="#5B3F52" opacity=".08"/>
    <g class="c-back">${backParts(c)}</g>
    <g class="c-body"><ellipse cx="100" cy="197" rx="40" ry="33" fill="${c.body}" ${SW}/><ellipse cx="100" cy="202" rx="24" ry="20" fill="${c.belly}"/>${tummyHeart}</g>
    <g class="c-feet"><ellipse cx="80" cy="228" rx="15.5" ry="10" fill="${c.body}" ${SW}/><ellipse cx="120" cy="228" rx="15.5" ry="10" fill="${c.body}" ${SW}/>
      <ellipse cx="80" cy="230" rx="6" ry="3.5" fill="${c.inner}" opacity=".7"/><ellipse cx="120" cy="230" rx="6" ry="3.5" fill="${c.inner}" opacity=".7"/></g>
    <g class="c-head">
      <ellipse cx="100" cy="100" rx="78" ry="68" fill="${c.body}" ${SW}/>
      <ellipse cx="70" cy="60" rx="17" ry="8" transform="rotate(-28 70 60)" fill="#fff" opacity=".6"/>
      ${frontParts(c)}
      <g class="c-face">${cheeksSvg(mood, c)}${browsSvg(mood)}${eyesSvg(mood, c)}${noseSvg(c)}${mouthSvg(mood)}${extrasSvg(mood)}</g>
    </g>
    <g class="c-arm c-arm-l">${arm(64, 35)}</g>
    <g class="c-arm c-arm-r">${arm(136, -35)}</g>
  </g></svg>`;
}

/** A character picture for cards: the parent's photo if set, otherwise the drawing. */
export function charArt(id, mood = 'happy') {
  const img = store.settings.images?.[id];
  if (img && (mood === 'happy' || mood === 'joy')) return h('img', { class: 'char-img', src: img, alt: charName(id), draggable: 'false' });
  return h('div', { class: 'char-wrap', html: charSVG(id, mood) });
}

// ---------------------------------------------------------------- geometry

export const PARTS = {
  head: { word: 'head', pts: [[100, 48]] },
  eyes: { word: 'eyes', pl: true, pts: [[70, 108], [130, 108]] },
  ears: { word: 'ears', pl: true, pts: null },
  nose: { word: 'nose', pts: [[100, 118]] },
  mouth: { word: 'mouth', pts: [[100, 129]] },
  hands: { word: 'hands', pl: true, pts: [[62, 194], [138, 194]] },
  tummy: { word: 'tummy', pts: [[100, 203]] },
  feet: { word: 'feet', pl: true, pts: [[80, 230], [120, 230]] },
};
export const partPts = (id, part) => (part === 'ears' ? CHARS[id].ears : PARTS[part].pts);

export const ZONES = {
  mouth: { pts: [[100, 128]], r: 18 },
  face: { pts: [[100, 110]], r: 54 },
  hands: { pts: [[62, 194], [138, 194]], r: 22 },
  body: { pts: [[100, 200]], r: 32 },
  head: { pts: [[100, 64]], r: 40 },
};

const SLOTS = {
  head: [{ x: 100, y: 36, s: 44 }],
  eyes: [{ x: 100, y: 109, s: 48 }],
  neck: [{ x: 100, y: 168, s: 28 }],
  body: [{ x: 100, y: 198, s: 36 }],
  legs: [{ x: 100, y: 218, s: 24 }],
  socks: [{ x: 80, y: 224, s: 13 }, { x: 120, y: 224, s: 13, flip: true }],
  feet: [{ x: 80, y: 231, s: 15 }, { x: 120, y: 231, s: 15, flip: true }],
  hand: [{ x: 154, y: 150, s: 44 }],
  hands: [{ x: 62, y: 194, s: 14 }, { x: 138, y: 194, s: 14, flip: true }],
};
const CLASH = { body: ['body'], legs: ['legs'] };

// ---------------------------------------------------------------- Buddy

/** A living character on screen: talks, changes mood, animates, wears things. */
export class Buddy {
  constructor(id, { mood = 'happy', size = 'm', forceSvg = false } = {}) {
    this.id = CHARS[id] ? id : 'momo';
    this.mood = mood;
    this.forceSvg = forceSvg;
    this._tok = 0;
    this.worn = {};
    this.el = h('div', { class: `buddy size-${size}`, 'data-char': this.id });
    this.art = h('div', { class: 'buddy-art' });
    this.layer = h('div', { class: 'wear-layer' });
    this.bubbleEl = h('div', { class: 'bubble', 'aria-live': 'polite' });
    this.thinkEl = h('div', { class: 'think' });
    this.el.append(this.art, this.bubbleEl, this.thinkEl);
    this.render();
    if ('ResizeObserver' in window) {
      this._ro = new ResizeObserver(() => this.art.style.setProperty('--u', this.art.clientWidth / 100 + 'px'));
      this._ro.observe(this.art);
    }
  }

  get name() {
    return charName(this.id);
  }
  get pitch() {
    return CHARS[this.id].pitch;
  }
  get custom() {
    return !this.forceSvg && store.settings.images?.[this.id];
  }

  render() {
    const img = this.custom;
    if (img) {
      this.art.replaceChildren(h('img', { class: 'char-img', src: img, alt: this.name, draggable: 'false' }));
      if (MOOD_EMOJI[this.mood]) this.art.append(h('div', { class: 'mood-badge' }, MOOD_EMOJI[this.mood]));
      this.el.classList.add('custom');
    } else {
      this.art.innerHTML = charSVG(this.id, this.mood);
      this.el.classList.remove('custom');
    }
    this.art.append(this.layer);
  }

  setMood(m) {
    if (m && m !== this.mood) {
      this.mood = m;
      this.render();
    }
    return this;
  }

  play(anim, ms) {
    if (!anim) return;
    const dur = ms || { jump: 900, spin: 900, sleep: 2400, stretch: 1400, clap: 1100, stomp: 900, fly: 1400, swim: 1400, wave: 1500, head: 1200, hop: 1000 }[anim] || 900;
    flash(this.el, 'a-' + anim, dur);
  }

  async say(text, { rate = 1, pitch } = {}) {
    const tok = ++this._tok;
    this.showBubble(fill(text, 'show'));
    this.el.classList.add('talking');
    try {
      await speak(fill(text, 'say'), { pitch: pitch ?? this.pitch, rate });
    } finally {
      if (tok === this._tok) {
        this.el.classList.remove('talking');
        clearTimeout(this._bt);
        this._bt = setTimeout(() => tok === this._tok && this.hideBubble(), 1400);
      }
    }
  }

  showBubble(text, exclusive = true) {
    clearTimeout(this._bt);
    const b = this.bubbleEl;
    // only the friend who is talking shows a bubble
    if (exclusive) document.querySelectorAll('.bubble.show').forEach((x) => x !== b && x.classList.remove('show'));
    b.textContent = text;
    b.className = 'bubble';
    // keep the bubble on screen: try above, then right, then left, then over the head
    b.style.removeProperty('--dx');
    const me = this.art.getBoundingClientRect();
    for (const pos of ['above', 'right', 'left', 'inside']) {
      b.classList.remove('above', 'right', 'left', 'inside');
      b.classList.add(pos);
      // beside the friend: wrap the text into the space that is left
      const room = pos === 'right' ? window.innerWidth - (me.right - me.width * 0.14) - 8 : pos === 'left' ? me.left + me.width * 0.14 - 8 : 0;
      if (room && room < 110) continue;
      b.style.maxWidth = room ? Math.min(room, 330) + 'px' : '';
      const r = b.getBoundingClientRect();
      // a bubble above the head may slide sideways to stay on screen
      const dx = pos === 'above' || pos === 'inside' ? Math.max(0, 6 - r.left) + Math.min(0, window.innerWidth - 6 - r.right) : 0;
      if (r.top >= 60 && r.bottom <= window.innerHeight - 4 && r.left + dx >= 4 && r.right + dx <= window.innerWidth - 4) {
        if (dx) b.style.setProperty('--dx', dx + 'px');
        break;
      }
    }
    b.classList.add('show');
  }

  hideBubble() {
    this.bubbleEl.classList.remove('show');
  }

  think(content) {
    this.thinkEl.replaceChildren();
    if (!content) return this.thinkEl.classList.remove('show');
    this.thinkEl.append(content instanceof Node ? content : h('span', { class: 'emo' }, content));
    this.thinkEl.classList.add('show');
  }

  toVB(x, y) {
    const r = this.art.getBoundingClientRect();
    return [((x - r.left) / r.width) * 200, ((y - r.top) / r.height) * 240];
  }
  toClient(vx, vy) {
    const r = this.art.getBoundingClientRect();
    return { x: r.left + (vx / 200) * r.width, y: r.top + (vy / 240) * r.height };
  }

  partAt(x, y, parts = Object.keys(PARTS)) {
    const [vx, vy] = this.toVB(x, y);
    let best = null;
    let bd = Infinity;
    for (const p of parts)
      for (const [px, py] of partPts(this.id, p)) {
        const d = Math.hypot(px - vx, py - vy);
        if (d < bd) {
          bd = d;
          best = p;
        }
      }
    return bd < 58 ? best : null;
  }
  distTo(part, x, y) {
    const [vx, vy] = this.toVB(x, y);
    return Math.min(...partPts(this.id, part).map(([px, py]) => Math.hypot(px - vx, py - vy)));
  }
  partPoint(part) {
    const [x, y] = partPts(this.id, part)[0];
    return this.toClient(x, y);
  }
  inZone(zone, x, y) {
    const z = ZONES[zone];
    const [vx, vy] = this.toVB(x, y);
    return z.pts.some(([px, py]) => Math.hypot(px - vx, py - vy) <= z.r + 14);
  }
  zonePoint(zone) {
    const [x, y] = ZONES[zone].pts[0];
    return this.toClient(x, y);
  }

  wear(itemId) {
    const v = W[itemId];
    if (!v?.slot) return;
    const slot = v.slot;
    for (const s of [slot, ...(CLASH[slot] || [])]) {
      this.worn[s]?.forEach((el) => el.remove());
      delete this.worn[s];
    }
    this.worn[slot] = SLOTS[slot].map((p) => {
      const el = h('div', { class: 'wear-item' + (p.flip ? ' flip' : ''), style: { left: p.x / 2 + '%', top: p.y / 2.4 + '%', fontSize: `calc(var(--u, 2px) * ${p.s})` } }, v.e);
      this.layer.append(el);
      flash(el, 'pop-in', 500);
      return el;
    });
  }
  unwear() {
    this.layer.replaceChildren();
    this.worn = {};
  }

  destroy() {
    this._ro?.disconnect();
  }
}

/** Several friends saying the same line together. */
export async function sayAll(buddies, text) {
  document.querySelectorAll('.bubble.show').forEach((x) => x.classList.remove('show'));
  buddies.forEach((b) => {
    b._tok++;
    b.showBubble(fill(text), false);
    b.el.classList.add('talking');
  });
  try {
    await speak(fill(text, 'say'), { pitch: 1.55 });
  } finally {
    buddies.forEach((b) => {
      b.el.classList.remove('talking');
      setTimeout(() => b.hideBubble(), 1200);
    });
  }
}
