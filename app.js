const stage = document.querySelector('#stage');
const ui = document.querySelector('#ui');
const context = stage.getContext('2d');

const states = {
  menu: 'menu',
  garage: 'garage',
  arena: 'arena',
  results: 'results',
};

const step = 1 / 60;
const maxFrame = 0.25;

let currentState = states.menu;
let accumulator = 0;
let lastTime = performance.now();

function resizeStage() {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  const ratio = window.devicePixelRatio || 1;

  stage.width = Math.round(width * ratio);
  stage.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function renderMenu() {
  ui.hidden = false;
  ui.innerHTML = '';

  const menu = document.createElement('div');
  menu.className = 'menu';

  const title = document.createElement('h1');
  title.className = 'menu-title';
  title.textContent = 'Vehicular Combat Demo';

  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'menu-play';
  play.textContent = 'PLAY';
  play.addEventListener('click', () => setState(states.garage));

  menu.append(title, play);
  ui.append(menu);
}

function setState(next) {
  currentState = next;

  if (next !== states.menu) {
    ui.hidden = true;
    ui.innerHTML = '';
    console.log(`state: ${next}`);
    return;
  }

  renderMenu();
}

function update(dt) {
  if (currentState !== states.menu) {
    return;
  }

  void dt;
}

function render(frameSeconds) {
  const width = stage.width / (window.devicePixelRatio || 1);
  const height = stage.height / (window.devicePixelRatio || 1);

  context.clearRect(0, 0, width, height);
  context.fillStyle = '#080b12';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = '#172031';
  context.lineWidth = 1;
  context.strokeRect(0.5, 0.5, width - 1, height - 1);

  if (currentState === states.menu) {
    context.fillStyle = '#0d1320';
    context.fillRect(0, 0, width, height);
  }

  void frameSeconds;
}

function frame(now) {
  const seconds = Math.min((now - lastTime) / 1000, maxFrame);
  lastTime = now;
  accumulator += seconds;

  while (accumulator >= step) {
    update(step);
    accumulator -= step;
  }

  render(seconds);
  requestAnimationFrame(frame);
}

window.addEventListener('resize', resizeStage);

resizeStage();
setState(states.menu);
requestAnimationFrame(frame);

export { setState, states };
