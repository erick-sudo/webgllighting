// Vertex Shader
const VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Normal;\n" + // Surface orientation
  "attribute vec4 a_Color;\n" + // Surface base color
  "uniform mat4 u_MvpMatrix;\n" + // Model view projection matrix
  "uniform mat4 u_ModelMatrix;\n" + // Model matrix
  "uniform mat4 u_NormalMatrix;\n" + // Magic matrix
  "varying vec3 v_Position;\n" +
  "varying vec4 v_Color;\n" +
  "varying vec3 v_Normal;\n" +
  "void main() {\n" +
  " gl_Position = u_MvpMatrix * a_Position;\n" +
  " v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n" +
  " v_Position = (u_ModelMatrix * a_Position).xyz;\n" +
  " v_Color = a_Color;\n" +
  "}\n";

// Fragment Shader
const FSHADER_SOURCE =
  "#ifdef GL_ES\n" +
  "precision mediump float;\n" +
  "#endif\n" +
  "uniform vec3 u_LightColor;\n" +
  "uniform vec3 u_LightPosition;\n" +
  "uniform vec3 u_AmbientLight;\n" +
  "varying vec3 v_Position;\n" +
  "varying vec4 v_Color;\n" +
  "varying vec3 v_Normal;\n" +
  "void main() {\n" +
  // Normalize interpolated transformed normal
  " vec3 normal = normalize(v_Normal);\n" +
  // Compute the light direction
  " vec3 lightDirection = normalize(u_LightPosition - v_Position);\n" +
  // Dot product of lightdirection and the normal
  " float nDotL = max(dot(normal, lightDirection), 0.0);\n" +
  // Compute suface color due to diffuse reflection
  " vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n" +
  // Compute surface color due to ambient reflection
  " vec3 ambient = u_AmbientLight * v_Color.rgb;\n" +
  // Add the surface colors due to diffuse reflection and ambient reflection
  " gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n" +
  "}\n";

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

  // Get storage locations of uniform variables
  const u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
  const u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  const u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
  const u_LightPosition = gl.getUniformLocation(gl.program, "u_LightPosition");
  const u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
  const u_AmbientLight = gl.getUniformLocation(gl.program, "u_AmbientLight");

  if (!u_MvpMatrix || !u_ModelMatrix || !u_NormalMatrix || !u_LightPosition || !u_LightColor || !u_AmbientLight) {
    console.log("Failed to get the storage location");
    return;
  }

  // Initialize point light properties
  // Light color (white)
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  // Light position (in the world coordinate)
  gl.uniform3f(u_LightPosition, 5.4, 5.0, 4.0);
  // Ambient light
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

  // The view projection matrix
  const viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0); // Perspective Projection
  viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); // View

  // Register key event handler
  document.onkeydown = (ev) => keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

  draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw robot arm
}

let ANGLE_STEP = 3.0; // The increments of rotation angle (degrees)
let g_arm1Angle = 120.0; // The rotation angle of arm1 (degrees)
let g_joint1Angle = 50.0; // The rotation angle of joint1 (degrees)
let g_joint2Angle = 0.0; // The roation angle of joint2 (degrees)
let g_joint3Angle = 0.0; // The roation angle of joint3 (degrees)


function keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  switch (ev.keyCode) {
    case 38: // Up arrow key -> the positive rotation of joint1 around the z-axis
      if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
      break;

    case 40: // Down arrow key -> the negative rotation of joint1 around the z-axis
      if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
      break;
    case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
      g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
      break;
    case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
      g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
      break;
    case 90: // z key -> the positive rotation of joint2
        g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360
        break;
    case 88: // x key -> the negative rotation of joint2
        g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360
        break;
    case 86: // v key -> the positive rotation of joint3
        if(g_joint3Angle < 60.0) g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360
        break;
    case 67: // c key -> the negative rotation of joint3
        if(g_joint3Angle > -60.0)g_joint3Angle = (g_joint3Angle - ANGLE_STEP) % 360
        break;
    default:
      return; // Skip drawing at no effective action
  }

  // Draw the robot arm
  draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}

function initVertexBuffers(gl) {
    // Vertex coordinates（a cuboid 3.0 in width, 10.0 in height, and 3.0 in length with its origin at the center of its bottom)
  const vertices = new Float32Array([
    0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
    0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
    0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
   -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
   -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
    0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
  ]);

  const colors = new Float32Array([     // Colors
  1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
  1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
  1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
  1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
  1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
  1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0      // v4-v7-v6-v5 back
]);

  // Normal
  const normals = new Float32Array([
    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  const indices = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
   12,13,14,  12,14,15,    // left
   16,17,18,  16,18,19,    // down
   20,21,22,  20,22,23     // back
 ]);

    // Write the vertext property to buffers (coordinates, normals, and colors)
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, "a_Position")) return -1;
  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, "a_Color")) return -1;
  if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, "a_Normal")) return -1;

  // Write indices to the buffer object
  const indexBuffer = gl.createBuffer();
  if(!indexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

// Coordinate transformation matrix
let g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();

function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    // Base
    const baseHeight = 2.0
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    drawBox(gl, n, 10.0, baseHeight, 10.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)

    // Arm1
    const arm1Length = 10.0; // Length of arm1
    g_modelMatrix.translate(0.0, baseHeight, 0.0); // Move onto the base
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0); // Rotate around the y-axis
    drawBox(gl, n, 3.0, arm1Length, 3.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    // Arm2
    const arm2Length = 10.0; // Length of arm2
    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint1
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0) // Rotate around the z-axis
    drawBox(gl, n, 4.0, arm2Length, 4.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) 

    // Palm
    const palmLength = 2.0;
    g_modelMatrix.translate(0.0, arm2Length, 0.0) // Move to palm
    g_modelMatrix.rotate(g_joint2Angle, 0.0, 1.0, 0.0) // Rotate the wrist around the y-axis
    drawBox(gl, n, 2.0, palmLength, 6.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)

    // Move to the center of the tip of the palm
    g_modelMatrix.translate(0.0, palmLength, 0.0);

    // Draw finger1
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0.0, 0.0, 2.0);
    g_modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0) // Rotate around the x-axis
    drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)
    g_modelMatrix = popMatrix()

    // Draw finger2
    g_modelMatrix.translate(0.0, 0.0, -2.0);
    g_modelMatrix.rotate(-g_joint3Angle, 1.0, 0.0, 0.0); // Rotate around the x-axis
    drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)
}

let g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) { // Store the specified matrix to the array
    let m2 = new Matrix4(m)
    g_matrixStack.push(m2)
}

function popMatrix() { // Retrieve the matrix from the array
    return g_matrixStack.pop();
}

let g_normalMatrix = new Matrix4(); // Coordinate transformation matrix for normals

function drawBox(gl, n, width, height, depth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    // Save the model matrix
    pushMatrix(g_modelMatrix);
    // Scale a cube and draw
    g_modelMatrix.scale(width, height, depth);
    // Compute the model view projection matrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements)

    // Calculate the normal transformation matrix
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements)

    // Draw
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    g_modelMatrix = popMatrix();
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
