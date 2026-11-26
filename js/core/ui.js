// Shared visual building blocks: picture cards, hints, particles, scenes.

import { h, flash, centerOf, pick } from './util.js';
import { charSVG, charArt, fill } from '../characters.js';
import { store } from './store.js';
import { speak, FAST } from './speech.js';

/** Test mode only (?fast): mark the right answer so automated play-through can find it. */
export function markAnswer(el, val = '1') {
  if (FAST && el) el.dataset.answer = val;
}

export const TYPE_ICON = { learn: '👀', listen: '👂', drag: '✋', touch: '👆', scrub: '🧼', count: '🔢', say: '🎤', talk: '💬', move: '🕺', balloons: '🎈', read: '📖', spell: '🔤', build: '🧩' };
export const PRAISE = ['Yes!', 'Great!', 'Good job!', "That's right!", 'Wow!', 'You got it!', 'Super!'];

// ---------------------------------------------------------------- pictures

/** A tiny kawaii face (eyes, smile, blush) centred on (x, y), scale s. */
export function faceSVG(x, y, s = 1) {
  const e = (dx) => `<ellipse cx="${x + dx * s}" cy="${y}" rx="${3.4 * s}" ry="${4.2 * s}" fill="#4A2F3F"/><circle cx="${x + dx * s + 1.2 * s}" cy="${y - 1.6 * s}" r="${1.4 * s}" fill="#fff"/>`;
  return (
    e(-9) +
    e(9) +
    `<path d="M${x - 3.5 * s} ${y + 6 * s} Q${x} ${y + 9.5 * s} ${x + 3.5 * s} ${y + 6 * s}" fill="none" stroke="#4A2F3F" stroke-width="${1.8 * s}" stroke-linecap="round"/>` +
    `<ellipse cx="${x - 15 * s}" cy="${y + 5 * s}" rx="${4.5 * s}" ry="${2.6 * s}" fill="#FF7FA8" opacity=".55"/><ellipse cx="${x + 15 * s}" cy="${y + 5 * s}" rx="${4.5 * s}" ry="${2.6 * s}" fill="#FF7FA8" opacity=".55"/>`
  );
}

export function blobSVG(color) {
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8 C 66 6, 74 20, 86 26 C 98 34, 94 52, 92 62 C 90 78, 76 92, 58 92 C 44 94, 30 92, 20 82 C 8 70, 6 54, 12 40 C 18 26, 34 10, 50 8 Z" fill="${color}" stroke="rgba(0,0,0,.12)" stroke-width="3"/><ellipse cx="34" cy="28" rx="11" ry="6" fill="#fff" opacity=".5" transform="rotate(-30 34 28)"/>${faceSVG(52, 54, 1.25)}</svg>`;
}

export function balloonSVG(color) {
  return `<svg viewBox="0 0 100 150" aria-hidden="true"><path d="M50 108 Q 46 128 54 150" fill="none" stroke="#9B8A95" stroke-width="2"/><ellipse cx="50" cy="52" rx="40" ry="48" fill="${color}" stroke="rgba(0,0,0,.12)" stroke-width="2"/><path d="M44 100 L56 100 L50 110 Z" fill="${color}"/><ellipse cx="32" cy="30" rx="8" ry="13" fill="#fff" opacity=".45" transform="rotate(25 32 30)"/>${faceSVG(50, 56, 1.05)}</svg>`;
}

export function numberArt(n) {
  const dots = h('div', { class: 'num-dots' });
  for (let i = 0; i < n; i++) dots.append(h('i'));
  return h('div', { class: 'vis vis-num' }, h('div', { class: 'num-digit' }, String(n)), dots);
}

/** The picture for a vocab item. */
export function visual(v, { char } = {}) {
  if (!v) return h('div', { class: 'vis' });
  if (v.color) return h('div', { class: 'vis vis-color', html: blobSVG(v.color) });
  if (v.mood) return h('div', { class: 'vis vis-mood', html: charSVG(char || v.char || store.settings.buddy, v.mood) });
  if (v.char) return h('div', { class: 'vis vis-char' }, charArt(v.char));
  if (v.num != null) return numberArt(v.num);
  return h('div', { class: 'vis vis-emo' }, h('span', { class: 'emo' }, v.e));
}

export function card(v, { label = true, cls = '', char } = {}) {
  const b = h('button', { class: `card ${cls}`, type: 'button', 'aria-label': fill(v.t) });
  b.append(visual(v, { char }));
  if (label) b.append(h('div', { class: 'card-label' }, fill(v.label || v.t)));
  b._v = v;
  b._char = char;
  return b;
}

export function iconBtn(emoji, label, onClick, cls = '') {
  return h('button', { class: `icon-btn ${cls}`, type: 'button', 'aria-label': label, onClick }, h('span', { class: 'emo' }, emoji));
}

// ---------------------------------------------------------------- waiting for taps

