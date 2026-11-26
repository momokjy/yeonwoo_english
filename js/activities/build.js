// BUILD: listen to a sentence, then tap the word cards in the right order
// to make it ("I" "brush" "my" "teeth."). Then read it together.

import { h, shuffle, pick } from '../core/util.js';
import { sfx } from '../core/sfx.js';
import { visual, wiggle, shake, burstAt, PRAISE, markAnswer } from '../core/ui.js';
import { fill } from '../characters.js';
import { W } from '../content/vocab.js';

function mixed(words) {
  if (words.length < 2) return words.map((w, i) => ({ w, i }));
  let out;
  do out = shuffle(words.map((w, i) => ({ w, i })));
  while (out.every((o, k) => o.i === k));
  return out;
}

export default async function build(ctx, act) {
  const { buddy, main } = ctx.layout();
  main.classList.add('build-main');

  for (let r = 0; r < act.items.length; r++) {
    ctx.dots(r, act.items.length);
    const item = act.items[r];
    const words = fill(item.t).split(/\s+/).filter(Boolean);
    const v = item.v ? W[item.v] : { e: item.e };
    const holes = words.map(() => h('div', { class: 'hole' }));
    const line = h('div', { class: 'sentence-line' }, ...holes);
    const chips = mixed(words).map(({ w }) => {
      const c = h('button', { class: 'wchip', type: 'button' }, w);
      c._w = w;
      return c;
    });
    main.replaceChildren(h('div', { class: 'build-pic pop-in' }, visual(v)), line, h('div', { class: 'wchips' }, ...chips));

    let pos = 0;
    let wrong = 0;
    let finish;
    const done = new Promise((res) => (finish = res));
    const next = () => chips.find((c) => !c.classList.contains('used') && c._w === words[pos]);
    const mark = () => {
      chips.forEach((c) => delete c.dataset.answer);
      markAnswer(next());
    };
    mark();

    chips.forEach((c) =>
      c.addEventListener('click', () => {
        if (ctx.dead || c.classList.contains('used') || pos >= words.length) return;
        if (c._w === words[pos]) {
          c.classList.add('used');
          c.classList.remove('glow');
          c.disabled = true;
          delete c.dataset.answer;
          holes[pos].replaceChildren(h('span', { class: 'placed pop-in' }, c._w));
          holes[pos].classList.add('filled');
          sfx.pop();
          pos++;
          wrong = 0;
          if (pos === words.length) finish();
          else mark();
        } else {
          sfx.boing();
          shake(c);
          if (++wrong >= 2) next()?.classList.add('glow');
        }
      }),
    );

    ctx.setPrompt(() => buddy.say(item.t, { rate: 0.85 }));
    await ctx.say(buddy, item.t, { rate: 0.9 });
    if (r === 0) await ctx.say(buddy, act.intro || 'Put the words in order!');
    const nudge = ctx.nudge([
      () => buddy.say(item.t, { rate: 0.85 }),
      () => {
        const n = next();
        if (n) wiggle(n);
      },
    ]);
    await ctx.$(done);
    nudge.stop();
    sfx.ding();
    line.classList.add('complete');
    burstAt(line, { n: 10 });
    buddy.play('jump');
    await ctx.say(buddy, pick(PRAISE));
    await ctx.say(buddy, item.t, { rate: 0.9 });
    await ctx.wait(500);
  }
  ctx.dots(act.items.length, act.items.length);
}
