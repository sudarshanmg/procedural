const canvas = document.getElementById("canvas");

class Circle {
  constructor(x, y, r, inf, ctx, i) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.inf = inf; // Maximum movement per frame
    this.ctx = ctx;
    this.i = i;
    this.prevX = x; // Store previous position
    this.prevY = y;
    this.angle = 0;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.stroke(); // Smaller than the main circle
    if (this.i === 0) {
      this.drawEyes();
    }
    this.prevX = this.x;
    this.prevY = this.y;
  }

  drawEyes() {
    const eyeOffset = this.r * 1; // Distance from center
    const eyeAngle = Math.PI / 4; // Angle for eye placement

    // Compute movement direction
    let dx = this.x - this.prevX;
    let dy = this.y - this.prevY;
    let targetAngle = Math.atan2(dy, dx); // Get movement angle

    // Smooth interpolation
    const smoothingFactor = 0.2; // Adjust this for smoother transition
    this.angle =
      this.angle * (1 - smoothingFactor) + targetAngle * smoothingFactor;

    // Compute eye positions using rotation
    const leftEyeX = this.x + eyeOffset * Math.cos(this.angle + eyeAngle);
    const leftEyeY = this.y + eyeOffset * Math.sin(this.angle + eyeAngle);
    const rightEyeX = this.x + eyeOffset * Math.cos(this.angle - eyeAngle);
    const rightEyeY = this.y + eyeOffset * Math.sin(this.angle - eyeAngle);

    // Draw left eye
    this.ctx.beginPath();
    this.ctx.arc(leftEyeX, leftEyeY, this.r * 0.3, 0, 2 * Math.PI);
    this.ctx.fillStyle = "black";
    this.ctx.fill();

    // Draw right eye
    this.ctx.beginPath();
    this.ctx.arc(rightEyeX, rightEyeY, this.r * 0.3, 0, 2 * Math.PI);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
  }

  follow(targetX, targetY, prevX, prevY) {
    // distance
    let dx = targetX - this.x;
    let dy = targetY - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Maintain distance constraint
    if (distance > this.inf || distance < this.inf) {
      let scale = this.inf / distance;
      this.x = targetX - dx * scale;
      this.y = targetY - dy * scale;

      if (prevX !== undefined && prevY !== undefined) {
        const ax = prevX - targetX;
        const ay = prevY - targetY;
        const bx = this.x - targetX;
        const by = this.y - targetY;
        const mod_a = Math.sqrt(ax * ax + ay * ay);
        const mod_b = Math.sqrt(bx * bx + by * by);
        const dot = ax * bx + ay * by;

        const angle = Math.acos(dot / (mod_a * mod_b));
        const MIN_ANGLE = (130 * Math.PI) / 180; // 130 deg

        if (angle < Math.PI / 2) {
          const angle_correction = MIN_ANGLE - angle;
          const cross = ax * by - ay * bx;
          const direction = cross > 0 ? 1 : -1; // 1 for CCW, -1 for CW
          const theta = direction * angle_correction;
          const cosTheta = Math.cos(theta);
          const sinTheta = Math.sin(theta);

          this.x = targetX + bx * cosTheta - by * sinTheta;
          this.y = targetY + bx * sinTheta + by * cosTheta;
        }
      }
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
  circles.push(new Circle(250, 250, 10 - i * 0.2, 20, ctx, i));
}

canvas.addEventListener("mousemove", (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Smoothly move head towards the mouse
  const smoothingFactor = 0.1; // Adjust for more or less smoothness
  circles[0].x += (e.offsetX - circles[0].x) * smoothingFactor;
  circles[0].y += (e.offsetY - circles[0].y) * smoothingFactor;

  // Make the rest of the snake follow the previous segment
  for (let i = 1; i < circles.length; i++) {
    circles[i].follow(
      circles[i - 1].x,
      circles[i - 1].y,
      circles[i - 2]?.x,
      circles[i - 2]?.y
    );
  }

  // Draw all circles
  circles.forEach((circle) => circle.draw());
});
