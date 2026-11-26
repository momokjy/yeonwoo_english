// COUNT: tap each thing to count it out loud, then answer "How many?".

import { h, shuffle, cap, NUM, rand, flash } from '../core/util.js';
import { sfx } from '../core/sfx.js';
import { choose, wiggle, shake, burstAt, numberArt, pointAt, markAnswer } from '../core/ui.js';
import { W } from '../content/vocab.js';

export default async function count(ctx, act) {
  const { buddy, main } = ctx.layout();
  const field = h('div', { class: 'count-field' });
  main.append(field);

  for (let r = 0; r < act.rounds.length; r++) {
    ctx.dots(r, act.rounds.length);
    const rd = act.rounds[r];
    const v = W[rd.v];
    const n = rd.n;
    const word = (k) => (k === 1 ? v.t : v.pl || v.t);
    field.className = 'count-field' + (n > 12 ? ' many lots' : n > 6 ? ' many' : '');
    let k = 0;
    let tok = 0;
    let counted;
    const countedP = new Promise((res) => (counted = res));
    const things = Array.from({ length: n }, () => {
      const b = h('button', { class: 'thing', type: 'button', style: { '--r': rand(-12, 12).toFixed(0) + 'deg' } }, h('span', { class: 'emo' }, v.e));
      b.addEventListener('click', async () => {
        if (ctx.dead) return;
        const my = ++tok;
        if (b.dataset.n) {
          sfx.tap();
          flash(b, 'bounce');
          await ctx.talk(buddy, cap(NUM[+b.dataset.n]) + '!');
          return;
        }
        k++;
        b.dataset.n = k;
        b.append(h('i', { class: 'badge' }, String(k)));
        b.classList.add('counted');
        sfx.pop();
        flash(b, 'bounce');
        await ctx.talk(buddy, cap(NUM[k]) + '!', { rate: 1.05 });
        if (k === n && my === tok) counted();
      });
      return b;
    });
    field.replaceChildren(...things);
    things.forEach((t, i) => setTimeout(() => flash(t, 'deal', 600), i * 60));

    const intro = `Let's count the ${word(2)}!`;
    ctx.setPrompt(() => buddy.say(intro));
    await ctx.say(buddy, intro);
    let stopHand = r === 0 ? pointAt(things[0]) : null;
    field.addEventListener('pointerdown', () => stopHand?.(), { once: true });
    const nudge = ctx.nudge([
      () => {
        const t = things.find((x) => !x.dataset.n);
        if (t) wiggle(t);
        return buddy.say('Tap and count!');
      },
    ]);
    await ctx.$(countedP);
    nudge.stop();
    stopHand?.();
    sfx.ding();
    things.forEach((t, i) => setTimeout(() => flash(t, 'bounce'), i * 50));
    await ctx.say(buddy, `${cap(NUM[n])} ${word(n)}!`);

    if (act.ask !== false && rd.ask !== false) {
      const opts = shuffle([...new Set([n - 1, n, n + 1].map((x) => (x < 1 ? n + 2 : x > 20 ? n - 2 : x)))]);
      const cards = opts.map((x) => {
        const c = h('button', { class: 'card num-card', type: 'button' }, numberArt(x));
        c._n = x;
        if (x === n) markAnswer(c);
        return c;
      });
      const panel = h('div', { class: 'grid choices g' + cards.length }, ...cards);
      field.replaceChildren(panel);
      const q = `How many ${word(2)}?`;
      ctx.setPrompt(() => buddy.say(q));
      await ctx.say(buddy, q);
      let wrong = 0;
      for (;;) {
        const nudge2 = ctx.nudge([() => buddy.say(q), () => wiggle(cards.find((c) => c._n === n))], 7000);
        const picked = await ctx.$(choose(cards));
        nudge2.stop();
        if (picked._n === n) {
          picked.classList.add('right');
          sfx.ding();
          burstAt(picked);
          buddy.play('jump');
          await ctx.say(buddy, `Yes! ${cap(NUM[n])}!`);
          break;
        }
        wrong++;
        sfx.boing();
        shake(picked);
        await ctx.say(buddy, `${cap(NUM[picked._n])}? Hmm... ${q}`);
        if (wrong >= 2) cards.find((c) => c._n === n).classList.add('glow');
      }
    }
    await ctx.wait(300);
  }
  ctx.dots(act.rounds.length, act.rounds.length);
}
