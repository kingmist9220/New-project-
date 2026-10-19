'use strict';
/*
 * Learning Buddy — a calm learning and habits app for autistic children.
 *
 * Built with no framework and no network calls after first load, so it starts
 * instantly and runs smoothly on old or low-cost tablets and phones:
 *  - one delegated click listener, screens rendered with a single innerHTML write
 *  - animations use transform/opacity only (GPU-composited, no layout thrash)
 *  - timers are cleaned up on every screen change so nothing runs in the background
 *  - a service worker caches the whole app for instant, offline starts
 */

// ---------- Content ----------

const ROUTINES = [
  { id: 'morning', emoji: '🌅', name: 'Morning', steps: [
    ['🛏️', 'Get out of bed'], ['🚽', 'Use the toilet'], ['🧼', 'Wash hands'],
    ['👕', 'Get dressed'], ['🥣', 'Eat breakfast'], ['🪥', 'Brush teeth'], ['🎒', 'Pack my bag'] ] },
  { id: 'handwash', emoji: '🧼', name: 'Wash hands', steps: [
    ['🚰', 'Turn on the water'], ['💧', 'Wet my hands'], ['🧴', 'Add soap'],
    ['👐', 'Rub for 20 seconds'], ['💦', 'Rinse the soap off'], ['🚱', 'Turn off the water'], ['🧻', 'Dry my hands'] ] },
  { id: 'teeth', emoji: '🪥', name: 'Brush teeth', steps: [
    ['🪥', 'Get my toothbrush'], ['🫧', 'Add a little toothpaste'], ['⬆️', 'Brush top teeth'],
    ['⬇️', 'Brush bottom teeth'], ['👅', 'Brush my tongue'], ['💦', 'Spit and rinse'] ] },
  { id: 'dressed', emoji: '👕', name: 'Get dressed', steps: [
    ['🩲', 'Underwear'], ['👖', 'Trousers'], ['👕', 'Shirt'], ['🧦', 'Socks'], ['👟', 'Shoes'] ] },
  { id: 'tidy', emoji: '🧸', name: 'Tidy up', steps: [
    ['🧸', 'Toys in the box'], ['📚', 'Books on the shelf'], ['👚', 'Clothes in the basket'], ['✅', 'Look — all tidy!'] ] },
  { id: 'bedtime', emoji: '🌙', name: 'Bedtime', steps: [
    ['🛁', 'Have a bath'], ['🩳', 'Put on pyjamas'], ['🪥', 'Brush teeth'], ['🚽', 'Use the toilet'],
    ['📖', 'Story time'], ['💡', 'Lights off'], ['😴', 'Sleep'] ] },
];

const COLORS = [
  ['red', '#e05555'], ['blue', '#4a7fe0'], ['green', '#4caf6a'], ['yellow', '#f2cf3a'],
  ['orange', '#f08a3c'], ['purple', '#8a5cc7'], ['pink', '#ef8fb8'], ['brown', '#8b5e3c'], ['black', '#2b2b2b'],
];

const SHAPES = {
  circle: '<circle cx="50" cy="50" r="40"/>',
  square: '<rect x="12" y="12" width="76" height="76" rx="4"/>',
  triangle: '<polygon points="50,10 92,88 8,88"/>',
  star: '<polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38"/>',
  heart: '<path d="M50 88 C10 60 5 35 25 20 C38 11 50 22 50 30 C50 22 62 11 75 20 C95 35 90 60 50 88Z"/>',
  rectangle: '<rect x="6" y="26" width="88" height="48" rx="4"/>',
  diamond: '<polygon points="50,6 92,50 50,94 8,50"/>',
  oval: '<ellipse cx="50" cy="50" rx="44" ry="30"/>',
};

const THINGS = [
  ['🐶', 'dog'], ['🐱', 'cat'], ['🐟', 'fish'], ['🐦', 'bird'], ['🍎', 'apple'], ['🍌', 'banana'],
  ['🚗', 'car'], ['🚌', 'bus'], ['⚽', 'ball'], ['📚', 'book'], ['🌳', 'tree'], ['☀️', 'sun'],
  ['🏠', 'house'], ['🥛', 'milk'], ['🦆', 'duck'], ['🐮', 'cow'], ['🍓', 'strawberry'], ['🚂', 'train'],
];

