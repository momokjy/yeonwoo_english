// Every word/phrase the app teaches, with the picture that explains it.
// No Korean here on purpose: meaning comes from pictures, animation and context.
//
// Fields:
//   t      the word (used in questions: "Where is the {t}?")
//   e      emoji picture          color  paint colour     mood  character face
//   num    number picture         char   one of our friends
//   say    how to say it alone (default: "T!")    s  a short follow-up sentence
//   one    with article ("an apple")    pl  plural    sound  animal sound
//   slot   where it goes when a friend wears it     a  card animation

const w = (t, e, x = {}) => ({ t, e, ...x });

export const W = {
  // friends
  momo: { t: '{momo}', char: 'momo', one: '{momo}' },
  puff: { t: '{puff}', char: 'puff', one: '{puff}' },
  lulu: { t: '{lulu}', char: 'lulu', one: '{lulu}' },

  // daily routine
  wakeup: w('wake up', '⏰', { a: 'shake' }),
  brush: w('brush your teeth', '🪥', { a: 'wobble' }),
  washface: w('wash your face', '🧼', { a: 'wobble' }),
  dress: w('get dressed', '👕', { a: 'bounce' }),
  breakfast: w('eat breakfast', '🥣', { a: 'bounce' }),
  washhands: w('wash your hands', '👐', { a: 'wobble' }),
  bath: w('take a bath', '🛁', { a: 'bounce' }),
  book: w('read a book', '📖', { a: 'bounce' }),
  bed: w('go to bed', '🛏️', { a: 'float' }),

  // food
  apple: w('apple', '🍎', { one: 'an apple', pl: 'apples', s: 'Red and crunchy!' }),
  banana: w('banana', '🍌', { one: 'a banana', pl: 'bananas', s: 'Yellow and yummy!' }),
  milk: w('milk', '🥛', { one: 'some milk', s: 'White milk!' }),
  bread: w('bread', '🍞', { one: 'some bread' }),
  egg: w('egg', '🥚', { one: 'an egg', pl: 'eggs' }),
  strawberry: w('strawberry', '🍓', { one: 'a strawberry', pl: 'strawberries', s: 'Red and sweet!' }),
  juice: w('juice', '🧃', { one: 'some juice' }),
  cookie: w('cookie', '🍪', { one: 'a cookie', pl: 'cookies' }),
  icecream: w('ice cream', '🍦', { one: 'an ice cream' }),

  // clothes
  hat: w('hat', '👒', { one: 'a hat', slot: 'head' }),
  tshirt: w('T-shirt', '👕', { one: 'a T-shirt', slot: 'body' }),
  pants: w('pants', '👖', { one: 'the pants', slot: 'legs' }),
  dress_: w('dress', '👗', { one: 'a dress', slot: 'body' }),
  socks: w('socks', '🧦', { one: 'the socks', slot: 'socks' }),
  shoes: w('shoes', '👟', { one: 'the shoes', slot: 'feet' }),
  coat: w('coat', '🧥', { one: 'a coat', slot: 'body' }),
  scarf: w('scarf', '🧣', { one: 'a scarf', slot: 'neck' }),
  gloves: w('gloves', '🧤', { one: 'the gloves', slot: 'hands' }),
  umbrella: w('umbrella', '☂️', { one: 'an umbrella', slot: 'hand' }),
  sunglasses: w('sunglasses', '🕶️', { one: 'sunglasses', slot: 'eyes' }),
  shorts: w('shorts', '🩳', { one: 'shorts', slot: 'legs' }),

  // weather
  sunny: w('sunny', '☀️', { say: "It's sunny!", a: 'spin' }),
  rainy: w('rainy', '🌧️', { say: "It's rainy!", a: 'rain' }),
  snowy: w('snowy', '☃️', { say: "It's snowy!", a: 'float' }),
  cloudy: w('cloudy', '☁️', { say: "It's cloudy!", a: 'float' }),

  // feelings (drawn with a friend's face)
  happy: { t: 'happy', mood: 'joy', s: "I'm happy!", a: 'bounce' },
  sad: { t: 'sad', mood: 'sad', s: "I'm sad.", a: 'wobble' },
  angry: { t: 'angry', mood: 'angry', s: "I'm angry!", a: 'shake' },
  sleepy: { t: 'sleepy', mood: 'sleepy', s: "I'm sleepy.", a: 'float' },
  scared: { t: 'scared', mood: 'scared', s: "I'm scared!", a: 'shake' },
  surprised: { t: 'surprised', mood: 'surprised', s: 'Wow!', a: 'bounce' },

  // body
  eyes: w('eyes', '👀'),
  ears: w('ears', '👂'),
  nose: w('nose', '👃'),
  mouth: w('mouth', '👄'),
  hands: w('hands', '🙌'),
  feet: w('feet', '🦶'),

  // colours
  red: { t: 'red', color: '#FF5A5F', one: 'red', s: 'Red, like an apple!' },
  blue: { t: 'blue', color: '#4A90E2', one: 'blue', s: 'Blue, like the sky!' },
  yellow: { t: 'yellow', color: '#FFD23F', one: 'yellow', s: 'Yellow, like a banana!' },
  green: { t: 'green', color: '#5CC872', one: 'green', s: 'Green, like a frog!' },
  pink: { t: 'pink', color: '#FF8FC7', one: 'pink', s: 'Pink, like a flower!' },
  purple: { t: 'purple', color: '#A57BEA', one: 'purple', s: 'Purple, like grapes!' },

  // toys
  ball: w('ball', '⚽', { one: 'the ball', pl: 'balls', a: 'bounce' }),
  teddy: w('teddy bear', '🧸', { one: 'the teddy bear', a: 'wobble' }),
  car: w('car', '🚗', { one: 'the car', pl: 'cars', s: 'Beep beep!', a: 'shake' }),
  train: w('train', '🚂', { one: 'the train', s: 'Choo choo!', a: 'shake' }),
  robot: w('robot', '🤖', { one: 'the robot', a: 'wobble' }),
  puzzle: w('puzzle', '🧩', { one: 'the puzzle', a: 'spin' }),

  // animals
  dog: w('dog', '🐶', { one: 'a dog', pl: 'dogs', sound: 'Woof woof!' }),
  cat: w('cat', '🐱', { one: 'a cat', pl: 'cats', sound: 'Meow!' }),
  duck: w('duck', '🦆', { one: 'a duck', pl: 'ducks', sound: 'Quack quack!' }),
  pig: w('pig', '🐷', { one: 'a pig', pl: 'pigs', sound: 'Oink oink!' }),
  cow: w('cow', '🐮', { one: 'a cow', pl: 'cows', sound: 'Moo!' }),
  frog: w('frog', '🐸', { one: 'a frog', pl: 'frogs', sound: 'Ribbit!' }),
  fish: w('fish', '🐟', { one: 'a fish', pl: 'fish' }),

  // school
  pencil: w('pencil', '✏️', { one: 'a pencil', pl: 'pencils', a: 'wobble' }),
  book2: w('book', '📕', { one: 'a book', pl: 'books', a: 'bounce' }),
  bag: w('bag', '🎒', { one: 'a bag', pl: 'bags', a: 'bounce' }),
  crayon: w('crayon', '🖍️', { one: 'a crayon', pl: 'crayons', a: 'wobble' }),
  scissors: w('scissors', '✂️', { one: 'scissors', a: 'shake' }),
  ruler: w('ruler', '📏', { one: 'a ruler', pl: 'rulers', a: 'wobble' }),

  // family
  mom: w('mom', '👩', { one: 'Mom', s: 'I love you, Mom!' }),
  dad: w('dad', '👨', { one: 'Dad', s: 'I love you, Dad!' }),
  brother: w('brother', '👦', { one: 'my brother' }),
  sister: w('sister', '👧', { one: 'my sister' }),
  grandma: w('grandma', '👵', { one: 'Grandma' }),
  grandpa: w('grandpa', '👴', { one: 'Grandpa' }),
  baby: w('baby', '👶', { one: 'the baby' }),

  // things
  bulb: w('light', '💡', { one: 'the light' }),
  star: w('star', '⭐', { one: 'a star', pl: 'stars' }),
  balloon: w('balloon', '🎈', { one: 'a balloon', pl: 'balloons' }),
};

// numbers 1–10
['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'].forEach((t, i) => {
  W['n' + (i + 1)] = { t, num: i + 1, one: t, a: 'bounce' };
});
// every word knows its own id; animal sounds are said right after the name in "learn"
for (const [id, v] of Object.entries(W)) {
  v.id = id;
  if (v.sound && !v.s) v.s = v.sound;
}

/** Fill word placeholders ({t} {T} {one} {pl} {sound} {say}) for one vocab item. */
export function wordText(template, v, extra = {}) {
  const T = v.t ? v.t.charAt(0).toUpperCase() + v.t.slice(1) : '';
  const map = {
    t: v.t,
    T,
    one: v.one || (v.t ? 'the ' + v.t : ''),
    pl: v.pl || v.t,
    sound: v.sound || '',
    say: v.say || T + '!',
    ...extra,
  };
  return String(template).replace(/\{(\w+)\}/g, (m, k) => (map[k] != null ? map[k] : m));
}

/** What a friend says when a card is revealed. */
export const wordLine = (v) => v.say || wordText('{T}!', v);
