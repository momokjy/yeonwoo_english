// 부모님 페이지 (Korean). Reached by long-pressing ⚙️ on the home screen.

import { h } from '../core/util.js';
import { store, save, resetProgress, doneCount } from '../core/store.js';
import { englishVoices, onVoices, resetVoice, speak, hasTTS, youngTag } from '../core/speech.js';
import { canRecognize } from '../core/mic.js';
import { mount, go } from '../core/nav.js';
import { ORDER, CHARS, charArt, charName } from '../characters.js';
import { UNITS } from '../content/units.js';

function section(title, ...body) {
  return h('section', { class: 'p-sec' }, h('h2', null, title), ...body);
}
function row(label, ...ctl) {
  return h('label', { class: 'p-row' }, h('span', { class: 'p-label' }, label), h('span', { class: 'p-ctl' }, ...ctl));
}

function shrinkImage(file, max = 360) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/png'));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

export function parentScreen() {
  const s = store.settings;
  const msg = h('div', { class: 'p-msg' });
  const note = (t) => {
    msg.textContent = t;
    msg.classList.add('show');
    clearTimeout(note._t);
    note._t = setTimeout(() => msg.classList.remove('show'), 2200);
  };
  const commit = (t = '저장했어요') => note(save() ? t : '저장 공간이 부족해요. 사진을 줄이거나 지워 주세요.');

  // --- child
  const nameIn = h('input', { type: 'text', value: s.childName, maxlength: '20' });
  const sayIn = h('input', { type: 'text', value: s.childSay, maxlength: '30', placeholder: '예: Yun-woo' });
  nameIn.addEventListener('change', () => {
    s.childName = nameIn.value.trim() || 'Yeonwoo';
    if (!sayIn.value.trim()) s.childSay = s.childName;
    commit();
  });
  sayIn.addEventListener('change', () => {
    s.childSay = sayIn.value.trim() || s.childName;
    commit();
  });
  const testName = h('button', { class: 'p-btn', type: 'button', onClick: () => speak(`Hello, ${s.childSay || s.childName}!`, { pitch: CHARS.momo.pitch }) }, '🔊 들어보기');

  // --- voice
  const voiceSel = h('select');
  const fillVoices = () => {
    const vs = englishVoices();
    const young = vs.filter((v) => youngTag(v));
    const rest = vs.filter((v) => !youngTag(v));
    const opt = (v) => h('option', { value: v.voiceURI, selected: v.voiceURI === s.voiceURI }, `${youngTag(v) ? '⭐ ' : ''}${v.name} (${v.lang})${youngTag(v) ? ' — ' + youngTag(v) : ''}`);
    voiceSel.replaceChildren(h('option', { value: '' }, '자동 선택 (어린 목소리 우선)'), ...young.map(opt), ...rest.map(opt));
  };
  fillVoices();
  onVoices(fillVoices);
  voiceSel.addEventListener('change', () => {
    s.voiceURI = voiceSel.value;
    resetVoice();
    commit();
    speak("Hi! I'm your English friend!", { pitch: CHARS.momo.pitch });
  });
  const rateIn = h('input', { type: 'range', min: '0.6', max: '1.1', step: '0.05', value: String(s.rate) });
  const rateOut = h('span', { class: 'p-val' }, String(s.rate));
  rateIn.addEventListener('input', () => (rateOut.textContent = rateIn.value));
  rateIn.addEventListener('change', () => {
    s.rate = +rateIn.value;
    commit();
    speak("Good morning! Let's play!", { pitch: CHARS.momo.pitch });
  });
  const pitchIn = h('input', { type: 'range', min: '0.8', max: '1.25', step: '0.05', value: String(s.pitch || 1) });
  const pitchOut = h('span', { class: 'p-val' }, String(s.pitch || 1));
  pitchIn.addEventListener('input', () => (pitchOut.textContent = pitchIn.value));
  pitchIn.addEventListener('change', () => {
    s.pitch = +pitchIn.value;
    commit();
    speak("Hi! I'm Momo! Let's play!", { pitch: CHARS.momo.pitch });
  });
  const hearAll = h(
    'button',
    {
      class: 'p-btn',
      type: 'button',
      onClick: async () => {
        for (const id of ORDER) await speak(`Hi! I'm ${charName(id)}!`, { pitch: CHARS[id].pitch });
      },
    },
    '🔊 세 친구 들어보기',
  );

  // --- mic
  const micIn = h('input', { type: 'checkbox', checked: s.mic !== false });
  micIn.addEventListener('change', () => {
    s.mic = micIn.checked;
    commit();
  });

  // --- characters
  const charRows = ORDER.map((id) => {
    const preview = h('div', { class: 'p-char-art' }, charArt(id));
    const nm = h('input', { type: 'text', value: s.names?.[id] || '', placeholder: CHARS[id].name, maxlength: '16' });
    nm.addEventListener('change', () => {
      s.names = { ...(s.names || {}), [id]: nm.value.trim() };
      commit();
    });
    const file = h('input', { type: 'file', accept: 'image/*', class: 'p-file' });
    file.addEventListener('change', async () => {
      const f = file.files?.[0];
      if (!f) return;
      try {
        s.images = { ...(s.images || {}), [id]: await shrinkImage(f) };
        commit('사진을 바꿨어요');
        preview.replaceChildren(charArt(id));
      } catch {
        note('사진을 읽지 못했어요');
      }
    });
    const clear = h(
      'button',
      {
        class: 'p-btn ghost',
        type: 'button',
        onClick: () => {
          if (s.images) delete s.images[id];
          commit('기본 그림으로 돌렸어요');
          preview.replaceChildren(charArt(id));
        },
      },
      '기본 그림',
    );
    const hear = h('button', { class: 'p-btn ghost', type: 'button', onClick: () => speak(`Hi! I'm ${charName(id)}!`, { pitch: CHARS[id].pitch }) }, '🔊');
    return h('div', { class: 'p-char' }, preview, h('div', { class: 'p-char-ctl' }, h('div', { class: 'p-char-line' }, nm, hear), h('div', { class: 'p-char-line' }, h('label', { class: 'p-btn' }, '📷 사진 선택', file), clear)));
  });

  // --- progress
  const prog = h(
    'div',
    { class: 'p-prog' },
    ...UNITS.map((u) => {
      const n = doneCount(u);
      return h('div', { class: 'p-prog-row' }, h('span', { class: 'emo' }, u.icon), h('span', { class: 'p-prog-title' }, u.title), h('span', { class: 'p-prog-bar' }, h('i', { style: { width: (n / u.activities.length) * 100 + '%' } })), h('span', { class: 'p-prog-n' }, `${n}/${u.activities.length}`), store.stickers.includes(u.id) ? h('span', { class: 'emo' }, u.sticker) : null);
    }),
  );

  // --- guide
  const guide = UNITS.map((u) =>
    h(
      'details',
      { class: 'p-guide' },
      h('summary', null, h('span', { class: 'emo' }, u.icon), ' ', u.title, h('small', null, ' — ', u.parent.goal)),
      h(
        'ul',
        null,
        ...u.parent.phrases.map(([en, ko, tip]) =>
          h('li', null, h('button', { class: 'p-say', type: 'button', 'aria-label': '듣기', onClick: () => speak(en.replace(/Yeonwoo/g, s.childSay || 'Yun-woo'), { pitch: 1.1 }) }, '🔊'), h('div', null, h('b', null, en), h('span', { class: 'p-ko' }, ko), tip ? h('div', { class: 'p-tip' }, tip) : null)),
        ),
      ),
    ),
  );

  const resetBtn = h(
    'button',
    {
      class: 'p-btn danger',
      type: 'button',
      onClick: () => {
        if (confirm('학습 기록과 스티커를 모두 지울까요?')) {
          resetProgress();
          note('기록을 지웠어요');
          parentScreen();
        }
      },
    },
    '학습 기록 초기화',
  );

  const support = [];
  if (!hasTTS) support.push('이 브라우저는 영어 음성(TTS)을 지원하지 않아요. Safari 또는 Chrome을 사용해 주세요.');
  if (hasTTS && !englishVoices().length) support.push('영어 음성을 아직 찾지 못했어요. 잠시 뒤 다시 열어 보거나, 기기 설정 → 손쉬운 사용 → 콘텐츠 말하기(또는 읽기 및 말하기) → 음성에서 영어 음성을 내려받아 주세요.');
  if (!canRecognize()) support.push('이 브라우저는 음성 인식을 지원하지 않아요. 말하기 활동에서는 마이크 소리 크기로만 확인하거나, 친구가 잠깐 들어 준 뒤 칭찬해 줘요.');

  const screen = h(
    'div',
    { class: 'screen parent' },
    h('div', { class: 'p-top' }, h('button', { class: 'p-btn', type: 'button', onClick: () => go('#/') }, '← 아이 화면으로'), h('h1', null, '부모님 페이지')),
    h(
      'div',
      { class: 'p-body' },
      section(
        '이렇게 사용해요',
        h(
          'ul',
          { class: 'p-tips' },
          h('li', null, '하루에 한 단원(10~15분)이면 충분해요. 같은 단원을 여러 번 반복해도 좋아요.'),
          h('li', null, '아이 화면에는 한국어 번역이 없어요. 그림·동작·상황으로 뜻을 알아차리게 해 주세요. 뜻을 물으면 번역 대신 몸짓으로 보여 주세요.'),
          h('li', null, '앱에서 배운 문장을 아래 "생활 영어 가이드"를 보고 그날 실제 생활에서 한두 번 써 주세요. 가장 효과가 커요.'),
          h('li', null, '아이가 틀려도 혼나는 화면은 없어요. 말하기는 발음보다 "말해 보는 것"을 칭찬해요.'),
          h('li', null, 'iPhone/iPad는 무음 스위치를 끄고, 소리를 키워 주세요. Safari 공유 버튼 → "홈 화면에 추가"로 앱처럼 쓸 수 있어요.'),
        ),
        ...support.map((t) => h('p', { class: 'p-warn' }, t)),
      ),
      section('아이 이름', row('화면에 보일 이름', nameIn), row('영어 발음용 철자', sayIn, testName), h('p', { class: 'p-help' }, '영어 음성이 이름을 어색하게 읽으면 발음용 철자를 바꿔 보세요. (예: Yeonwoo → Yun-woo, Yuhn-woo)')),
      section(
        '목소리',
        row('영어 목소리', voiceSel),
        row('목소리 높이', h('span', { class: 'p-small' }, '낮게'), pitchIn, h('span', { class: 'p-small' }, '높게'), pitchOut),
        row('말하기 속도', rateIn, rateOut),
        h('div', { class: 'p-row' }, hearAll),
        h(
          'p',
          { class: 'p-help' },
          '친구들 목소리는 기본보다 높고 귀엽게 나와요. 더 어리게 하려면 "목소리 높이"를 올려 보세요. ',
          '목록의 ⭐는 어리게 들리는 목소리예요 (Windows Edge의 "Ana"는 어린이 목소리). ',
          'iPhone/iPad는 설정 → 손쉬운 사용 → "콘텐츠 말하기"(iOS 버전에 따라 "읽기 및 말하기") → 음성 → 영어에서 "Nicky"를 내려받으면 더 앳된 목소리를 쓸 수 있어요. ',
          '기기에 따라 높이 조절이 적용되지 않는 목소리도 있어요.',
        ),
      ),
      section('말하기 활동', row('마이크 사용', micIn), h('p', { class: 'p-help' }, '끄면 친구가 잠깐 들어 주는 척한 뒤 칭찬해요. (마이크 권한을 묻지 않아요) 일부 iPhone/iPad에서 말하기 활동 뒤 소리가 작아지면 이 옵션을 꺼 주세요.')),
      section('친구 캐릭터', h('p', { class: 'p-help' }, '이름과 사진을 바꿀 수 있어요. 아이가 좋아하는 인형 사진 등을 넣어 보세요. 사진은 이 기기 안에만 저장돼요. (표정이 바뀌는 활동과 몸 활동에는 기본 그림이 쓰여요)'), ...charRows),
      section('학습 기록', h('p', null, `⭐ ${store.stars}개 · 스티커 ${store.stickers.length}/${UNITS.length}개`), prog, resetBtn),
      section('생활 영어 가이드', h('p', { class: 'p-help' }, '단원별 핵심 표현이에요. 🔊를 눌러 발음을 듣고 생활 속에서 그대로 써 주세요.'), ...guide),
    ),
    msg,
  );
  mount(screen);
}