const COUNT_ITEMS = ['🍎', '⭐', '🐟', '🎈', '🚗', '🌸', '🦆', '🍪'];

const HABITS = [
  ['What do we use to brush our teeth?', '🪥', 'toothbrush', ['🥄', '🧦', '📚']],
  ['What do we use to wash our hands?', '🧼', 'soap', ['🍪', '🧸', '👟']],
  ['What do we wear on our feet?', '👟', 'shoes', ['🧢', '🧤', '🍎']],
  ['What do we do when we are tired?', '😴', 'sleep', ['🏃', '🎺', '🍭']],
  ['What do we put on when it rains?', '☂️', 'umbrella', ['🕶️', '🩳', '🏖️']],
  ['What is a healthy snack?', '🍎', 'apple', ['🍭', '🍩', '🧁']],
  ['Where do we put rubbish?', '🗑️', 'bin', ['🛏️', '🛁', '🍽️']],
  ['What do we drink when we are thirsty?', '💧', 'water', ['🧽', '🪥', '🧦']],
  ['What do we use to dry our hands?', '🧻', 'towel', ['💧', '🧼', '🥣']],
  ['What do we wear in bed?', '🩳', 'pyjamas', ['🧥', '⛑️', '🥾']],
];

const FEELINGS = [
  { emoji: '😊', name: 'happy', say: 'You feel happy. That is great!', ideas: [['💃', 'Dance'], ['🤗', 'Share a hug'], ['🎨', 'Draw a picture']] },
  { emoji: '😢', name: 'sad', say: 'You feel sad. That is okay.', ideas: [['🤗', 'Ask for a hug'], ['🧸', 'Hold a soft toy'], ['🗣️', 'Tell a grown-up']] },
  { emoji: '😠', name: 'angry', say: 'You feel angry. That is okay. Let us calm our body.', ideas: [['🫧', 'Breathe slowly', 'calm'], ['✊', 'Squeeze hands tight, then let go'], ['🚶', 'Go to a quiet place']] },
  { emoji: '😨', name: 'scared', say: 'You feel scared. You are safe. A grown-up can help.', ideas: [['🗣️', 'Tell a grown-up'], ['🫧', 'Breathe slowly', 'calm'], ['🧸', 'Hold a soft toy']] },
  { emoji: '😴', name: 'tired', say: 'You feel tired. Rest can help.', ideas: [['🛋️', 'Have a rest'], ['💧', 'Drink water'], ['📖', 'Quiet story']] },
  { emoji: '🤯', name: 'too loud', say: 'Things feel too much. Let us make it quiet.', ideas: [['🎧', 'Put on ear defenders'], ['🚶', 'Go to a quiet place'], ['⏱️', 'Calm timer', 'timer']] },
  { emoji: '😕', name: 'confused', say: 'You feel confused. It is okay to ask.', ideas: [['🙋', 'Ask for help'], ['🔁', 'Try again slowly'], ['🫧', 'Breathe slowly', 'calm']] },
  { emoji: '🤒', name: 'unwell', say: 'You feel unwell. Tell a grown-up.', ideas: [['🗣️', 'Tell a grown-up'], ['🛋️', 'Have a rest'], ['💧', 'Drink water']] },
];

const FIRST_OPTIONS = [['📝', 'Homework'], ['🪥', 'Brush teeth'], ['🧸', 'Tidy up'], ['🥦', 'Eat dinner'], ['🛁', 'Bath'], ['👟', 'Shoes on'], ['🚗', 'Car ride'], ['🏫', 'School']];
const THEN_OPTIONS = [['📺', 'TV'], ['🎮', 'Game'], ['🛝', 'Playground'], ['🧩', 'Puzzle'], ['📖', 'Story'], ['🍓', 'Snack'], ['🎨', 'Drawing'], ['🎵', 'Music']];

const STICKERS = ['🦄', '🦖', '🚀', '🌈', '🐢', '🦋', '🐙', '🏆', '🦁', '🐳', '🌻', '🎉'];

