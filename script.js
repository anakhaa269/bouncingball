const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomColorName() {
  const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Cyan', 'Magenta'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const colorMap = {
  Red: 'rgb(255, 80, 80)',
  Green: 'rgb(100, 255, 100)',
  Blue: 'rgb(100, 100, 255)',
  Yellow: 'rgb(255, 255, 100)',
  Cyan: 'rgb(100, 255, 255)',
  Magenta: 'rgb(255, 100, 255)'
};

class Ball {
  constructor() {
    this.radius = random(15, 30);
    this.x = random(this.radius, canvas.width - this.radius);
    this.y = random(this.radius, canvas.height - this.radius);
    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
    this.colorName = randomColorName();
    this.color = colorMap[this.colorName];
    this.exists = true;
  }

  draw() {
    if (!this.exists) return;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (!this.exists) return;

    if ((this.x + this.radius) >= canvas.width || (this.x - this.radius) <= 0) {
      this.vx = -this.vx;
    }

    if ((this.y + this.radius) >= canvas.height || (this.y - this.radius) <= 0) {
      this.vy = -this.vy;
    }

    this.x += this.vx;
    this.y += this.vy;
  }
}

// Create balls
let balls = [];
const count = 30;
for (let i = 0; i < count; i++) {
  balls.push(new Ball());
}

// Collection tracking
let collectedTotal = 0;
let collectedColors = {};

function updateCounterPanel() {
  document.getElementById('total-count').textContent = collectedTotal;
  const colorList = document.getElementById('color-counts');
  colorList.innerHTML = '';

  for (let color in collectedColors) {
    const li = document.createElement('li');
    li.textContent = `${color}: ${collectedColors[color]}`;
    li.style.color = colorMap[color];
    colorList.appendChild(li);
  }
}

// Animation
function animate() {
  ctx.fillStyle = 'rgba(17, 17, 17, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  balls.forEach(ball => {
    ball.update();
    ball.draw();
  });

  requestAnimationFrame(animate);
}

animate();

// Click to collect
canvas.addEventListener('click', (e) => {
  const clickX = e.clientX;
  const clickY = e.clientY;

  balls.forEach(ball => {
    if (ball.exists) {
      const dx = ball.x - clickX;
      const dy = ball.y - clickY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= ball.radius) {
        ball.exists = false;
        collectedTotal++;

        if (collectedColors[ball.colorName]) {
          collectedColors[ball.colorName]++;
        } else {
          collectedColors[ball.colorName] = 1;
        }

        updateCounterPanel();
      }
    }
  });
});
