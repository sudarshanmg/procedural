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
const numCircles = 20;
const circles = [];
const radii = [10, 15, 5, 5];
for (let i = 0; i < numCircles; i++) {
  circles.push(new Circle(250, 250, 15 - i * 0.4, 20, ctx, i));
}

let mouseX = circles[0].x;
let mouseY = circles[0].y;

// Update mouse position on move
canvas.addEventListener("mousemove", (e) => {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
});

// Animation loop using requestAnimationFrame
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Smoothly move head towards the mouse
  const smoothingFactor = 0.1; // Adjust this for smoother movement
  circles[0].x += (mouseX - circles[0].x) * smoothingFactor;
  circles[0].y += (mouseY - circles[0].y) * smoothingFactor;

  // console.log(circles[0].x, mouseX);

  // Make the rest of the snake follow
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

  requestAnimationFrame(animate);
}

animate(); // Start animation loop
