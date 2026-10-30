const screen = document.getElementById("screen");

const chapters = [
  {
    number: "ИСПЫТАНИЕ ПЕРВОЕ",
    title: "Тайна нефритового дворца",
    symbol: "❖",
    caption: "ТАМ, ГДЕ ХРАНЯТСЯ ШЁЛКА И ТАЙНЫ",
    speaker: "Лисий посланник",
    text: "В старом дворце императрицы хранились редкие ткани, украшения и вещи, которым не доверяли дневной свет. Первый дар ждёт тебя за маленькой дверцей, среди вещей, скрытых от посторонних глаз. <strong>Ищи внутри шкафа — там, что открывается и выдвигается.</strong>",
    hint: "Подсказка: не на полке и не за дверцей. Подумай о том, что можно выдвинуть на себя.",
    found: "Первый дар найден",
    after: "Нефрит отозвался тихим звоном. Первый узел судьбы развязан."
  },
  {
    number: "ИСПЫТАНИЕ ВТОРОЕ",
    title: "Красная нить судьбы",
    symbol: "♧",
    caption: "ВЫШЕ ПРИВЫЧНОГО ВЗГЛЯДА",
    speaker: "Лисий посланник",
    text: "Красная нить соединяет тех, кому суждено встретиться. Но иногда самое важное оказывается выше того, куда обычно направлен взгляд. Второй дар укрыт на виду у самого дворца. <strong>Подними глаза туда, где шкаф касается потолка.</strong>",
    hint: "Подсказка: искать нужно не внутри. Посмотри на верхнюю поверхность шкафа.",
    found: "Второй дар найден",
    after: "Нить вспыхнула алым светом и указала дорогу к последнему испытанию."
  },
  {
    number: "ИСПЫТАНИЕ ТРЕТЬЕ",
    title: "Благословение луны",
    symbol: "☾",
    caption: "ТАМ, ГДЕ ЗАКАНЧИВАЕТСЯ ДЕНЬ",
    speaker: "Лисий посланник",
    text: "Два дара уже у тебя. Остался последний — самый тихий. Луна видит всё, даже то, что скрыто от глаз. Там, где ты отдыхаешь после долгого дня, есть пространство, куда редко заглядывает свет. <strong>Ищи под местом, где рождаются сны.</strong>",
    hint: "Подсказка: вспомни, где ты спишь. Последний дар находится под кроватью.",
    found: "Третий дар найден",
    after: "Три дара собрались вместе. Путь завершён, но главная тайна только сейчас откроется."
  }
];

let state = { step: 0, started: false, hintShown: false, sound: false };
const saved = localStorage.getItem("three-gifts-progress");
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    if (parsed && Number.isInteger(parsed.step) && parsed.step >= 0 && parsed.step <= 3 && parsed.started) {
      state = { ...state, ...parsed };
    }
  } catch (_) {}
}

function save() {
  localStorage.setItem("three-gifts-progress", JSON.stringify(state));
}

function dots() {
  return `<div class="progress-wrap"><span class="progress-label">ТРИ ДАРА</span><div class="progress-dots">
    ${[0,1,2].map(i => `<span class="progress-dot ${state.step > i ? "done" : ""}"></span>`).join("")}
  </div><span class="progress-label">${state.step}/3</span></div>`;
}

function start() {
  state.started = true;
  save();
  renderChapter();
}

function renderChapter() {
  if (state.step >= 3) return renderFinal();
  const c = chapters[state.step];
  state.hintShown = false;
  screen.innerHTML = `
    <div class="scene story-scene" style="--scene-glow:${["rgba(126,150,164,.32)","rgba(151,91,111,.32)","rgba(181,157,111,.30)"][state.step]}">
      <div class="story-art">
        <div class="art-halo"></div><div class="art-symbol">${c.symbol}</div>
        <div class="art-caption">${c.caption}</div>
      </div>
      <section class="dialogue">
        <div class="speaker">${c.number} · ${c.speaker}</div>
        <h2 class="story-title">${c.title}</h2>
        <p class="story-text">${c.text}</p>
        <div id="hint" class="hint-box hidden">${c.hint}</div>
        <div class="dialogue-bottom">
          ${dots()}
          <div class="action-row">
            <button id="hint-btn" class="secondary-btn" type="button">Подсказка</button>
            <button id="found-btn" class="primary-btn full" type="button">Я нашла дар <span>→</span></button>
          </div>
        </div>
      </section>
    </div>`;
  document.getElementById("hint-btn").addEventListener("click", () => {
    document.getElementById("hint").classList.toggle("hidden");
    document.getElementById("hint-btn").textContent = document.getElementById("hint").classList.contains("hidden") ? "Подсказка" : "Скрыть подсказку";
  });
  document.getElementById("found-btn").addEventListener("click", renderFound);
}

function renderFound() {
  const c = chapters[state.step];
  screen.innerHTML = `
    <div class="scene story-scene">
      <div class="story-art"><div class="art-halo"></div><div class="art-symbol">✧</div><div class="art-caption">СУДЬБА ОТКРЫВАЕТ СВОИ ТАЙНЫ</div></div>
      <section class="dialogue">
        <div class="speaker">ДАР ПРИНЯТ</div>
        <h2 class="story-title">${c.found}</h2>
        <p class="story-text">${c.after}</p>
        <div class="dialogue-bottom">
          ${dots()}
          <button id="next-btn" class="primary-btn full" type="button">${state.step === 2 ? "Узнать, что было предначертано" : "Продолжить путь"} <span>→</span></button>
        </div>
      </section>
    </div>`;
  document.getElementById("next-btn").addEventListener("click", () => {
    state.step += 1;
    save();
    renderChapter();
  });
}

function renderFinal() {
  screen.innerHTML = `
    <div class="scene final-scene">
      <div class="story-art"><div class="art-halo"></div><div class="art-symbol">❀</div><div class="art-caption">ТРИ ДАРА · ОДНА ОСОБЕННАЯ СУДЬБА</div></div>
      <section class="dialogue">
        <div class="speaker">ПОСЛЕДНЯЯ ГЛАВА · ИСТИНА</div>
        <h2 class="story-title" style="text-align:center">Самый ценный дар</h2>
        <p class="final-message">Три дара найдены, три тайны раскрыты.<br><br>Но ни нефрит, ни красная нить, ни благословение луны не сравнятся с тем, что я хочу пожелать тебе сегодня.<br><br><strong>Пусть в твоей жизни всегда будет место чудесам, смелым мечтам и счастью.</strong><br><br>С днём рождения, моя любимая! ❤️</p>
        <div class="dialogue-bottom">
          ${dots()}
          <div class="restart-note">Эта история создана только для тебя.<br>И я счастлив быть частью твоей судьбы.</div>
        </div>
      </section>
    </div>`;
}

document.getElementById("begin-btn")?.addEventListener("click", start);
document.getElementById("sound-toggle")?.addEventListener("click", () => {
  state.sound = !state.sound;
  const button = document.getElementById("sound-toggle");
  button.textContent = state.sound ? "♫" : "♪";
  button.style.opacity = state.sound ? "1" : ".65";
  // Музыка намеренно не запускается: добавьте свой аудиофайл и управление воспроизведением при желании.
});

if (state.started) {
  if (state.step >= 3) renderFinal();
  else renderChapter();
}