const ROUND = 5; // questions per round: short and predictable

// ---------- State (persisted locally; nothing leaves the device) ----------

const today = () => new Date().toISOString().slice(0, 10);
const DEFAULTS = {
  stars: 0,
  settings: { sound: true, voice: true, choices: 3, theme: 'calm', font: 'normal', motion: 'on', countMax: 5 },
  routines: { date: today(), done: {} },
  ft: { first: 0, then: 0 },
};

function load() {
  try {
    const s = JSON.parse(localStorage.getItem('lb-state'));
    if (s) { const d = structuredClone(DEFAULTS); return { ...d, ...s, settings: { ...d.settings, ...s.settings } }; }
  } catch (_) { /* storage blocked or corrupt: start fresh */ }
  return structuredClone(DEFAULTS);
}
const state = load();
if (state.routines.date !== today()) state.routines = { date: today(), done: {} };

let saveTimer;
function save() {
  // Coalesce rapid taps into one write so storage never blocks the UI thread.
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { try { localStorage.setItem('lb-state', JSON.stringify(state)); } catch (_) {} }, 150);
}

// ---------- Helpers ----------

const $ = (s) => document.querySelector(s);
const app = $('#app');
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.random() * a.length | 0];
const sample = (a, n, not) => shuffle(a.filter((x) => x !== not)).slice(0, n);

function speak(text) {
  if (!state.settings.voice || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.85; u.pitch = 1.05;
  speechSynthesis.speak(u);
}

let audio;
function chime(kind = 'good') {
  if (!state.settings.sound) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const notes = kind === 'good' ? [523, 659, 784] : kind === 'done' ? [523, 659, 784, 1047] : [392];
    notes.forEach((f, i) => {
      const t = audio.currentTime + i * 0.12;
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.02); // soft volume, no sudden loud sounds
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(audio.destination);
      o.start(t); o.stop(t + 0.55);
    });
  } catch (_) {}
}

function addStars(n) {
  state.stars += n;
  $('#star-count').textContent = state.stars;
  save();
}

function applySettings() {
  const r = document.documentElement;
  r.dataset.theme = state.settings.theme;
  r.dataset.font = state.settings.font;
  r.dataset.motion = state.settings.motion;
  $('#star-count').textContent = state.stars;
}

const shapeSvg = (name, color = 'currentColor') =>
  `<svg viewBox="0 0 100 100" width="96" height="96" aria-hidden="true" fill="${color}">${SHAPES[name]}</svg>`;

// ---------- Router ----------

let cleanups = [];
let actions = {};
const later = (fn, ms) => { const id = setTimeout(fn, ms); cleanups.push(() => clearTimeout(id)); };
const every = (fn, ms) => { const id = setInterval(fn, ms); cleanups.push(() => clearInterval(id)); };

function render(title, html, handlers = {}) {
  $('#title').textContent = title;
  $('#home-btn').hidden = location.hash === '' || location.hash === '#/';
  actions = handlers;
  app.innerHTML = html;
  app.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

app.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (el && !el.disabled && actions[el.dataset.act]) actions[el.dataset.act](el);
});

const go = (hash) => { location.hash = hash; };

