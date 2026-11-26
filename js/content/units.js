// A child's day, in ten little units. Each unit = a few short activities
// (about 10–15 minutes in total). Child-facing text is English only;
// `parent` holds the Korean guide shown on the parent page.

const feelingReply = {
  happy: [{ mood: 'joy', anim: 'jump', c: "You're happy! I'm happy, too!" }],
  sad: [{ mood: 'sad', c: "Oh, you're sad." }, { mood: 'love', anim: 'wiggle', sfx: 'magic', c: "Here's a big hug!" }, { mood: 'happy', c: 'I love you, {name}!' }],
  angry: [{ mood: 'surprised', c: "You're angry? It's okay." }, { anim: 'stretch', c: "Let's take a deep breath. In... and out." }, { mood: 'happy', c: 'Better?' }],
  sleepy: [{ mood: 'sleepy', c: "You're sleepy? Me too! Yawn!" }, { mood: 'happy', anim: 'shake', c: 'Wake up, wake up!' }],
};

const colorLike = (c) => ({
  v: c,
  t: `I like ${c}!`,
  then: [{ mood: 'joy', anim: 'jump', c: `${c.charAt(0).toUpperCase() + c.slice(1)}! I like ${c}, too!` }, { mood: 'happy', say: { t: `I like ${c}!`, v: c } }],
});

