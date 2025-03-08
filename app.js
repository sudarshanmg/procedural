import { Circle } from "./Circle.js";
const canvas = document.getElementById("canvas");

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
