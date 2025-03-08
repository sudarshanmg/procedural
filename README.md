Got it! Here’s the corrected version with proper inline and block math formatting:

---

## **1. Distance Constraint (Maintaining Fixed Distance Between Circles)**

Each segment follows the previous one while maintaining a fixed distance $d$. Given the target position $(x_t, y_t)$, the new position $(x_n, y_n)$ is computed as:

$$
dx = x_t - x
$$

$$
dy = y_t - y
$$

$$
\text{distance} = \sqrt{dx^2 + dy^2}
$$

To maintain a fixed distance $d$, normalize the vector:

$$
x_n = x_t - dx \times \frac{d}{\text{distance}}
$$

$$
y_n = y_t - dy \times \frac{d}{\text{distance}}
$$

### **Code Implementation**

```js
let dx = targetX - this.x;
let dy = targetY - this.y;
let distance = Math.sqrt(dx * dx + dy * dy);

if (distance > this.inf || distance < this.inf) {
  let scale = this.inf / distance;
  this.x = targetX - dx * scale;
  this.y = targetY - dy * scale;
}
```

---

## **2. Angle Constraint (Preventing Sharp Turns)**

To ensure smooth turns, the angle between the previous and current segment is constrained. Given vectors **A** and **B**:

$`A = (x_p - x_t, y_p - y_t)`$

$`B = (x_n - x_t, y_n - y_t)`$

### **Compute the Angle Between Two Vectors**

$$
\theta = \cos^{-1} \left( \frac{A \cdot B}{|A| |B|} \right)
$$

Where:

$`A \cdot B = (x_p - x_t)(x_n - x_t) + (y_p - y_t)(y_n - y_t)`$

$`|A| = \sqrt{(x_p - x_t)^2 + (y_p - y_t)^2}`$

$`|B| = \sqrt{(x_n - x_t)^2 + (y_n - y_t)^2}`$

If $`\theta < \theta_{\min}`$, correct the angle by rotating vector $B$:

$$
\theta_{\text{correction}} = \theta_{\min} - \theta
$$

Using the cross product to determine the rotation direction:

$$
\text{cross} = (x_p - x_t)(y_n - y_t) - (y_p - y_t)(x_n - x_t)
$$

$`\text{direction} = \text{sign}(\text{cross})`$

$$
\theta' = \theta_{\text{correction}} \times \text{direction}
$$

Rotate vector $B$ using the rotation matrix:

$$
x'_n = x_t + (x_n - x_t) \cos(\theta') - (y_n - y_t) \sin(\theta')
$$

$$
y'_n = y_t + (x_n - x_t) \sin(\theta') + (y_n - y_t) \cos(\theta')
$$

### **Code Implementation**

```js
const dot = ax * bx + ay * by;
const angle = Math.acos(dot / (mod_a * mod_b));
const MIN_ANGLE = (130 * Math.PI) / 180; // 130 degrees

if (angle < Math.PI / 2) {
  const angle_correction = MIN_ANGLE - angle;
  const cross = ax * by - ay * bx;
  const direction = cross > 0 ? 1 : -1;
  const theta = direction * angle_correction;
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);

  this.x = targetX + bx * cosTheta - by * sinTheta;
  this.y = targetY + bx * sinTheta + by * cosTheta;
}
```

---

## **3. Eye Movement (Following the Direction of Motion)**

The eyes should point in the direction of movement. Compute the movement angle:

$$
\alpha = \tan^{-1} \left( \frac{y - y_{\text{prev}}}{x - x_{\text{prev}}} \right)
$$

Smoothly interpolate this angle using an exponential moving average:

$$
\theta_{\text{smooth}} = (1 - s) \theta_{\text{old}} + s \alpha
$$

where $s$ is a smoothing factor (e.g., $s = 0.2$).

The eyes are placed at an offset distance $r$ from the center:

$$
x_{\text{left}} = x + r \cos(\theta_{\text{smooth}} + \phi)
$$

$$
y_{\text{left}} = y + r \sin(\theta_{\text{smooth}} + \phi)
$$

$$
x_{\text{right}} = x + r \cos(\theta_{\text{smooth}} - \phi)
$$

$$
y_{\text{right}} = y + r \sin(\theta_{\text{smooth}} - \phi)
$$

where $`\phi`$ is the fixed eye offset angle (e.g., $`45^\circ`$).

### **Code Implementation**

```js
let dx = this.x - this.prevX;
let dy = this.y - this.prevY;
let targetAngle = Math.atan2(dy, dx);

const smoothingFactor = 0.2;
this.angle = this.angle * (1 - smoothingFactor) + targetAngle * smoothingFactor;

const eyeOffset = this.r * 1;
const eyeAngle = Math.PI / 4;

const leftEyeX = this.x + eyeOffset * Math.cos(this.angle + eyeAngle);
const leftEyeY = this.y + eyeOffset * Math.sin(this.angle + eyeAngle);
const rightEyeX = this.x + eyeOffset * Math.cos(this.angle - eyeAngle);
const rightEyeY = this.y + eyeOffset * Math.sin(this.angle - eyeAngle);

this.ctx.beginPath();
this.ctx.arc(leftEyeX, leftEyeY, this.r * 0.3, 0, 2 * Math.PI);
this.ctx.fillStyle = "black";
this.ctx.fill();

this.ctx.beginPath();
this.ctx.arc(rightEyeX, rightEyeY, this.r * 0.3, 0, 2 * Math.PI);
this.ctx.fillStyle = "black";
this.ctx.fill();
```

---

## **How to Run Locally**

### **Using Python HTTP Server**

If you have Python installed, run this in your project folder:

```sh
python -m http.server 8000
```

Then, open `http://localhost:8000` in your browser.

### **Using Node.js**

If you have Node.js installed, run:

```sh
npx http-server
```

Then, open `http://localhost:8080` (or whichever port it runs on).

### **Using VS Code**

1. Install the **Live Server** extension.
2. Right-click `index.html` and select **Open with Live Server**.

---

This ensures:
✅ The snake smoothly follows the mouse.  
✅ The angle correction prevents sharp turns.  
✅ The eyes smoothly track movement direction.

Let me know if you need any modifications! 🚀
