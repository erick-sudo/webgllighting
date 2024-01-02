// Vertex Shader
const VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Color;\n" +     // Surface base color
  "attribute vec4 a_Normal;\n" +    // Surface orientation
  "uniform mat4 u_MvpMatrix;\n" +   // Model view projection matrix
  "uniform mat4 u_ModelMatrix;\n" + // Model matrix
  "uniform mat4 u_NormalMatrix;\n" +    // Transformation matrix of normal (Magic matrix -> Inverse transpose matrix of the model matrix)
  "varying vec3 v_Normal;\n" +
  "varying vec3 v_Position;\n" +
  "varying vec4 v_Color;\n" +           // Per-vertex color
  "void main() {\n" +
  " gl_Position = u_MvpMatrix * a_Position;\n" +
  // Calculate the vertex position in the world coordinate
  " v_Position = vec3(u_ModelMatrix * a_Position);\n" +
  // Recalculation of the normal based on the model matrix and normalized
  " v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n" +
  " v_Color = a_Color;\n" +
  "}\n";

const FSHADER_SOURCE =
  "#ifdef GL_ES\n" +
  "precision mediump float;\n" +
  "#endif\n" +
  "uniform vec3 u_LightColor;\n" +      // Light Color
  "uniform vec3 u_LightPosition;\n" +   // Position of the light source (in the world coordinate system)
  "uniform vec3 u_AmbientLight;\n" +    // Ambient light (for shading)
  "varying vec3 v_Normal;\n" +
  "varying vec3 v_Position;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
    // Recalculation of the normal since it is interpolated and is not unit any more
  " vec3 normal = normalize(v_Normal);\n" +
    // Compute the light direction and normalize it
  " vec3 lightDirection = normalize(u_LightPosition - v_Position);\n" +
    // The dot product of the light direction and the orientation of a surface (the normal)
  " float nDotL = max(dot(lightDirection, normal), 0.0);\n" +
    // Calculating surface color due to diffuse reflection
  " vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n" +
    // Calculating surface color due to ambient reflection
  " vec3 ambient = u_AmbientLight * v_Color.rgb;\n" +
    // Adding the surface colors due to diffuse reflection and ambient reflection
  " gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n" +
  "}\n";

const ANGLE_STEP = 15.0;

function main() {
  // Retrieve <canvas> element
  const canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  // Set the vertex coordinates and color (the blue triangle is in the front)
  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("Failed to set the vertex information");
    return;
  }

  // Set the clear color and enable the depth test and take care of ZFighting
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.POLYGON_OFFSET_FILL);

  const u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  const u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
  const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')
  const u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
  const u_LightPosition = gl.getUniformLocation(gl.program, "u_LightPosition");
  const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');

  if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition || !u_AmbientLight) { 
    console.log('Failed to get the storage location');
    return;
  }

  // Light color (white)
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  // Light position (in the world coordinate)
  gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);
  // Ambient light
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

  const modelMatrix = new Matrix4();    // Model matrix
  const mvpMatrix = new Matrix4();      // Model view projection matrix

  // Pass the model view projection matrix to u_MvpMatrix
  mvpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  mvpMatrix.lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0);

  let currentAngle = 0.0

  const run = () => {
    currentAngle = animate(currentAngle)
    draw(gl, n, currentAngle, u_ModelMatrix, modelMatrix, u_MvpMatrix, mvpMatrix, u_NormalMatrix)
    requestAnimationFrame(run, canvas)
  }

  run()
}

function draw(gl, n, angle, u_ModelMatrix, modelMatrix, u_MvpMatrix, mvpMatrix, u_NormalMatrix) {
    const normalMatrix = new Matrix4();   // Transformation matrix for normals
    const modelViewMatrix = new Matrix4().set(mvpMatrix)
    // Calculate the model matrix
    modelMatrix.rotate(1, 1, 1, 1);  // Rotate 90 degrees counterclockwise around the y-axis
    // Pass the model matrix to u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    modelViewMatrix.multiply(modelMatrix)
    gl.uniformMatrix4fv(u_MvpMatrix, false, modelViewMatrix.elements)

    // Compute magic matrix
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements)

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  const vertices = new Float32Array([   // Vertex coordinates
     2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  -2.0,-2.0, 2.0,   2.0,-2.0, 2.0,    // v0-v1-v2-v3 front
     2.0, 2.0, 2.0,   2.0,-2.0, 2.0,   2.0,-2.0,-2.0,   2.0, 2.0,-2.0,    // v0-v3-v4-v5 right
     2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0,    // v0-v5-v6-v1 up
    -2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0,    // v1-v6-v7-v2 left
    -2.0,-2.0,-2.0,   2.0,-2.0,-2.0,   2.0,-2.0, 2.0,  -2.0,-2.0, 2.0,    // v7-v4-v3-v2 down
     2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0, 2.0,-2.0,   2.0, 2.0,-2.0     // v4-v7-v6-v5 back
  ]);

  const colors = new Float32Array([     // Colors
  1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
  1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
  1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
  1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
  1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
  1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0      // v4-v7-v6-v5 back
]);

  const normals = new Float32Array([    // Normal
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
  ]);

  const indices = new Uint8Array([       // Indices of the vertices
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Write the vertex property to buffers (coordinatesm colors and normals)
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, "a_Position")) return -1;
  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, "a_Color")) return -1;
  if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, "a_Normal")) return -1;

  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
    // Create a buffer object
    const buffer = gl.createBuffer();
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    const a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
      console.log('Failed to get the storage location of ' + attribute);
      return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    return true;
  }

// Last time that this function was called
let g_last = Date.now();
function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}