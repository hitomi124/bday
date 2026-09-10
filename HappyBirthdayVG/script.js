const NAME = "Viona";
const BUTTON_TEXT = "Open this";
const PERSONAL_MESSAGE = "Hey, happy birthday! I hope your day is filled with peace and real happiness. Just wanted to remind you today how appreciated you are and that I'm always cheering for you. Praying for your good health, peace of mind, and all the comfort you need this year. Enjoy your special day, don't forget to smile, and please take care of yourself always. Happy birthday!";

const s = document.getElementById('story');
const b = document.getElementById('open');

['first', 'second', 'third'].forEach(x => {
  document.getElementById(x).textContent = NAME;
});
document.getElementById('message').textContent = PERSONAL_MESSAGE;
b.textContent = BUTTON_TEXT;

b.onclick = e => {
  const r = b.getBoundingClientRect();
  const i = document.createElement('i');
  i.className = 'ripple go';
  i.style.left = (e.clientX - r.left) + 'px';
  i.style.top = (e.clientY - r.top) + 'px';
  b.append(i);
  s.classList.add('opened');
};

(function addConfetti(){
  const sky = document.querySelector('.sky');
  const colors = ['#a56bd9', '#c09ae8', '#dfccfa', '#8c5bc7', '#e9d9ff'];
  const count = 16;
  for (let n = 0; n < count; n++) {
    const c = document.createElement('i');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + '%';
    c.style.background = colors[n % colors.length];
    c.style.animationDuration = (9 + Math.random() * 8) + 's';
    c.style.animationDelay = (Math.random() * -14) + 's';
    c.style.width = (4 + Math.random() * 4) + 'px';
    c.style.height = (7 + Math.random() * 6) + 'px';
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    sky.appendChild(c);
  }
})();

const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const volumeSlider = document.getElementById('volumeSlider');

let audioCtx, gainNode, sourceNode;

function setupAudioGraph() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  sourceNode = audioCtx.createMediaElementSource(music);
  gainNode = audioCtx.createGain();
  gainNode.gain.value = volumeSlider.value;

  sourceNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);
}

musicBtn.onclick = () => {
  setupAudioGraph();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (music.paused) {
    music.play();
    musicBtn.textContent = 'Pause';
    musicBtn.classList.add('playing');
  } else {
    music.pause();
    musicBtn.textContent = 'Play this, please';
    musicBtn.classList.remove('playing');
  }
};

document.addEventListener('visibilitychange', () => {
  if (!audioCtx || !gainNode) return;

  const now = audioCtx.currentTime;

  if (document.hidden) {
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
    setTimeout(() => {
      if (audioCtx.state === 'running') audioCtx.suspend();
    }, 120);
  } else {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => {
        const target = parseFloat(volumeSlider.value);
        const t = audioCtx.currentTime;
        gainNode.gain.cancelScheduledValues(t);
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(target, t + 0.15);
      });
    }
  }
});

volumeSlider.oninput = () => {
  if (gainNode) {
    gainNode.gain.value = volumeSlider.value;
  } else {
    music.volume = volumeSlider.value;
  }
};

const candleScene = document.getElementById('candleScene');
const flame = document.getElementById('flame');
const smoke = document.getElementById('smoke');
const wishBtn = document.getElementById('wishBtn');
const wishOverlay = document.getElementById('wishOverlay');
const wishClose = document.getElementById('wishClose');
const wishBox = document.getElementById('wishBox');
const wishInput = document.getElementById('wishInput');
const wishSubmit = document.getElementById('wishSubmit');
const wishThanks = document.getElementById('wishThanks');

b.addEventListener('click', () => {
  candleScene.classList.add('show');
});

flame.onclick = () => {
  if (flame.classList.contains('blown')) return;
  flame.classList.add('blown');
  smoke.classList.add('rise');

  setTimeout(() => {
    candleScene.classList.remove('show');
    wishBtn.style.display = 'inline-block';
  }, 1500);
};

wishBtn.onclick = () => {
  wishOverlay.classList.add('show');
};

wishClose.onclick = () => {
  wishOverlay.classList.remove('show');
};

wishOverlay.onclick = (e) => {
  if (e.target === wishOverlay) wishOverlay.classList.remove('show');
};

wishBox.addEventListener('submit', (e) => {
  e.preventDefault();
  if (wishInput.value.trim() === '') return;

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(new FormData(wishBox)).toString()
  }).then(() => {
    wishThanks.textContent = 'Your wish has been made. 💫';
    wishInput.value = '';
    wishInput.disabled = true;
    wishSubmit.disabled = true;
  });
});

const archeryScene = document.getElementById('archeryScene');
const archeryArrow = document.getElementById('arrow');
const giftTarget = document.getElementById('giftTarget');
const stringTop = document.getElementById('stringTop');
const stringBottom = document.getElementById('stringBottom');
const NOCK_REST_X = 35;

let dragging = false;
let startPointerX = 0;
let restArrowLeft = null;
const MAX_PULL = 90;
const FIRE_THRESHOLD = 0.4;

function updateString(dx){
  const x = NOCK_REST_X + dx;
  stringTop.setAttribute('x2', x);
  stringBottom.setAttribute('x2', x);
}

function getTravelDistance(){
  if (restArrowLeft === null) {
    restArrowLeft = archeryArrow.getBoundingClientRect().left;
  }
  const giftRect = giftTarget.getBoundingClientRect();
  const giftCenterX = giftRect.left + giftRect.width / 2;
  return giftCenterX - restArrowLeft;
}
getTravelDistance();

archeryArrow.addEventListener('pointerdown', (e) => {
  dragging = true;
  startPointerX = e.clientX;
  archeryArrow.setPointerCapture(e.pointerId);
  archeryArrow.classList.remove('firing', 'snap-back');
});

archeryArrow.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  let dx = e.clientX - startPointerX;
  dx = Math.min(0, Math.max(-MAX_PULL, dx));
  archeryArrow.style.transform = `translate(${dx}px,-50%)`;
  updateString(dx);
});

archeryArrow.addEventListener('pointerup', (e) => {
  if (!dragging) return;
  dragging = false;
  let dx = e.clientX - startPointerX;
  dx = Math.min(0, Math.max(-MAX_PULL, dx));
  const power = Math.abs(dx) / MAX_PULL;

  if (power >= FIRE_THRESHOLD) {
    const travel = getTravelDistance();
    archeryArrow.classList.add('firing');
    archeryArrow.style.transform = `translate(${travel}px,-50%)`;
    updateString(0);

    setTimeout(() => {
      giftTarget.classList.add('hit');
      setTimeout(() => {
        archeryScene.classList.add('hidden');
      }, 550);
    }, 460);
  } else {
    archeryArrow.classList.add('snap-back');
    archeryArrow.style.transform = 'translate(0,-50%)';
    updateString(0);
  }
});