export const UNITS = [
  // ------------------------------------------------------------------ 1
  {
    id: 'hello',
    title: 'Hello, Friends!',
    icon: '👋',
    color: '#FFD1E3',
    scene: 'park',
    sticker: '🌈',
    activities: [
      {
        type: 'talk',
        title: 'Meet Friends',
        cast: ['momo', 'puff', 'lulu'],
        steps: [
          { who: 'momo', anim: 'jump', sfx: 'pop', c: "Hello! I'm {momo}!" },
          { who: 'puff', anim: 'jump', sfx: 'pop', c: "Hi! I'm {puff}!" },
          { who: 'lulu', anim: 'jump', sfx: 'pop', c: "Hello! I'm {lulu}!" },
          { who: 'momo', c: "What's your name?" },
          { who: 'momo', say: { t: 'My name is {name}.', e: '🧒', key: ['name'] } },
          { all: 'Hello, {name}!', anim: 'jump' },
          { choice: [{ e: '👋', t: 'Hello!' }, { e: '😄', t: 'Hi!' }] },
          { all: 'Yay! We are friends!', anim: 'jump', sfx: 'fanfare' },
        ],
      },
      { type: 'listen', title: 'Who Is It?', words: ['momo', 'puff', 'lulu'], q: 'Where is {t}?', ok: '{t}!', nope: "That's {t}.", rounds: 4, intro: 'Listen! Find the friend!' },
      {
        type: 'talk',
        title: 'How Are You?',
        steps: [
          { anim: 'wave', c: 'Hi, {name}! How are you?' },
          {
            choice: [
              { e: '👍', t: "I'm good!", then: [{ anim: 'jump', c: "Great! I'm good, too!" }] },
              { e: '😊', t: "I'm happy!", then: [{ mood: 'joy', anim: 'jump', c: "Yay! I'm happy, too!" }] },
              { e: '😴', t: "I'm sleepy.", then: [{ mood: 'sleepy', c: 'Me too! Yawn!' }, { mood: 'happy', anim: 'shake', c: 'Wake up! Wake up!' }] },
            ],
          },
          { mood: 'happy', c: 'Now ask me! How are you?' },
          { say: { t: 'How are you?', e: '❓', key: ['how', 'you'] } },
          { mood: 'joy', anim: 'jump', c: "I'm great! Thank you!" },
        ],
      },
      {
        type: 'say',
        title: 'Say Hello',
        items: [
          { t: 'Hello!', e: '👋' },
          { t: 'My name is {name}.', e: '🧒', key: ['name'] },
          { t: 'Bye-bye!', e: '🙋' },
        ],
      },
    ],
    parent: {
      goal: '인사와 자기소개 — 영어로 처음 친구를 만나요.',
      phrases: [
        ['Hello! / Hi!', '안녕!', '어린이집 갈 때, 처음 만날 때 손을 흔들며 인사해 주세요.'],
        ["What's your name?", '이름이 뭐야?', '인형을 들고 역할놀이로 물어봐 주세요. 아이가 인형에게 물어보게 해도 좋아요.'],
        ['My name is Yeonwoo.', '내 이름은 연우야.', '"My name is…" 뒤의 이름만 바꿔 가족 이름으로 놀이해요.'],
        ['How are you? — I\'m good!', '기분 어때? — 좋아!', '하원 후 매일 같은 질문을 해 주세요.'],
        ['Bye-bye! / See you!', '잘 가! / 또 봐!', '헤어질 때 항상 같은 표현을 쓰면 금방 익숙해져요.'],
      ],
    },
  },

  // ------------------------------------------------------------------ 2
  {
    id: 'morning',
    title: 'Good Morning!',
    icon: '🌞',
    color: '#FFE9A8',
    scene: 'bedroom',
    sticker: '🌞',
    activities: [
      {
        type: 'talk',
        title: 'Wake Up!',
        steps: [
          { mood: 'sleepy', n: 'Shh! {buddy} is sleeping.' },
          { n: "Let's wake {buddy} up! Tap, tap, tap!", tap: 3, taps: ['Mmm...', 'Zzz...', 'Hmm?'], hint: 'Tap, tap, tap!' },
          { mood: 'surprised', sfx: 'pop', wait: 300 },
          { mood: 'happy', anim: 'stretch', c: 'Good morning, {name}!' },
          { say: { t: 'Good morning!', e: '🌞', key: ['morning'] } },
          { mood: 'joy', anim: 'jump', c: "Let's get up!" },
        ],
      },
      { type: 'learn', title: 'Morning Time', words: ['wakeup', 'brush', 'washface', 'dress', 'breakfast'], cover: '🌅' },
      {
        type: 'scrub',
        title: 'Brush & Wash',
        tasks: [
          { pre: 'Oh no! Germs!', say: 'Brush your teeth!', tool: '🪥', zone: 'mouth', dirt: 'germ', chant: 'Brush, brush, brush!', done: 'Clean teeth! Sparkle, sparkle!' },
          { pre: 'My face is dirty!', say: 'Wash your face!', tool: '🧼', zone: 'face', dirt: 'mud', chant: 'Wash, wash, wash!', done: 'Clean face! Thank you!' },
        ],
      },
      { type: 'listen', title: 'What Do We Do?', words: ['wakeup', 'brush', 'washface', 'dress', 'breakfast'], q: '{T}!', ok: '{T}!', nope: 'No, no!', intro: 'Listen and touch!' },
    ],
    parent: {
      goal: '아침 루틴 — 일어나기, 양치, 세수, 옷 입기, 아침 먹기',
      phrases: [
        ['Good morning!', '좋은 아침!', '커튼을 열며 매일 아침 같은 말로 깨워 주세요.'],
        ['Wake up, sleepyhead!', '일어나, 잠꾸러기!', '간지럼과 함께 말하면 아이가 좋아해요.'],
        ['Brush your teeth.', '이 닦자.', '양치할 때 "Brush, brush, brush!" 리듬으로 함께 불러 보세요.'],
        ['Wash your face.', '세수하자.', ''],
        ['Get dressed.', '옷 입자.', ''],
        ["Let's eat breakfast.", '아침 먹자.', ''],
      ],
    },
  },

  // ------------------------------------------------------------------ 3
  {
    id: 'breakfast',
    title: 'Yummy Breakfast',
    icon: '🍓',
    color: '#FFD9C7',
    scene: 'kitchen',
    sticker: '🍓',
    activities: [
      { type: 'learn', title: 'Yummy Food', words: ['apple', 'banana', 'milk', 'bread', 'egg', 'strawberry'] },
      { type: 'listen', title: 'Find the Food', words: ['apple', 'banana', 'milk', 'bread', 'egg', 'strawberry'], q: 'Where is the {t}?', ok: '{T}!' },
      {
        type: 'drag',
        mode: 'eat',
        title: 'Feed Me!',
        pool: ['apple', 'banana', 'milk', 'bread', 'egg', 'strawberry'],
        rounds: [{ want: 'banana' }, { want: 'apple' }, { want: 'milk' }, { want: 'strawberry' }],
      },
      {
        type: 'talk',
        title: 'Yes, Please!',
        steps: [
          { prop: 'milk', c: '{name}, do you want some milk?' },
          {
            choice: [
              { e: '👍', t: 'Yes, please!', then: [{ c: 'Here you are!', propFx: 'toMe' }, { say: { t: 'Thank you!', e: '🙏', key: ['thank'] } }, { mood: 'joy', c: "You're welcome!" }] },
              {
                e: '🙅',
                t: 'No, thank you.',
                then: [
                  { prop: 'juice', c: 'Okay! Do you want some juice?' },
                  {
                    choice: [
                      { e: '👍', t: 'Yes, please!', then: [{ c: 'Here you are!', propFx: 'toMe' }, { say: { t: 'Thank you!', e: '🙏', key: ['thank'] } }] },
                      { e: '🙅', t: 'No, thank you.', then: [{ prop: null, c: 'Okay!' }] },
                    ],
                  },
                ],
              },
            ],
          },
          { prop: null, mood: 'hungry', c: "Oh! I'm hungry, too!" },
          { c: 'Can I have a cookie, please?', prop: 'cookie' },
          { tapProp: true, hint: 'Give the cookie!' },
          { say: { t: 'Here you are!', e: '🍪', key: ['here'] } },
          { propFx: 'toBuddy', mood: 'yummy', anim: 'jump', sfx: 'munch', c: 'Thank you! Yummy!' },
        ],
      },
      { type: 'count', title: 'Count the Food', rounds: [{ v: 'strawberry', n: 3 }, { v: 'apple', n: 5 }, { v: 'egg', n: 4 }] },
    ],
    parent: {
      goal: '음식 이름과 "주세요 / 고마워요"',
      phrases: [
        ["I'm hungry.", '배고파.', ''],
        ['Can I have some milk, please?', '우유 좀 주세요.', '아이가 이 문장으로 말하면 바로 주세요. "영어로 말하면 원하는 걸 얻는다"는 경험이 가장 큰 동기예요.'],
        ['Here you are.', '여기 있어.', '물건을 건넬 때마다 써 주세요.'],
        ['Thank you! — You\'re welcome!', '고마워! — 천만에!', ''],
        ['Yes, please. / No, thank you.', '네, 주세요. / 아니요, 괜찮아요.', '간식을 고를 때 두 가지를 보여 주고 물어봐 주세요.'],
        ['Yummy!', '맛있다!', ''],
      ],
    },
  },

  // ------------------------------------------------------------------ 4
  {
    id: 'clothes',
    title: 'Get Dressed!',
    icon: '👗',
    color: '#D6ECFF',
    scene: 'bedroom',
    sticker: '👒',
    activities: [
      { type: 'learn', title: 'My Clothes', words: ['hat', 'tshirt', 'pants', 'dress_', 'socks', 'shoes'] },
      {
        type: 'drag',
        mode: 'wear',
        title: 'Dress Up',
        intro: "Let's get dressed!",
        pool: ['hat', 'tshirt', 'pants', 'dress_', 'socks', 'shoes'],
        rounds: [{ want: 'tshirt' }, { want: 'pants' }, { want: 'socks' }, { want: 'shoes' }, { want: 'hat' }],
      },
      { type: 'learn', title: 'Weather', words: ['sunny', 'rainy', 'snowy', 'cloudy'], scene: 'sky', cover: '🌈' },
      {
        type: 'talk',
        title: 'What Do We Need?',
        scene: 'sky',
        steps: [
          { fx: 'rain', sfx: 'splash', c: "Look! It's raining!" },
          { c: 'What do we need?' },
          {
            choice: [
              { v: 'umbrella', t: 'An umbrella!', then: [{ wear: 'umbrella', mood: 'joy', anim: 'jump', c: 'Yes! An umbrella! Thank you!' }] },
              { v: 'sunglasses', t: 'Sunglasses!', then: [{ wear: 'sunglasses', mood: 'surprised', c: "Sunglasses? Oh no! I'm wet!" }, { unwear: true, wear: 'umbrella', mood: 'happy', c: 'We need an umbrella!' }] },
            ],
          },
          { unwear: true, mood: 'scared', fx: 'snow', anim: 'shake', c: "Brrr! It's snowing! It's cold!" },
          { c: 'What do we need?' },
          {
            choice: [
              { v: 'scarf', t: 'A scarf!', then: [{ wear: 'scarf', mood: 'joy', anim: 'jump', c: 'A scarf! Nice and warm!' }] },
              { v: 'shorts', t: 'Shorts!', then: [{ wear: 'shorts', mood: 'surprised', anim: 'shake', c: "Shorts? Brrr! It's too cold!" }, { unwear: true, wear: 'scarf', mood: 'happy', c: 'A scarf, please!' }] },
            ],
          },
          { unwear: true, mood: 'happy', fx: 'sun', c: "Wow! It's sunny! It's hot!" },
          { c: 'What do we need?' },
          {
            choice: [
              { v: 'sunglasses', t: 'Sunglasses!', then: [{ wear: 'sunglasses', mood: 'joy', anim: 'jump', c: 'Sunglasses! Cool!' }] },
              { v: 'coat', t: 'A coat!', then: [{ wear: 'coat', mood: 'surprised', c: "A coat? It's too hot!" }, { unwear: true, wear: 'sunglasses', mood: 'happy', c: 'Sunglasses! Cool!' }] },
            ],
          },
          { fx: null, c: "Let's go outside!" },
        ],
      },
      { type: 'listen', title: "What's the Weather?", words: ['sunny', 'rainy', 'snowy', 'cloudy'], scene: 'sky', q: '{say}', ok: '{say}', intro: 'Listen! How is the weather?', rounds: 4 },
    ],
    parent: {
      goal: '옷 이름과 날씨 — 외출 준비를 영어로',
      phrases: [
        ['Put on your shoes.', '신발 신자.', '외출 준비할 때 하나씩 영어로: "Socks on! Shoes on!"'],
        ['Take off your coat.', '외투 벗자.', '집에 돌아왔을 때 써 주세요.'],
        ["It's sunny / rainy / cold!", '맑아 / 비 와 / 추워!', '아침마다 창밖을 함께 보며 날씨를 말해요.'],
        ['We need an umbrella.', '우산이 필요해.', ''],
        ['What do you want to wear?', '뭐 입고 싶어?', '옷 두 벌을 보여 주고 고르게 해 주세요.'],
      ],
    },
  },

  // ------------------------------------------------------------------ 5
  {
    id: 'play',
    title: 'Colors & Toys',
    icon: '🎈',
    color: '#E6DCFF',
    scene: 'playroom',
    sticker: '🎈',
    activities: [
      { type: 'learn', title: 'Colors', words: ['red', 'blue', 'yellow', 'green', 'pink', 'purple'], cover: '🎨' },
      { type: 'balloons', title: 'Pop the Balloons', words: ['red', 'blue', 'yellow', 'green', 'pink', 'purple'], rounds: 6 },
      { type: 'learn', title: 'My Toys', words: ['ball', 'teddy', 'car', 'train', 'robot', 'puzzle'] },
      { type: 'drag', mode: 'box', all: true, title: 'Clean Up!', intro: "Oh! Toys everywhere! Let's clean up!", pool: ['ball', 'teddy', 'car', 'train', 'robot', 'puzzle'] },
      {
        type: 'talk',
        title: 'I Like Pink!',
        steps: [{ c: 'What color do you like, {name}?' }, { choice: ['pink', 'blue', 'yellow', 'purple'].map(colorLike) }, { c: 'Colors are fun!' }],
      },
    ],
    parent: {
      goal: '색깔과 장난감 — 놀이와 정리 시간',
      phrases: [
        ['What color is it? — It\'s red!', '무슨 색이야? — 빨간색!', '그림책, 옷, 과일을 보며 물어봐 주세요.'],
        ['I like pink!', '나는 분홍색이 좋아!', ''],
        ["Let's play!", '같이 놀자!', ''],
        ['Clean up time!', '정리할 시간!', '"Put the ball in the box." 처럼 한 개씩 요청해 보세요.'],
        ['My turn! / Your turn!', '내 차례! / 네 차례!', '보드게임이나 블록놀이에서 쓰기 좋아요.'],
      ],
    },
  },

  // ------------------------------------------------------------------ 6
  {
    id: 'animals',
    title: 'Animal Friends',
    icon: '🐶',
    color: '#D4F5DD',
    scene: 'park',
    sticker: '🐥',
    activities: [
      { type: 'learn', title: 'Animals', words: ['dog', 'cat', 'duck', 'pig', 'cow', 'frog'], cover: '🌿' },
      { type: 'listen', title: 'Who Says Moo?', words: ['dog', 'cat', 'duck', 'pig', 'cow', 'frog'], q: "Who says '{sound}'?", ok: '{T}! {sound}', nope: "That's {one}! {sound}", rounds: 5 },
      {
        type: 'move',
        title: 'Move Like Animals',
        items: [
          { t: 'Hop like a bunny!', e: '🐰', anim: 'hop', beat: 'Hop!', sfx: 'boing' },
          { t: 'Fly like a bird!', e: '🐦', anim: 'fly', beat: 'Flap!', sfx: 'whoosh' },
          { t: 'Jump like a frog!', e: '🐸', anim: 'jump', beat: 'Ribbit!', sfx: 'boing' },
          { t: 'Swim like a fish!', e: '🐟', anim: 'swim', beat: 'Swim!', sfx: 'splash' },
          { t: 'Stomp like an elephant!', e: '🐘', anim: 'stomp', beat: 'Stomp!', sfx: 'stomp' },
        ],
      },
      { type: 'count', title: 'Count the Animals', rounds: [{ v: 'duck', n: 3 }, { v: 'dog', n: 2 }, { v: 'cat', n: 4 }] },
    ],
    parent: {
      goal: '동물 이름과 울음소리, 몸으로 흉내 내기',
      phrases: [
        ['What does the dog say? — Woof woof!', '강아지는 뭐라고 해? — 멍멍!', '영어 울음소리는 한국어와 달라서 아이들이 무척 재미있어해요.'],
        ['Hop like a bunny!', '토끼처럼 깡총!', '몸으로 흉내 내면 기억에 오래 남아요.'],
        ['Look! A bird!', '봐! 새야!', '산책할 때 보이는 동물을 영어로 말해 주세요.'],
        ['How many ducks?', '오리가 몇 마리야?', ''],
      ],
    },
  },

  // ------------------------------------------------------------------ 7
  {
    id: 'body',
    title: 'My Body',
    icon: '👀',
    color: '#FFE3D1',
    scene: 'playroom',
    sticker: '⭐',
    activities: [
      { type: 'touch', mode: 'explore', title: 'Touch Me!', parts: ['head', 'eyes', 'ears', 'nose', 'mouth', 'hands', 'tummy', 'feet'] },
      { type: 'touch', mode: 'quiz', title: 'Where Is My Nose?', parts: ['head', 'eyes', 'ears', 'nose', 'mouth', 'hands', 'tummy', 'feet'], rounds: 6, yours: true },
      { type: 'listen', title: 'Show Me!', words: ['eyes', 'ears', 'nose', 'mouth', 'hands', 'feet'], q: 'Show me the {t}!', ok: '{T}!', nope: "That's the {t}.", rounds: 5 },
      {
        type: 'move',
        title: 'Move Your Body',
        items: [
          { t: 'Clap your hands!', e: '👏', anim: 'clap', beat: 'Clap!', sfx: 'clap' },
          { t: 'Stomp your feet!', e: '🦶', anim: 'stomp', beat: 'Stomp!', sfx: 'stomp' },
          { t: 'Touch your head!', e: '🙆', anim: 'head', beat: 'Head!', sfx: 'pop' },
          { t: 'Shake your body!', e: '💃', anim: 'shake', beat: 'Shake!', sfx: 'boing' },
          { t: 'Turn around!', e: '🔄', anim: 'spin', beat: 'Turn!', sfx: 'whoosh', n: 2 },
          { t: 'Jump!', e: '🦘', anim: 'jump', beat: 'Jump!', sfx: 'boing' },
        ],
      },
    ],
    parent: {
      goal: '몸 이름과 동작 — 몸으로 배우는 영어(TPR)',
      phrases: [
        ['Touch your nose.', '코를 만져 봐.', '"Simon says" 놀이처럼 빠르게 바꿔 가며 해 보세요.'],
        ['Clap your hands!', '손뼉 쳐!', ''],
        ['Wash your hands.', '손 씻자.', '외출 후, 밥 먹기 전에 매번 써 주세요.'],
        ['Where is your nose?', '코가 어디 있지?', ''],
        ['Head, shoulders, knees and toes!', '머리 어깨 무릎 발', '유명한 동요를 함께 불러 보세요.'],
      ],
    },
  },

  // ------------------------------------------------------------------ 8
  {
    id: 'feelings',
    title: 'How Do You Feel?',
    icon: '💖',
    color: '#FFD6E8',
    scene: 'playroom',
    sticker: '💖',
    activities: [
      { type: 'learn', title: 'Feelings', words: ['happy', 'sad', 'angry', 'sleepy', 'scared', 'surprised'], cover: '💌' },
      { type: 'listen', title: 'Who Is Happy?', words: ['happy', 'sad', 'angry', 'sleepy', 'scared'], q: 'Who is {t}?', ok: '{char} is {t}!', nope: '{char} is {t}.', rounds: 5 },
      {
        type: 'talk',
        title: 'Cheer Up!',
        cast: ['buddy', 'friend'],
        steps: [
          { who: 'friend', prop: 'icecream', mood: 'joy', c: 'Look! I have ice cream! Yummy!' },
          { who: 'friend', propFx: 'drop', sfx: 'boing', anim: 'shake', mood: 'surprised', c: 'Oh no!' },
          { who: 'friend', mood: 'sad', c: "My ice cream! I'm sad." },
          { who: 'buddy', c: "{friend} is sad. Let's help!" },
          {
            choice: [
              { e: '🤗', t: "Don't be sad!", then: [{ who: 'friend', mood: 'joy', anim: 'jump', sfx: 'magic', c: 'A hug! Thank you!' }] },
              { v: 'icecream', t: 'Here you are!', then: [{ who: 'friend', prop: 'icecream', mood: 'joy', anim: 'jump', sfx: 'magic', c: 'Ice cream! Thank you!' }] },
            ],
          },
          { who: 'friend', prop: null, c: "I'm happy now!" },
          { all: 'Yay!', anim: 'jump' },
        ],
      },
      {
        type: 'talk',
        title: 'How Are You Today?',
        steps: [
          { c: 'How are you today, {name}?' },
          {
            choice: ['happy', 'sad', 'angry', 'sleepy'].map((m) => ({ v: m, t: `I'm ${m}.`, then: feelingReply[m] })),
          },
          { mood: 'happy', c: 'Thank you for telling me!' },
        ],
      },
      {
        type: 'say',
        title: 'I Feel...',
        items: [
          { t: "I'm happy!", v: 'happy', key: ['happy'] },
          { t: "I'm sad.", v: 'sad', key: ['sad'] },
          { t: "I'm sleepy.", v: 'sleepy', key: ['sleepy'] },
        ],
      },
    ],
    parent: {
      goal: '감정 표현 — 내 마음을 영어로 말해요',
      phrases: [
        ['How are you feeling?', '기분이 어때?', ''],
        ["I'm happy / sad / angry / sleepy.", '행복해 / 슬퍼 / 화나 / 졸려.', '아이의 감정을 영어로 대신 말해 주세요: "Oh, you\'re sad."'],
        ["It's okay.", '괜찮아.', ''],
        ['Do you want a hug?', '안아 줄까?', ''],
        ['Take a deep breath.', '숨을 크게 쉬어 봐.', '화가 났을 때 함께 숨쉬기를 해 보세요.'],
      ],
    },
  },

  // ------------------------------------------------------------------ 9
  {
    id: 'numbers',
    title: "Let's Count!",
    icon: '🔢',
    color: '#FFF1B8',
    scene: 'park',
    sticker: '🧁',
    activities: [
      { type: 'learn', title: '1 to 5', words: ['n1', 'n2', 'n3', 'n4', 'n5'] },
      { type: 'count', title: 'Count to 5', rounds: [{ v: 'star', n: 3 }, { v: 'balloon', n: 5 }, { v: 'cat', n: 2 }, { v: 'cookie', n: 4 }] },
      { type: 'listen', title: 'Show Me Three!', words: ['n1', 'n2', 'n3', 'n4', 'n5'], q: 'Show me {t}!', ok: '{T}!', nope: "That's {t}.", rounds: 5 },
      {
        type: 'drag',
        mode: 'give',
        title: 'Give Me Two!',
        rounds: [{ want: 'cookie', n: 2 }, { want: 'strawberry', n: 3 }, { want: 'apple', n: 4 }],
      },
      { type: 'learn', title: '6 to 10', words: ['n6', 'n7', 'n8', 'n9', 'n10'] },
      { type: 'count', title: 'Count to 10', rounds: [{ v: 'fish', n: 6 }, { v: 'strawberry', n: 8 }, { v: 'star', n: 10, ask: false }] },
      {
        type: 'move',
        title: 'Jump Three Times!',
        items: [
          { t: 'Jump three times!', e: '🦘', anim: 'jump', n: 3, count: true, sfx: 'boing' },
          { t: 'Clap five times!', e: '👏', anim: 'clap', n: 5, count: true, sfx: 'clap' },
          { t: 'Stomp four times!', e: '🦶', anim: 'stomp', n: 4, count: true, sfx: 'stomp' },
        ],
      },
    ],
    parent: {
      goal: '숫자 1~10 — 세고, 고르고, 건네기',
      phrases: [
        ['How many?', '몇 개야?', '간식을 줄 때 함께 세어 보세요.'],
        ['One, two, three…', '하나, 둘, 셋…', '계단을 오를 때 소리 내어 세어요.'],
        ['Can I have two cookies, please?', '쿠키 두 개 줄래요?', '아이가 숫자를 넣어 요청하게 해 주세요.'],
        ['Jump three times!', '세 번 점프!', ''],
      ],
    },
  },

  // ------------------------------------------------------------------ 10
  {
    id: 'bedtime',
    title: 'Good Night!',
    icon: '🌙',
    color: '#D9DCFF',
    scene: 'bathroom',
    sticker: '🌙',
    activities: [
      { type: 'learn', title: 'Bedtime', words: ['washhands', 'bath', 'brush', 'book', 'bed'], cover: '🌙' },
      {
        type: 'scrub',
        title: 'Wash, Wash!',
        tasks: [
          { pre: 'My hands are dirty!', say: 'Wash your hands!', tool: '🧼', zone: 'hands', dirt: 'mud', chant: 'Wash, wash, wash!', done: 'Bubbles!' },
          { pre: 'Bubbles, bubbles!', say: 'Rinse your hands!', tool: '🚿', zone: 'hands', dirt: 'soap', chant: 'Splash, splash!', done: 'Clean hands! Yay!' },
          { pre: "Let's take a bath!", say: 'Scrub, scrub!', tool: '🧽', zone: 'body', dirt: 'mud', chant: 'Scrub, scrub, scrub!', done: 'All clean!' },
        ],
      },
      { type: 'listen', title: 'Bedtime Time', words: ['washhands', 'bath', 'brush', 'book', 'bed'], q: '{T}!', ok: '{T}!', nope: 'No, no!', intro: 'Listen and touch!' },
      {
        type: 'talk',
        title: 'Sleep Tight',
        scene: 'bedroom',
        steps: [
          { mood: 'sleepy', c: "Yawn! I'm sleepy." },
          { mood: 'happy', c: "Let's read a book!" },
          { tapProp: 'book', hint: 'Tap the book!' },
          { mood: 'joy', c: 'I love books! Thank you!' },
          { prop: 'bulb', mood: 'sleepy', c: 'Turn off the light, please.' },
          { tapProp: true, hint: 'Turn off the light!', fx: 'night', tapSfx: 'magic' },
          { prop: null, c: 'Good night, {name}!' },
          { say: { t: 'Good night!', e: '🌙', key: ['night'] } },
          { mood: 'sleepy', anim: 'sleep', c: 'Sweet dreams!' },
        ],
      },
      {
        type: 'say',
        title: 'Good Night!',
        scene: 'night',
        items: [
          { t: 'Good night!', e: '🌙', key: ['night'] },
          { t: 'Sweet dreams!', e: '✨', key: ['dreams'] },
          { t: 'I love you!', e: '💖', key: ['love'] },
        ],
      },
    ],
    parent: {
      goal: '저녁 루틴 — 손 씻기, 목욕, 책 읽기, 잘 자',
      phrases: [
        ['Time for bed.', '잘 시간이야.', ''],
        ['Wash your hands. / Take a bath.', '손 씻자. / 목욕하자.', ''],
        ["Let's read a book.", '책 읽자.', '잠자리 그림책 한 권은 영어 그림책으로 골라 보세요.'],
        ['Turn off the light.', '불 끄자.', ''],
        ['Good night! Sweet dreams!', '잘 자! 좋은 꿈 꿔!', ''],
        ['I love you.', '사랑해.', '매일 밤 같은 말로 마무리해 주세요.'],
      ],
    },
  },
];

export const UNIT_BY_ID = Object.fromEntries(UNITS.map((u) => [u.id, u]));
