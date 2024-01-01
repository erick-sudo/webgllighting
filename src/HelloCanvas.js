// Vertext shader program
const VSHADER_SOURCE =
  "attribute vec4 a_Position;" +
  "attribute float a_PointSize;" +
  "void main() {" +
  " gl_Position = a_Position;" +
  " gl_PointSize = a_PointSize;" +
  "}";

// Fragment shader program
const FSHADER_SOURCE =
  "precision mediump float;" +
  "uniform vec4 u_FlagColor;" +
  "void main() {" +
  " gl_FragColor = u_FlagColor;" +
  "}";

function main() {
  const canvas = document.getElementById("webgl");

  // Get webgl rendering context
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  //Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders.");
    return;
  }

  // Get storage location for an attribute variable
  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
  const u_FlagColor = gl.getUniformLocation(gl.program, "u_FlagColor");
  if (a_Position < 0 || a_PointSize < 0 || u_FlagColor < 0) {
    console.log("failed to get the storage location");
    return;
  }

  gl.vertexAttrib1f(a_PointSize, 10.0);

  canvas.onmousedown = (ev) => {
    click(ev, gl, canvas, a_Position, u_FlagColor);
  };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);
}

let g_points = [];
let g_colors = [];

const click = (ev, gl, canvas, a_Position, u_FlagColor) => {
  let x = ev.clientX;
  let y = ev.clientY;
  let rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  g_points.push([x, y]);
  if (x >= 0.0 && y >= 0.0) {
    g_colors.push([1.0, 0.0, 0.0, 1.0]);
  } else if (x < 0.0 && y < 0.0) {
    g_colors.push([0.0, 1.0, 0.0, 1.0]);
  } else {
    g_colors.push([1.0, 1.0, 1.0, 1.0]);
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let i = 0; i < g_points.length; i++) {
    // Pass the vertext position to the attribute variable
    gl.vertexAttrib2fv(a_Position, new Float32Array(g_points[i]));
    gl.uniform4fv(u_FlagColor, new Float32Array(g_colors[i]));

    gl.drawArrays(gl.POINTS, 0, 1);
  }
};
