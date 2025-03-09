export class Circle {
  constructor(x, y, r, inf, ctx, i) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.inf = inf; // inf -> influence
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
    this.angle = Math.atan2(dy, dx); // Get movement angle

    // Compute eye positions using rotation
    const leftEyeX = this.x + eyeOffset * Math.cos(this.angle + eyeAngle);
    const leftEyeY = this.y + eyeOffset * Math.sin(this.angle + eyeAngle);
    const rightEyeX = this.x + eyeOffset * Math.cos(this.angle - eyeAngle);
    const rightEyeY = this.y + eyeOffset * Math.sin(this.angle - eyeAngle);

    // left eye
    this.ctx.beginPath();
    this.ctx.arc(leftEyeX, leftEyeY, this.r * 0.3, 0, 2 * Math.PI);
    this.ctx.fillStyle = "black";
    this.ctx.fill();

    // right eye
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
    }
    // angle constraint
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
