// Vertex Shader
const VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Color;\n" +     // Surface base color
  "attribute vec4 a_Normal;\n" +    // Surface orientation
  "uniform mat4 u_MvpMatrix;\n" +
  "uniform mat4 u_NormalMatrix;\n" +    // Transformation matrix of normal
  "uniform vec3 u_LightColor;\n" +      // Light Color
  "uniform vec3 u_LightDirection;\n" +  // Normalized world coordinate (Directional Light direction)
  "uniform vec3 u_AmbientLight;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  " gl_Position = u_MvpMatrix * a_Position;\n" +
  " vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n" + // Normal due to the model matrix
  " float nDotL = max(dot(u_LightDirection, normal), 0.0);\n" +
  " vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n" +
  " vec3 ambient = u_AmbientLight * a_Color.rgb;\n" +
  " v_Color = vec4(diffuse + ambient, a_Color.a);\n" + // Surface color due to diffuse and ambient reflection
  "}\n";

const FSHADER_SOURCE =
  "#ifdef GL_ES\n" +
  "precision mediump float;\n" +
  "#endif\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "   gl_FragColor = v_Color;\n" +
  "}\n";

let g_eyeX = 0,
  g_eyeY = 0.05,
  g_eyeZ = 0.25; // Eye point

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

  const u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
  const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')
  const u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
  const u_LightDirection = gl.getUniformLocation(gl.program, "u_LightDirection");
  const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');

  if (!u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightDirection || !u_AmbientLight) { 
    console.log('Failed to get the storage location');
    return;
  }

  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  const lightDirection = new Vector3([0.0, 3.0, 4.0]);
  lightDirection.normalize();
  gl.uniform3fv(u_LightDirection, lightDirection.elements);

  const modelMatrix = new Matrix4(); // Model matrix
  const mvpMatrix = new Matrix4(); // Model view projection matrix
  const normalMatrix = new Matrix4(); // Transformation matrix for normals

  // Calculate the model matrix
  modelMatrix.setTranslate(0, 0.1, 0); // Traslation to y-axis direction
  modelMatrix.rotate(40, 1, 0, 1);  // Rotate 90 degrees counterclockwise around the z-axis

  // Calculate the view and projection matrix
  mvpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
  mvpMatrix.multiply(modelMatrix)
  //projMatrix.setPerspective(60.0, canvas.width / canvas.clientHeight, 1, 100);
  //mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  // Compute magic matrix
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements)

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.POLYGON_OFFSET_FILL);

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  //draw(gl, n, u_ViewMatrix, viewMatrix);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
  if (ev.keyCode === 38) {
    // Up arrow key
    g_eyeY += 0.01;
  } else if (ev.keyCode === 40) {
    // Down arrow key
    g_eyeY -= 0.01;
  } else if (ev.keyCode === 39) {
    // Right arrow key
    g_eyeX += 0.01;
  } else if (ev.keyCode === 37) {
    // Left arrow key
    g_eyeX -= 0.01;
  } else {
    return;
  }

  draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
  //viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, n);
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
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
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



  const vertexColorbuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  if (!vertexColorbuffer || !indexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, "a_Position")) return -1;
  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, "a_Color")) return -1;
  if(!initArrayBuffer(gl, normals, 3, gl.FLOAT, "a_Normal")) return -1;

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
