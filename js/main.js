//js/main.js

const form = document.getElementById('wishForm');
const bambooArea = document.getElementById('bambooArea');
const colorMode = document.getElementById('colorMode');
const colorInput = document.getElementById('colorInput');
const colorPickerLabel = document.getElementById('colorPickerLabel');
const modal = document.getElementById('modal');
const modalWish = document.getElementById('modalWish');
const modalName = document.getElementById('modalName');
const closeModal = document.getElementById('closeModal');

const COLORS = ['#FF69B4', '#87CEFA', '#FFD700', '#98FB98', '#FFB6C1'];

colorMode.addEventListener('change', () => {
  colorPickerLabel.classList.toggle('hidden', colorMode.value === 'random');
});

// 保存された短冊を読み込む
window.addEventListener('load', () => {
  const saved = JSON.parse(localStorage.getItem('tanzakuList') || '[]');
  saved.forEach(t => addTanzakuToBamboo(t));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const wish = document.getElementById('wishInput').value;
  const name = document.getElementById('nameInput').value;
  const color = (colorMode.value === 'random') 
    ? COLORS[Math.floor(Math.random() * COLORS.length)] 
    : colorInput.value;

  const textColor = document.getElementById('textColor').value;
  const newTanzaku = { wish, name, color, textColor, x: null, y: null };

  enablePlacement(newTanzaku);
});

function enablePlacement(tanzaku) {
  const handler = (e) => {
    const rect = bambooArea.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    const threshold = 10; // % 単位
    let ok = true;
    bambooArea.querySelectorAll('.tanzaku').forEach(el => {
      const lx = parseFloat(el.style.left);
      const ly = parseFloat(el.style.top);
      if (Math.hypot(lx - xPercent, ly - yPercent) < threshold) {
        ok = false;
      }
    });
    if (!ok) { alert('少しズラして配置してください'); return; }
    tanzaku.x = xPercent; tanzaku.y = yPercent;

    addTanzakuToBamboo(tanzaku);
    saveTanzaku(tanzaku);
    bambooArea.removeEventListener('click', handler);
  };
  bambooArea.addEventListener('click', handler);
  alert("飾りたい場所をタップしてください🌟");
}

function addTanzakuToBamboo({ wish, name, color, x, y }) {
  const div = document.createElement('div');
  div.className = 'tanzaku';
  const span = document.createElement('span');
  span.className = 'wish-text ' + (textColor === 'black' ? 'text-black' : 'text-white');
  span.textContent = wish;
  div.appendChild(span);
  div.style.backgroundColor = color;
  div.style.left = `${x}%`;
  div.style.top = `${y}%`;

  div.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modalWish.textContent = ` ${wish}`;
    modalName.textContent = ` ${name}`;
    modalWish.className = textColor === 'black' ? 'text-black' : 'text-white';
    modalName.className = textColor === 'black' ? 'text-black' : 'text-white';
    document.querySelector('.modal-content').style.backgroundColor = color;
  });

  bambooArea.appendChild(div);
}

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

function saveTanzaku(newOne) {
  const saved = JSON.parse(localStorage.getItem('tanzakuList') || '[]');
  saved.push(newOne);
  localStorage.setItem('tanzakuList', JSON.stringify(saved));
}