/** Resolve with whichever button is tapped first. */
export function choose(buttons) {
  return new Promise((resolve) => {
    let done = false;
    const fs = buttons.map((b) => {
      const f = () => {
        if (done || b.disabled) return;
        done = true;
        buttons.forEach((x, i) => x.removeEventListener('click', fs[i]));
        resolve(b);
      };
      b.addEventListener('click', f);
      return f;
    });
  });
}

export const wiggle = (el) => flash(el, 'wiggle', 900);
export const shake = (el) => flash(el, 'shake', 600);
export const bounce = (el) => flash(el, 'bounce', 700);

// ---------------------------------------------------------------- effects

export function flyTo(el, to, { dur = 650, scale = 0.35, fade = true } = {}) {
  const a = el.getBoundingClientRect();
  const b = to instanceof Element ? centerOf(to) : to;
  const clone = el.cloneNode(true);
  clone.classList.remove('dragging', 'grab', 'wiggle', 'bounce');
  clone.classList.add('flying');
  Object.assign(clone.style, { position: 'fixed', left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px', margin: '0', zIndex: 900, pointerEvents: 'none', transform: 'none', transition: 'none' });
  document.body.append(clone);
  const tx = b.x - (a.left + a.width / 2);
  const ty = b.y - (a.top + a.height / 2);
  if (!clone.animate) {
    clone.remove();
    return Promise.resolve();
  }
  const an = clone.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${tx * 0.5}px, ${ty * 0.5 - 60}px) scale(${(1 + scale) / 2 + 0.15})`, opacity: 1, offset: 0.5 },
      { transform: `translate(${tx}px, ${ty}px) scale(${scale})`, opacity: fade ? 0.1 : 1 },
    ],
    { duration: dur, easing: 'ease-in-out' },
  );
  return an.finished.then(
    () => clone.remove(),
    () => clone.remove(),
  );
}

export function burst(x, y, { emojis = ['✨', '⭐', '💖'], n = 9, dist = 90 } = {}) {
  for (let i = 0; i < n; i++) {
    const s = h('span', { class: 'particle emo', style: { left: x + 'px', top: y + 'px' } }, pick(emojis));
    document.body.append(s);
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.5;
    const d = dist * (0.6 + Math.random() * 0.6);
    const an = s.animate?.(
      [
        { transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(1.1)`, opacity: 0 },
      ],
      { duration: 800 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.4,1)' },
    );
    if (an) an.finished.then(() => s.remove(), () => s.remove());
    else setTimeout(() => s.remove(), 900);
  }
}

export function burstAt(el, opts) {
  const c = centerOf(el);
  burst(c.x, c.y, opts);
}

export function confetti(n = 34) {
  const layer = h('div', { class: 'confetti', 'aria-hidden': 'true' });
  const em = ['⭐', '💖', '🌸', '✨', '🎀', '💫', '🌟'];
  for (let i = 0; i < n; i++) {
    layer.append(
      h('span', { class: 'emo', style: { left: Math.random() * 100 + '%', animationDelay: Math.random() * 0.7 + 's', animationDuration: 1.8 + Math.random() * 1.2 + 's', fontSize: 18 + Math.random() * 22 + 'px' } }, pick(em)),
    );
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 3600);
}

/** A bouncing pointing hand over an element. Returns a remover. */
export function pointAt(el, { offsetY = 0.55 } = {}) {
  const hand = h('div', { class: 'hint-hand emo', 'aria-hidden': 'true' }, '👆');
  document.body.append(hand);
  const place = () => {
    if (!el.isConnected) return stop();
    const r = el.getBoundingClientRect();
    hand.style.left = r.left + r.width / 2 + 'px';
    hand.style.top = r.top + r.height * offsetY + 'px';
  };
  place();
  const iv = setInterval(place, 250);
  function stop() {
    clearInterval(iv);
    hand.remove();
  }
  setTimeout(stop, 6000);
  return stop;
}

/** A hand that drags from one element (or point) to another. Returns a remover. */
export function dragHint(from, to) {
  const hand = h('div', { class: 'hint-hand drag emo', 'aria-hidden': 'true' }, '👆');
  document.body.append(hand);
  const a = from instanceof Element ? centerOf(from) : from;
  const b = to instanceof Element ? centerOf(to) : to;
  hand.style.left = a.x + 'px';
  hand.style.top = a.y + 'px';
  const an = hand.animate?.(
    [
      { transform: 'translate(-30%, 0) scale(1)', opacity: 0 },
      { transform: 'translate(-30%, 0) scale(.9)', opacity: 1, offset: 0.15 },
      { transform: `translate(calc(-30% + ${b.x - a.x}px), ${b.y - a.y}px) scale(.9)`, opacity: 1, offset: 0.75 },
      { transform: `translate(calc(-30% + ${b.x - a.x}px), ${b.y - a.y}px) scale(1)`, opacity: 0 },
    ],
    { duration: 1700, iterations: 2, easing: 'ease-in-out' },
  );
  const stop = () => hand.remove();
  if (an) an.finished.then(stop, stop);
  else setTimeout(stop, 3400);
  return stop;
}

