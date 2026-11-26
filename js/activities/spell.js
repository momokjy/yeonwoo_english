// SPELL: look at the picture and tap the letters in order (c - a - t).
// The first words show faint "ghost" letters to copy; later ones don't.

import { h, shuffle, sample, pick, cap } from '../core/util.js';
import { sfx } from '../core/sfx.js';
import { visual, wiggle, shake, burstAt, PRAISE, markAnswer } from '../core/ui.js';
import { W } from '../content/vocab.js';

const ABC = 'abcdefghijklmnopqrstuvwxyz';

export default async function spell(ctx, act) {
  const { buddy, main } = ctx.layout();
  main.classList.add('spell-main');
  const ghostN = act.ghost ?? 2;

  for (let r = 0; r < act.words.length; r++) {
    ctx.dots(r, act.words.length);
    const v = W[act.words[r]];
    const word = (v.spell || v.t).toLowerCase();
    const letters = [...word];
    const extras = sample([...ABC].filter((c) => !letters.includes(c)), letters.length <= 3 ? 3 : 2);
    const tiles = shuffle([...letters, ...extras]).map((ch) => {
      const t = h('button', { class: 'tile', type: 'button', 'aria-label': ch }, ch);
      t._ch = ch;
      return t;
    });
    const ghost = r < ghostN;
    const slots = letters.map((ch) => h('div', { class: 'slot' + (ghost ? ' ghost' : '') }, ghost ? h('span', { class: 'ghost-letter' }, ch) : null));
    const slotRow = h('div', { class: 'slots' }, ...slots);
    main.replaceChildren(h('div', { class: 'spell-pic pop-in' }, visual(v)), slotRow, h('div', { class: 'tiles' }, ...tiles));

    let pos = 0;
    let wrong = 0;
    let finish;
    const done = new Promise((res) => (finish = res));
    const next = () => tiles.find((t) => !t.classList.contains('used') && t._ch === letters[pos]);
    const mark = () => {
      tiles.forEach((t) => delete t.dataset.answer);
      markAnswer(next());
    };
    mark();

    tiles.forEach((t) =>
      t.addEventListener('click', () => {
        if (ctx.dead || t.classList.contains('used') || pos >= letters.length) return;
        if (t._ch === letters[pos]) {
          t.classList.add('used');
          t.classList.remove('glow');
          t.disabled = true;
          delete t.dataset.answer;
          slots[pos].classList.add('filled');
          slots[pos].replaceChildren(h('span', { class: 'letter pop-in' }, t._ch));
          sfx.pop();
          ctx.talk(buddy, t._ch.toUpperCase(), { rate: 1.05 });
          pos++;
          wrong = 0;
          if (pos === letters.length) finish();
          else mark();
        } else {
          sfx.boing();
          shake(t);
          if (++wrong >= 2) {
            next()?.classList.add('glow');
            ctx.talk(buddy, letters[pos].toUpperCase());
          }
        }
      }),
    );

    ctx.setPrompt(() => buddy.say(cap(word) + '!', { rate: 0.85 }));
    await ctx.say(buddy, r === 0 ? `Let's spell! ${cap(word)}!` : `${cap(word)}!`);
    const nudge = ctx.nudge([
      () => buddy.say(cap(word) + '!', { rate: 0.85 }),
      () => {
        const n = next();
        if (n) wiggle(n);
        return buddy.say(letters[pos].toUpperCase() + '!');
      },
    ]);
    await ctx.$(done);
    nudge.stop();
    await ctx.wait(500);
    sfx.ding();
    burstAt(slotRow, { n: 10 });
    slotRow.classList.add('complete');
    buddy.play('jump');
    await ctx.say(buddy, `${letters.map((c) => c.toUpperCase()).join(', ')}. ${cap(word)}! ${pick(PRAISE)}`);
    await ctx.wait(400);
  }
  ctx.dots(act.words.length, act.words.length);
}