function route() {
  cleanups.forEach((f) => f()); cleanups = [];
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  const [name, arg] = location.hash.replace(/^#\/?/, '').split('/');
  (SCREENS[name] || SCREENS.home)(arg);
}

// ---------- Screens ----------

const tile = (act, emoji, label, extra = '', cls = '') =>
  `<button class="tile ${cls}" data-act="${act}" ${extra}><span class="emoji" aria-hidden="true">${emoji}</span>${label}</button>`;

const SCREENS = {
  home() {
    render('Learning Buddy', `
      <p class="lead">What would you like to do?</p>
      <div class="grid">
        ${tile('go', '📋', 'My Day', 'data-to="#/routines"')}
        ${tile('go', '🧠', 'Learn', 'data-to="#/learn"')}
        ${tile('go', '👉', 'First, Then', 'data-to="#/firstthen"')}
        ${tile('go', '💛', 'Feelings', 'data-to="#/feelings"')}
        ${tile('go', '🫧', 'Calm Corner', 'data-to="#/calm"')}
        ${tile('go', '⏱️', 'Timer', 'data-to="#/timer"')}
        ${tile('go', '⭐', 'My Stars', 'data-to="#/stars"')}
      </div>`, { go: (el) => go(el.dataset.to) });
  },

  routines() {
    const done = state.routines.done;
    render('My Day', `
      <p class="lead">Pick a routine. Tap each step when you finish it.</p>
      <div class="grid">${ROUTINES.map((r) => {
        const n = (done[r.id] || []).length, all = n === r.steps.length;
        return tile('open', r.emoji, `${r.name}<small>${all ? '✅ Done!' : `${n} / ${r.steps.length}`}</small>`, `data-id="${r.id}"`, all ? 'done' : '');
      }).join('')}</div>`, { open: (el) => go(`#/routine/${el.dataset.id}`) });
  },

  routine(id) {
    const r = ROUTINES.find((x) => x.id === id);
    if (!r) return go('#/routines');
    const draw = () => {
      const done = new Set(state.routines.done[r.id] || []);
      const next = r.steps.findIndex((_, i) => !done.has(i));
      render(r.name, `
        <div class="progress" aria-hidden="true">${r.steps.map((_, i) => `<i class="${done.has(i) ? 'on' : ''}"></i>`).join('')}</div>
        <div class="steps">${r.steps.map(([e, label], i) => `
          <button class="step ${done.has(i) ? 'done' : ''} ${i === next ? 'now' : ''}" data-act="step" data-i="${i}" aria-pressed="${done.has(i)}">
            <span class="emoji" aria-hidden="true">${e}</span><span class="label">${i + 1}. ${label}</span><span class="check" aria-hidden="true">✅</span>
          </button>`).join('')}</div>
        ${next === -1 ? `<div class="reward"><span class="emoji">🎉</span>All done! Great job!</div>` : ''}
        <div class="row">
          <button class="btn ghost" data-act="say">🔊 Hear the next step</button>
          <button class="btn ghost" data-act="reset">↺ Start again</button>
        </div>`, {
        step(el) {
          const i = +el.dataset.i, list = new Set(state.routines.done[r.id] || []);
          if (list.has(i)) list.delete(i);
          else { list.add(i); chime(); addStars(1); }
          state.routines.done[r.id] = [...list]; save();
          if (list.size === r.steps.length) { chime('done'); addStars(3); speak(`All done! Great job with ${r.name}!`); }
          else if (list.has(i)) speak(`Next: ${r.steps[r.steps.findIndex((_, k) => !list.has(k))][1]}`);
          draw();
        },
        say() { speak(next === -1 ? 'All done!' : `Next: ${r.steps[next][1]}`); },
        reset() { state.routines.done[r.id] = []; save(); draw(); },
      });
    };
    draw();
    const d = new Set(state.routines.done[r.id] || []);
    const n = r.steps.findIndex((_, i) => !d.has(i));
    if (n !== -1) later(() => speak(`${r.name}. First: ${r.steps[n][1]}`), 300);
  },

  learn() {
    render('Learn', `
      <p class="lead">Choose a game. Each game has ${ROUND} questions.</p>
      <div class="grid">${Object.entries(GAMES).map(([id, g]) =>
        tile('play', g.emoji, g.name, `data-id="${id}"`)).join('')}</div>`,
      { play: (el) => go(`#/play/${el.dataset.id}`) });
  },

  play(id) {
    const game = GAMES[id];
    if (!game) return go('#/learn');
    let q = 0, firstTry = 0, current, tries;

    const next = () => {
      if (q === ROUND) return finish();
      current = game.make(state.settings.choices);
      tries = 0;
      render(game.name, `
        <div class="progress" aria-hidden="true">${Array.from({ length: ROUND }, (_, i) => `<i class="${i < q ? 'on' : ''}"></i>`).join('')}</div>
        <div class="prompt">
          <button class="icon-btn say" data-act="say" aria-label="Say it again">🔊</button>
          <div>${current.text}${current.show ? `<div class="show" aria-hidden="true">${current.show}</div>` : ''}</div>
        </div>
        <div class="choices">${current.choices.map((c, i) =>
          `<button class="tile choice ${c.word ? 'word' : ''}" data-act="answer" data-i="${i}" aria-label="${c.label}">${c.html}</button>`).join('')}</div>
        <p class="feedback" id="fb" aria-live="polite"></p>`, {
        say: () => speak(current.say),
        answer(el) {
          const i = +el.dataset.i, fb = $('#fb');
          if (i === current.answer) {
            if (tries === 0) firstTry++;
            el.classList.add('right');
            app.querySelectorAll('.choice').forEach((b) => { b.disabled = true; });
            const msg = pick(['Yes! Well done!', 'Great job!', 'That is right!', 'You got it!']);
            fb.textContent = `⭐ ${msg}`;
            chime(); speak(msg); addStars(1);
            q++;
            later(next, 1400);
          } else {
            // Gentle, errorless-style correction: no buzzer, the wrong choice just fades.
            tries++;
            el.classList.add('wrong'); el.disabled = true;
            fb.textContent = 'Let’s try again 🙂';
            speak(tries > 1 ? `Try again. ${current.say}` : 'Try again');
          }
        },
      });
      later(() => speak(current.say), 250);
    };

    const finish = () => {
      addStars(2);
      chime('done');
      render(game.name, `
        <div class="reward"><span class="emoji">🏆</span>
          <p>You finished! ${firstTry} of ${ROUND} on the first try.</p></div>
        <div class="row" style="justify-content:center">
          <button class="btn" data-act="again">Play again</button>
          <button class="btn ghost" data-act="back">Other games</button>
        </div>`, { again: () => route(), back: () => go('#/learn') });
      speak('You finished! Great work!');
    };

    next();
  },

  firstthen() {
    const draw = () => {
      const [fe, fl] = FIRST_OPTIONS[state.ft.first], [te, tl] = THEN_OPTIONS[state.ft.then];
      render('First, Then', `
        <p class="lead">Tap a card to change it.</p>
        <div class="first-then">
          <button class="slot" data-act="first"><h2>FIRST</h2><div class="big" aria-hidden="true">${fe}</div>${fl}</button>
          <button class="slot" data-act="then"><h2>THEN</h2><div class="big" aria-hidden="true">${te}</div>${tl}</button>
        </div>
        <div class="row"><button class="btn" data-act="say">🔊 Say it</button></div>`, {
        first() { state.ft.first = (state.ft.first + 1) % FIRST_OPTIONS.length; save(); draw(); },
        then() { state.ft.then = (state.ft.then + 1) % THEN_OPTIONS.length; save(); draw(); },
        say() { speak(`First ${fl}. Then ${tl}.`); },
      });
    };
    draw();
  },

  feelings(which) {
    const f = FEELINGS.find((x) => x.name === decodeURIComponent(which || ''));
    if (!f) {
      render('Feelings', `
        <p class="lead">How do you feel right now?</p>
        <div class="grid">${FEELINGS.map((x) => tile('pick', x.emoji, x.name, `data-n="${x.name}"`)).join('')}</div>`,
        { pick: (el) => go(`#/feelings/${encodeURIComponent(el.dataset.n)}`) });
      return;
    }
    render('Feelings', `
      <div class="reward"><span class="emoji">${f.emoji}</span><p>${f.say}</p></div>
      <p class="lead">Things that can help:</p>
      <div class="grid">${f.ideas.map(([e, label, to]) =>
        tile('idea', e, label, `data-label="${label}" ${to ? `data-to="#/${to}"` : ''}`)).join('')}</div>
      <div class="row"><button class="btn ghost" data-act="back">← Other feelings</button></div>`, {
      idea: (el) => (el.dataset.to ? go(el.dataset.to) : speak(el.dataset.label)),
      back: () => go('#/feelings'),
    });
    later(() => speak(f.say), 250);
  },

  calm() {
    render('Calm Corner', `
      <p class="lead">Watch the bubble. Breathe in as it grows, breathe out as it shrinks.</p>
      <div class="breathe-wrap"><div class="bubble" id="bubble"></div></div>
      <p class="feedback" id="cue" aria-live="polite">Tap start when you are ready.</p>
      <div class="row" style="justify-content:center"><button class="btn" data-act="toggle" id="bt">▶ Start</button></div>`, {
      toggle() {
        const b = $('#bubble'), on = !b.classList.contains('go');
        cleanups.forEach((f) => f()); cleanups = [];
        b.classList.toggle('go', on);
        $('#bt').textContent = on ? '⏸ Stop' : '▶ Start';
        $('#cue').textContent = on ? '' : 'Tap start when you are ready.';
        if (!on) return;
        // Cues follow the 10s CSS cycle: in 4s, hold 1.5s, out 4.5s.
        const cycle = () => {
          $('#cue').textContent = 'Breathe in… 🌬️'; speak('Breathe in');
          later(() => { $('#cue').textContent = 'Hold…'; }, 4000);
          later(() => { $('#cue').textContent = 'Breathe out… 😮‍💨'; speak('Breathe out'); }, 5500);
        };
        cycle(); every(cycle, 10000);
      },
    });
  },

  timer() {
    const pickScreen = () => render('Timer', `
      <p class="lead">How long?</p>
      <div class="grid">${[1, 2, 5, 10, 15].map((m) => tile('start', '⏱️', `${m} min`, `data-m="${m}"`)).join('')}</div>`,
      { start: (el) => run(+el.dataset.m * 60000) });

    const run = (total) => {
      const end = performance.now() + total;
      render('Timer', `
        <div class="timer" id="pie"><span id="left"></span></div>
        <p class="feedback" id="tmsg">The orange part gets smaller as time goes.</p>
        <div class="row" style="justify-content:center"><button class="btn ghost" data-act="stop">Stop</button></div>`,
        { stop: () => { cleanups.forEach((f) => f()); cleanups = []; pickScreen(); } });
      const pie = $('#pie'), left = $('#left');
      const tick = () => {
        const ms = Math.max(0, end - performance.now());
        pie.style.setProperty('--p', (ms / total).toFixed(4));
        const s = Math.ceil(ms / 1000);
        left.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
        if (ms === 0) {
          cleanups.forEach((f) => f()); cleanups = [];
          $('#tmsg').textContent = '✅ Time is finished!';
          chime('done'); speak('Time is finished');
        }
      };
      tick(); every(tick, 250); // 4 updates a second is smooth enough and very cheap
    };
    pickScreen();
  },

  stars() {
    const earned = Math.min(STICKERS.length, Math.floor(state.stars / 10));
    render('My Stars', `
      <div class="reward"><span class="emoji">⭐</span><p>You have <b>${state.stars}</b> stars!</p></div>
      <p class="lead">Every 10 stars unlocks a new sticker.</p>
      <div class="grid">${STICKERS.map((s, i) => `<div class="tile ${i < earned ? 'done' : ''}" aria-label="${i < earned ? 'Sticker' : 'Locked sticker'}">
        <span class="emoji">${i < earned ? s : '🔒'}</span>${i < earned ? '' : `${(i + 1) * 10} ⭐`}</div>`).join('')}</div>`);
  },

  settings() {
    const s = state.settings;
    const seg = (key, opts) => `<div class="seg">${opts.map(([v, label]) =>
      `<button data-act="set" data-k="${key}" data-v="${v}" aria-pressed="${String(s[key]) === String(v)}">${label}</button>`).join('')}</div>`;
    render('Grown-up settings', `
      <div class="setting"><span>Sounds</span>${seg('sound', [[true, 'On'], [false, 'Off']])}</div>
      <div class="setting"><span>Spoken voice</span>${seg('voice', [[true, 'On'], [false, 'Off']])}</div>
      <div class="setting"><span>Answer choices</span>${seg('choices', [[2, '2'], [3, '3'], [4, '4']])}</div>
      <div class="setting"><span>Counting up to</span>${seg('countMax', [[3, '3'], [5, '5'], [10, '10']])}</div>
      <div class="setting"><span>Colours</span>${seg('theme', [['calm', 'Calm'], ['night', 'Night'], ['contrast', 'High contrast']])}</div>
      <div class="setting"><span>Text size</span>${seg('font', [['normal', 'Normal'], ['large', 'Large']])}</div>
      <div class="setting"><span>Button motion</span>${seg('motion', [['on', 'On'], ['off', 'Off']])}</div>
      <div class="row">
        <button class="btn ghost" data-act="resetRoutines">Reset today’s routines</button>
        <button class="btn ghost" data-act="resetStars">Reset stars</button>
      </div>
      <p class="lead" style="margin-top:24px">All progress stays on this device. Nothing is sent online.</p>`, {
      set(el) {
        const v = el.dataset.v;
        s[el.dataset.k] = v === 'true' ? true : v === 'false' ? false : isNaN(v) ? v : +v;
        save(); applySettings(); SCREENS.settings();
      },
      resetRoutines() { if (confirm('Reset all of today’s routines?')) { state.routines = { date: today(), done: {} }; save(); } },
      resetStars() { if (confirm('Reset stars to 0?')) { state.stars = 0; save(); applySettings(); } },
    });
  },
};

// ---------- Learning games ----------
// Each make(n) returns one question with n choices and the index of the right one.

function build(correct, wrongs, toChoice) {
  const all = shuffle([correct, ...wrongs]);
  return { choices: all.map(toChoice), answer: all.indexOf(correct) };
}

const GAMES = {
  colors: { emoji: '🎨', name: 'Colours', make(n) {
    const c = pick(COLORS);
    return { text: `Find <b>${c[0]}</b>`, say: `Find ${c[0]}`,
      ...build(c, sample(COLORS, n - 1, c), ([name, hex]) => ({ label: name, html: `<span class="swatch" style="background:${hex}"></span>` })) };
  } },
  shapes: { emoji: '🔷', name: 'Shapes', make(n) {
    const names = Object.keys(SHAPES), s = pick(names), color = pick(COLORS)[1];
    return { text: `Find the <b>${s}</b>`, say: `Find the ${s}`,
      ...build(s, sample(names, n - 1, s), (x) => ({ label: x, html: shapeSvg(x, color) })) };
  } },
  counting: { emoji: '🔢', name: 'Counting', make(n) {
    const max = state.settings.countMax, k = 1 + (Math.random() * max | 0), item = pick(COUNT_ITEMS);
    const nums = Array.from({ length: Math.max(max, n) }, (_, i) => i + 1);
    return { text: 'How many?', say: 'How many? Count them.', show: item.repeat(k),
      ...build(k, sample(nums, n - 1, k), (x) => ({ label: String(x), html: String(x), word: true })) };
  } },
  letters: { emoji: '🔤', name: 'Letters', make(n) {
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), L = pick(abc);
    return { text: `Find the letter <b>${L}</b>`, say: `Find the letter ${L}`,
      ...build(L, sample(abc, n - 1, L), (x) => ({ label: x, html: x, word: true })) };
  } },
  words: { emoji: '🐶', name: 'Words', make(n) {
    const t = pick(THINGS);
    return { text: `Find the <b>${t[1]}</b>`, say: `Find the ${t[1]}`,
      ...build(t, sample(THINGS, n - 1, t), ([e, w]) => ({ label: w, html: e })) };
  } },
  habits: { emoji: '🧼', name: 'Good Habits', make(n) {
    const [question, emoji, word, wrong] = pick(HABITS);
    return { text: question, say: question,
      ...build(emoji, shuffle(wrong).slice(0, n - 1), (e) => ({ label: e === emoji ? word : e, html: e })) };
  } },
};

// ---------- Top bar: home + press-and-hold settings (keeps kids out of settings) ----------

$('#home-btn').addEventListener('click', () => go('#/'));
(() => {
  const btn = $('#settings-btn');
  let t;
  const cancel = () => { clearTimeout(t); btn.classList.remove('holding'); };
  btn.addEventListener('pointerdown', () => {
    btn.classList.add('holding');
    t = setTimeout(() => { cancel(); go('#/settings'); }, 1500);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, cancel));
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
  btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.shiftKey) go('#/settings'); });
})();

// ---------- Boot ----------

applySettings();
window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