// ---------------------------------------------------------------- narrator

export class Narrator {
  constructor(host) {
    this.el = h('div', { class: 'caption' });
    this._t = 0;
    host.append(this.el);
  }
  async say(text, { rate = 0.95 } = {}) {
    const tok = ++this._t;
    this.el.textContent = fill(text);
    this.el.classList.add('show');
    try {
      await speak(fill(text, 'say'), { pitch: 1.35, rate });
    } finally {
      setTimeout(() => tok === this._t && this.el.classList.remove('show'), 1500);
    }
  }
}

// ---------------------------------------------------------------- scenes

const DECO = {
  sky: () => [cloud(8, 14, 1), cloud(62, 8, 0.8), cloud(84, 30, 0.6), h('div', { class: 'd-hill' })],
  park: () => [cloud(10, 10, 0.9), cloud(70, 6, 0.7), h('div', { class: 'd-hill' }), h('div', { class: 'd-hill back' }), emo('🌳', 2, 58, 9), emo('🌳', 90, 60, 7), emo('🌼', 18, 88, 3), emo('🌷', 80, 90, 3)],
  bedroom: () => [h('div', { class: 'd-floor wood' }), h('div', { class: 'd-window' }, h('span', { class: 'emo' }, '🌤️')), emo('🪴', 92, 70, 6)],
  kitchen: () => [h('div', { class: 'd-floor tiles' }), h('div', { class: 'd-window' }, h('span', { class: 'emo' }, '🌻')), emo('🫖', 92, 66, 5)],
  playroom: () => [h('div', { class: 'd-floor rug' }), h('div', { class: 'd-bunting' }), emo('🪁', 92, 30, 5)],
  bathroom: () => [h('div', { class: 'd-floor tiles blue' }), emo('🫧', 6, 30, 4), emo('🫧', 92, 22, 3), emo('🦆', 93, 80, 4)],
  classroom: () => [h('div', { class: 'd-floor wood' }), h('div', { class: 'd-board' }, 'A B C'), emo('🌍', 6, 26, 5), emo('🖍️', 93, 74, 4)],
  night: () => [h('div', { class: 'd-floor wood dark' }), emo('🌙', 88, 10, 7), ...[12, 30, 52, 70, 20, 62].map((x, i) => emo('✨', x, 6 + (i % 3) * 9, 2.5, 'twinkle'))],
};

function emo(ch, x, y, size, cls = '') {
  return h('span', { class: 'd-emo emo ' + cls, style: { left: x + '%', top: y + '%', fontSize: `min(${size}vw, ${size * 1.3}vh)` } }, ch);
}
function cloud(x, y, s) {
  return h('div', { class: 'd-cloud', style: { left: x + '%', top: y + '%', transform: `scale(${s})` } });
}

export function setScene(screen, name = 'sky') {
  screen.classList.add('scene-' + name);
  const deco = h('div', { class: 'scene-deco', 'aria-hidden': 'true' }, ...(DECO[name] || DECO.sky)());
  screen.prepend(deco);
  return deco;
}

/** Weather / light effects over a screen: 'rain' | 'snow' | 'sun' | 'night' | null */
export function setFx(screen, name) {
  screen.querySelector('.fx-layer')?.remove();
  if (name) screen.dataset.fx = name;
  else delete screen.dataset.fx;
  if (!name) return;
  const layer = h('div', { class: 'fx-layer fx-' + name, 'aria-hidden': 'true' });
  if (name === 'rain')
    for (let i = 0; i < 46; i++)
      layer.append(h('i', { class: 'drop', style: { left: Math.random() * 100 + '%', animationDelay: Math.random() * 1.2 + 's', animationDuration: 0.6 + Math.random() * 0.4 + 's' } }));
  if (name === 'snow')
    for (let i = 0; i < 34; i++)
      layer.append(h('i', { class: 'flake', style: { left: Math.random() * 100 + '%', animationDelay: Math.random() * 4 + 's', animationDuration: 3 + Math.random() * 3 + 's', fontSize: 12 + Math.random() * 16 + 'px' } }, '❄'));
  if (name === 'sun') layer.append(h('div', { class: 'big-sun emo' }, '☀️'));
  if (name === 'night') {
    layer.append(h('div', { class: 'night-moon emo' }, '🌙'));
    for (let i = 0; i < 14; i++)
      layer.append(h('i', { class: 'night-star emo', style: { left: Math.random() * 96 + '%', top: Math.random() * 45 + '%', animationDelay: Math.random() * 2 + 's' } }, '✦'));
  }
  screen.append(layer);
}
