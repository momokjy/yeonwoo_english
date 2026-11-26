// READ: an English word or short sentence appears — read it and touch the
// matching picture. The 🔊 button reads it aloud when help is needed.

import { h, shuffle, sample, pick, flash } from '../core/util.js';
import { sfx } from '../core/sfx.js';
import { card, choose, wiggle, shake, burstAt, PRAISE, markAnswer } from '../core/ui.js';
import { ORDER, charName, fill } from '../characters.js';
import { W, wordText } from '../content/vocab.js';
import { rounds } from './listen.js';

export default async function read(ctx, act) {
  const pool = act.words.map((id) => W[id]);
  const order = rounds(pool, act.rounds || Math.min(5, pool.length));
  const nChoices = Math.min(act.choices || 4, pool.length);
  const { buddy, main } = ctx.layout();
  main.classList.add('read-main');
  const text = h('span', { class: 'read-text' });
  const hear = h('button', { class: 'read-hear', type: 'button', 'aria-label': 'listen' }, h('span', { class: 'emo' }, '🔊'));
  const box = h('div', { class: 'read-word' }, text, hear);
  const grid = h('div', { class: 'grid choices' });
  main.append(box, grid);
  let current = '';
  hear.addEventListener('click', () => {
    sfx.tap();
    ctx.talk(buddy, current, { rate: 0.85 });
  });

  await ctx.say(buddy, act.intro || 'Read the word. Find the picture!');

  for (let r = 0; r < order.length; r++) {
    ctx.dots(r, order.length);
    const ans = order[r];
    const opts = shuffle([ans, ...sample(pool.filter((x) => x !== ans), nChoices - 1)]);
    const chars = shuffle(ORDER);
    current = wordText(act.text || '{t}', ans);
    text.textContent = fill(current);
    flash(box, 'pop-in', 500);
    grid.className = `grid choices g${opts.length}`;
    const cards = opts.map((v, i) => card(v, { label: false, char: v.mood ? chars[i % 3] : undefined, cls: 'deal' }));
    grid.replaceChildren(...cards);
    const right = cards[opts.indexOf(ans)];
    markAnswer(right);
    ctx.setPrompt(() => buddy.say(current, { rate: 0.85 }));

    let wrong = 0;
    for (;;) {
      const nudge = ctx.nudge([() => wiggle(hear), () => buddy.say(current, { rate: 0.85 }), () => wiggle(right)], 9000);
      const picked = await ctx.$(choose(cards));
      nudge.stop();
      if (picked === right) {
        right.classList.add('right');
        sfx.ding();
        burstAt(right);
        buddy.play('jump');
        await ctx.say(buddy, `${pick(PRAISE)} ${current}`);
        break;
      }
      wrong++;
      sfx.boing();
      shake(picked);
      await ctx.say(buddy, wordText(act.nope || "That's {one}.", picked._v, { char: picked._char ? charName(picked._char) : '' }));
      if (wrong >= 2) {
        right.classList.add('glow');
        await ctx.say(buddy, current, { rate: 0.85 });
      }
    }
    await ctx.wait(350);
  }
  ctx.dots(order.length, order.length);
}
