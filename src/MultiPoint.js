// Vertext shader program
const VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute float a_PointSize;\n" +
  "uniform mat4 u_ModelMatrix;\n" +
  "attribute vec4 a_Color;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "   gl_Position = u_ModelMatrix * a_Position;\n" +
  "   gl_PointSize = a_PointSize;\n" +
  "   v_Color = a_Color;\n" +
  "}\n";

// Fragment shader program
const FSHADER_SOURCE =
  "precision mediump float;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  " gl_FragColor = v_Color;\n" +
  "}\n";

var ANGLE_STEP = 45.0;

let g_last = Date.now();

function main() {
  // Retrieve <canvas> element
  const canvas = document.getElementById("webgl");

  // Get the rendering context for WebGl
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // Initalize shader
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize the vertext and fragment shaders");
    return;
  }

  // Set the positions of vertices
  const n = initVertexBuffers(gl);

  // Set the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  if (n < 0) {
    console.log("Falied to set the positions of the vertices");
    return;
  }

  const u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  const modelMatrix = new Matrix4();

  let currentAngle = 0.0;

  const tick = () => {
    currentAngle = animate(currentAngle);
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
    requestAnimationFrame(tick);
  };

  tick();
}

function initVertexBuffers(gl) {
  const verticesColors = new Float32Array([
    0.0, 0.3, 1.0, 0.0, 0.0, 10.0, -0.3, -0.3, 0.0, 1.0, 0.0, 20.0, 0.3, -0.3,
    0.0, 0.0, 1.0, 30.0,
  ]);

  const n = 3; // The number of vertices

  // Create a buffer object
  const vertexColorBuffer = gl.createBuffer();

  if (!vertexColorBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

  // Write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  const FSIZE = verticesColors.BYTES_PER_ELEMENT;

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  const a_Color = gl.getAttribLocation(gl.program, "a_Color");
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);

  
  const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 5);
  gl.enableVertexAttribArray(a_PointSize);

  return n;
}

const draw = (gl, n, currentAngle, modelMatrix, u_ModelMatrix) => {
  // Set up rotation matrix
  modelMatrix.setRotate(currentAngle, 0, 0, 1);
  modelMatrix.translate(0.35, 0, 0);

  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw three points
  gl.drawArrays(gl.TRIANGLES, 0, n); // n is the number of points to draw
};

const animate = (angle) => {
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;

  let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return (newAngle %= 360);
};

function up() {
  ANGLE_STEP += 10;
}

function down() {
  ANGLE_STEP -= 10;
}
