const canvas = document.getElementById("canvas");

class Circle {
  constructor(x, y, r, inf, ctx) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.inf = inf; // Maximum movement per frame
    this.ctx = ctx;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  follow(targetX, targetY) {
    let dx = targetX - this.x;
    let dy = targetY - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Maintain distance constraint
    if (distance > this.inf) {
      let scale = this.inf / distance;
      this.x = targetX - dx * scale;
      this.y = targetY - dy * scale;
    }
  }
}

// Create high-DPI canvas
const createHighDPICanvas = (height, width) => {
  const ratio = window.devicePixelRatio;
  canvas.width = ratio * width;
  canvas.height = ratio * height;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  return ctx;
};

const ctx = createHighDPICanvas(600, 600);

const numCircles = 20; // Snake length
const circles = [];
for (let i = 0; i < numCircles; i++) {
  circles.push(new Circle(250, 250, 15 - i * 0.6, 20, ctx));
}

canvas.addEventListener("mousemove", (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  circles[0].x = e.offsetX;
  circles[0].y = e.offsetY;

  for (let i = 1; i < circles.length; i++) {
    circles[i].follow(circles[i - 1].x, circles[i - 1].y);
  }

  circles.forEach((circle) => circle.draw());
});
