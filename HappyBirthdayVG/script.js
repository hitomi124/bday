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

music.volume = volumeSlider.value;

musicBtn.onclick = () => {
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

volumeSlider.oninput = () => {
  music.volume = volumeSlider.value;
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

  fetch('/', {
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
