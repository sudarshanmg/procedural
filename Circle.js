export class Circle {
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
    this.ctx.stroke();

    if (this.i === 0) {
      this.drawEyes();
    }
    this.drawLegs();

    this.prevX = this.x;
    this.prevY = this.y;
  }

  drawEyes() {
    const eyeOffset = this.r * 1;
    const eyeAngle = Math.PI / 4;

    // Compute movement direction
    let dx = this.x - this.prevX;
    let dy = this.y - this.prevY;
    let targetAngle = Math.atan2(dy, dx);

    // Smooth interpolation
    const smoothingFactor = 0.2;
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

  drawLegs() {
    const legOffset = this.r * 2;
    const legAngle = Math.PI / 2;

    // Compute movement direction
    let dx = this.x - this.prevX;
    let dy = this.y - this.prevY;
    let targetAngle = Math.atan2(dy, dx);

    // Smooth interpolation
    const smoothingFactor = 1;
    this.angle =
      this.angle * (1 - smoothingFactor) + targetAngle * smoothingFactor;

    // Compute eye positions using rotation
    const leftLegX = this.x + legOffset * Math.cos(this.angle + legAngle);
    const leftLegY = this.y + legOffset * Math.sin(this.angle + legAngle);
    const rightLegX = this.x + legOffset * Math.cos(this.angle - legAngle);
    const rightLegY = this.y + legOffset * Math.sin(this.angle - legAngle);

    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(leftLegX, leftLegY);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(rightLegX, rightLegY);
    this.ctx.stroke();
  }

  follow(targetX, targetY, prevX, prevY) {
    let dx = targetX - this.x;
    let dy = targetY - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.inf || distance < this.inf) {
      if (distance !== 0) {
        let scale = this.inf / distance;
        const newX = targetX - dx * scale;
        const newY = targetY - dy * scale;
        const smoothFactor = 0.5; // Adjust for smoother movement
        this.x += (newX - this.x) * smoothFactor;
        this.y += (newY - this.y) * smoothFactor;
      }
    }
    if (prevX !== undefined && prevY !== undefined) {
      const ax = prevX - targetX;
      const ay = prevY - targetY;
      const bx = this.x - targetX;
      const by = this.y - targetY;
      const mod_a = Math.sqrt(ax * ax + ay * ay);
      const mod_b = Math.sqrt(bx * bx + by * by);
      const dot = ax * bx + ay * by;

      const angle = Math.acos(dot / (mod_a * mod_b));
      const MIN_ANGLE = (130 * Math.PI) / 180;

      if (angle < Math.PI / 2) {
        const angle_correction = MIN_ANGLE - angle;
        const cross = ax * by - ay * bx;
        const direction = cross > 0 ? 1 : -1;
        const targetTheta = direction * angle_correction;

        const cosTheta = Math.cos(targetTheta);
        const sinTheta = Math.sin(targetTheta);

        let newX = bx * cosTheta - by * sinTheta;
        let newY = bx * sinTheta + by * cosTheta;

        // 🎯 Smooth transition for rotation correction
        const smoothFactor = 0.5;
        this.x += (targetX + newX - this.x) * smoothFactor;
        this.y += (targetY + newY - this.y) * smoothFactor;
      }
    }
  }
}
