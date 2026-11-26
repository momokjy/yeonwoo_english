// LISTEN: the friend asks ("Where is the apple?") and the child taps the
// right picture. Wrong taps are named ("That's a banana.") so they also teach.

import { h, shuffle, sample, pick } from '../core/util.js';
import { sfx } from '../core/sfx.js';
import { card, choose, wiggle, shake, burstAt, PRAISE, markAnswer } from '../core/ui.js';
import { ORDER, charName } from '../characters.js';
import { W, wordText } from '../content/vocab.js';

export function rounds(pool, n) {
  const out = [];
  while (out.length < n) {
    for (const v of shuffle(pool)) {
      if (out.length >= n) break;
      if (out[out.length - 1] !== v) out.push(v);
    }
  }
  return out;
}

export default async function listen(ctx, act) {
  const pool = act.words.map((id) => W[id]);
  const order = rounds(pool, act.rounds || Math.min(5, pool.length));
  const nChoices = Math.min(act.choices || 4, pool.length); // 7-year-olds: four pictures
  const { buddy, main } = ctx.layout();
  const grid = h('div', { class: 'grid choices' });
  main.append(grid);

  await ctx.say(buddy, act.intro || 'Listen and touch!');

  for (let r = 0; r < order.length; r++) {
    ctx.dots(r, order.length);
    const ans = order[r];
    const opts = shuffle([ans, ...sample(pool.filter((x) => x !== ans), nChoices - 1)]);
    const chars = shuffle(ORDER);
    grid.className = `grid choices g${opts.length}`;
    const cards = opts.map((v, i) => card(v, { label: !!act.labels, char: v.mood ? chars[i % 3] : undefined, cls: 'deal' }));
    grid.replaceChildren(...cards);
    const right = cards[opts.indexOf(ans)];
    markAnswer(right);
    const extra = (c) => ({ char: c._char ? charName(c._char) : '' });
    const q = wordText(act.q || 'Where is the {t}?', ans, extra(right));
    const ask = () => buddy.say(q);
    ctx.setPrompt(ask);
    ctx.talk(buddy, q);

    let wrong = 0;
    for (;;) {
      const nudge = ctx.nudge([ask, () => wiggle(right)], 7000);
      const picked = await ctx.$(choose(cards));
      nudge.stop();
      if (picked === right) {
        right.classList.add('right');
        sfx.ding();
        burstAt(right);
        buddy.play('jump');
        await ctx.say(buddy, `${pick(PRAISE)} ${wordText(act.ok || '{T}!', ans, extra(right))}`);
        break;
      }
      wrong++;
      sfx.boing();
      shake(picked);
      buddy.play('shake', 600);
      await ctx.say(buddy, wordText(act.nope || "That's {one}.", picked._v, extra(picked)));
      if (wrong >= 2) right.classList.add('glow');
      await ctx.say(buddy, q);
    }
    await ctx.wait(350);
  }
  ctx.dots(order.length, order.length);
}
