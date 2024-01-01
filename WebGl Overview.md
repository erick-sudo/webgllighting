# WEBGL Overview

## The Anatomy of a WebGL Application

In order to render WebGL into a page, an application must, at a minimum, perform the following steps:

1. Create a canvas element.
2. Obtain a drawing context for the canvas.
3. Initialize the viewport.
4. Create one or more buffers containing the data to be rendered (typically vertices).
5. Create one or more matrices to define the transformation from vertex buffers to screen space.
6. Create one or more shaders to implement the drawing algorithm.
7. Initialize the shaders with parameters.
8. Draw.

## The Canvas and Drawing Context

All WebGL rendering takes place in a context, a JavaScript DOM object that provides the complete WebGL API.

## The Viewport

The viewport is the rectangular bounds of where to draw on the Webgl context of the canvas.

## Buffers, ArrayBuffer, and Typed Arrays

Webgl drawing is done with primitives.  
Primitives use arrays of data, called buffers, which define the positions of the vertices to be drawn.

## Matrices

**ModelView Matrix** - defines where a model is positioned in the 3D coordinate system, relative to the camera.

**Projection Matrix** - required by the shader to transform the 3D space coordinates of the model in camera space into 2D coordinates drawn in the space of the viewport.

## Homogeneous Coordinates

```
The homogeneous coordinates use the following coordinate notation: (x, y, z, w). The homogeneous coordinate (x, y, z, w) is equivalent to the three-dimensional coordinate (x/w, y/w, z/w). So, if you set w to 1.0, you can utilize the homogeneous coordinate as a three-dimensional coordinate. The value of w must be greater than or equal to 0. If w approaches zero, the coordinates approach infinity. So we can represent the concept of infinity in the homogeneous coordinate system. Homogeneous coordinates make it possible to represent vertex transformations described in the next chapter as a multiplication of a matrix and the coordinates. These coordinates are often used as an internal representation of a vertex in 3D graphics systems.
```

## The Shader

Shaders are small programs, written in high-level C-like language, that define how the pixels for 3D objects actually get drawn.  
A shader is typically composed of two parts: the **vertex shader** and the **fragment shader** (also know as the pixel shader).

- **vertex shader** - reponsible for transforming the coordinates of the object into 2D display space.
- **fragment shader** - responsible for generating the final color output of each pixel for the transformed vertices, based on inputs such as color, texture, lighting, and material values.

---

## initShaders(gl, vshader, fshader)

---

Initialize shaders and set them up in the WebGL system ready for use:

### Parameters

- **gl** - Specifies a rendering context.
- **vshader** - Specifies a vertex shader program (string).
- **fshader** - Specifies a fragment shader program (string).

### Return value

- `true` - Shaders successfully initialized.
- `false` - Failed to initialize shaders.

---

## gl.clearColor(red, green, blue, alpha)

---

Specify the clear color for a drawing area:

### Parameters

- **red** - Specifies the red value (from 0.0 to 1.0).
- **green** - Specifies the green value (from 0.0 to 1.0).
- **blue** - Specifies the blue value (from 0.0 to 1.0).
- **alpha** - Specifies an alpha (transparency) value (from 0.0 to 1.0).0.0 means transparent and 1.0 means opaque.

`If any of the values of these parameters is less than 0.0 or more than 1.0, it is truncated into 0.0 or 1.0, respectively.`

### Return value

- None

### Errors

- None

---

## gl.clear(buffer)

---

Clear the specified buffer to preset values. In the case of a color buffer, the value (color) specified by gl.clearColor() is used.

### Parameters

- **buffer** - Specifies the buffer to be cleared. Bitwise OR (|) operators are used to specify multiple buffers.
  - **gl.COLOR_BUFFER_BIT** - Specifies the color buffer.
  - **gl.DEPTH_BUFFER_BIT** - Specifies the depth buffer.
  - **gl.STENCIL_BUFFER_BIT** - Specifies the stencil buffer.

### Return value

- `None`

### Errors

- `INVALID_VALUE` - buffer is none of the preceding three values.

## gl.drawArrays(mode, first, count)

---

Execute a vertex shader to draw shapes specified by the mode parameter.

### Parameters

- **mode** - Specifies the type of shape to be drawn. The following symbolic constants are accepted:

  - gl.POINTS,
  - gl.LINES,
  - gl.LINE_STRIP,
  - gl.LINE_LOOP,
  - gl.TRIANGLES,
  - gl.TRIANGLE_STRIP,
  - gl.TRIANGLE_FAN

- **first** - Specifies which vertex to start drawing from (integer).
- **count** - Specifies the number of vertices to be used (integer).

### Return value

- `None`

### Errors

- `INVALID_ENUM` - mode is none of the preceding values.
- `INVALID_VALUE` - first is negative or count is negative.

---

## gl.getAttribLocation(program, name)

---

Retrieve the storage location of the attribute variable specified by the name parameter.

### Parameters

- **program** - Specifies the program object that holds a vertex shader and a fragment shader.
- **name** - Specifies the name of the attribute variable whose location is to be retrieved.

### Return value

- `greater than or equal to 0` - The location of the specified attribute variable.
- `-1` - The specified attribute variable does not exist or its name starts with the reserved prefix **gl\_** or **webgl\_**.

### Errors

- INVALID_OPERATION - program has not been successfully linked
- INVALID_VALUE - The length of name is more than the maximum length (256 by default) of an attribute variable name.

---

## gl.vertexAttrib3f(location, v0, v1, v2)

---

Assign the data (v0, v1, and v2) to the attribute variable specified by location.

### Parameters

- **location** - Specifies the storage location of an attribute variable to be modified.
- **v0** - Specifies the value to be used as the first element for the attribute variable.
- **v1** - Specifies the value to be used as the second element for the attribute variable.
- **v2** - Specifies the value to be used as the third element for the attribute variable.

### Return value

- `None`

### Errors

- INVALID_OPERATION - There is no current program object.

* INVALID_VALUE - location is greater than or equal to the maximum number of attribute variables (8, by default).

## Family Methods of gl.vertexAttrib3f()

`gl.vertexAttrib3f()` is part of a family of methods that allow you to set some or all of the components of the attribute variable

---

```javascript
gl.vertexAttrib1f(location, v0);
gl.vertexAttrib2f(location, v0, v1);
gl.vertexAttrib3f(location, v0, v1, v2);
gl.vertexAttrib4f(location, v0, v1, v2, v3);
```

Assign data to the attribute variable specified by location. gl.vertexAttrib1f() indicates that only one value is passed, and it will be used to modify the first component of the attribute variable. The second and third components will be set to 0.0, and the fourth component will be set to 1.0. Similarly, gl.vertexAttrib2f() indicates that values are provided for the first two components, the third component will be set to 0.0, and the fourth component will be set to 1.0. gl.vertexAttrib3f() indicates that values are provided for the first three components, and the fourth component will be set to 1.0, whereas gl.vertexAttrib4f() indicates that values are provided for all four components.

### Parameters

- **location** - Specifies the storage location of the attribute variable.
- **v0, v1, v2, v3** - Specifies the values to be assigned to the first, second, third, and fourth components of the attribute variable.

### Return value

- `None`

### Errors

- INVALID_VALUE - location is greater than or equal to the maximum number of attribute variables (8 by default).

The vector versions of these methods are also available. Their name contains “v” (vector), and they take a typed array as a parameter. The number in the method name indicates the number of elements in the array

```javascript
var position = new Float32Array([1.0, 2.0, 3.0, 1.0]);
gl.vertexAttrib4fv(a_Position, position);
```

---

## **The Naming Rules for WebGL-Related Methods**

---

WebGL bases its method names on the function names in OPENGL ES 2.0 which is the base specification of WebGl.  
The function names in OPENGL comprise three components:

```xml
<base-function-name> <number-of-parameters> <parameter-type>()
```

The name of each WebGl method also uses the same components:

```xml
<base-method-name> <number-of-parameters> <parameter-type>()
```

When `'v'` is appended to the name, the methods take an array as a parameter. In this case the number in the method name indicates the number of elements in the array.

```
N/B:
In GLSL ES, you can only specify float data types for an attribute variable; however, you can specify any type for a uniform variable
```

---

## gl.getUniformLocation(program, name)

---

Retrieve the storage location of the uniform variable specified by the name parameter.

### Parameters

- **program** - Specifies the program object that holds a vertex shader and a fragment shader.
- **name** - Specifies the name of the uniform variable whose location is to be retrieved.

### Return value

- `non-null` - The location of the specified uniform variable.
- `null` - The specified uniform variable does not exist or its name starts with the reserved prefix gl* or webgl*.

### Errors

- INVALID_OPERATION - program has not been successfully linked
- INVALID_VALUE - The length of name is more than the maximum length (256 by default) of a uniform variable.

---

## gl.uniform4f(location, v0, v1, v2, v3)

---

Assign the data specified by v0, v1, v2, and v3 to the uniform variable specified by location.

### Parameters

- **location** - Specifies the storage location of a uniform variable to
  be modified.
- **v0** - Specifies the value to be used as the first element of
  the uniform variable.
- **v1** - Specifies the value to be used as the second element
  of the uniform variable.
- **v2** - Specifies the value to be used as the third element of
  the uniform variable.
- **v3** - Specifies the value to be used as the fourth element of
  the uniform variable.

### Return value

- `None`

### Errors

- INVALID_OPERATION - There is no current program object. location is an invalid uniform variable location.

## Family Methods of gl.uniform4f()

`gl.uniform4f()` also has a family of methods. gl.uniform1f() is a method to assign a single value (v0), gl.uniform2f() assigns two values (v0 and v1), and gl.uniform3f() assigns three values (v0, v1, and v2).

```javascript
gl.uniform1f(location, v0);
gl.uniform2f(location, v0, v1);
gl.uniform3f(location, v0, v1, v2);
gl.uniform4f(location, v0, v1, v2, v3);
```

Assign data to the uniform variable specified by location. gl.uniform1f() indicates that only one value is passed, and it will be used to modify the first component of the uniform variable. The second and third components will be set to 0.0, and the fourth component will be set to 1.0. Similarly, gl.uniform2f() indicates that values are provided for the first two components, the third component will be set to 0.0, and the fourth component will be set to 1.0. gl.uniform3f() indicates that values are provided for the first three components and the fourth component will be set to 1.0, whereas gl.unifrom4f() indicates that values are provided for all four components.

### Parameters

- **location** - Specifies the storage location of a uniform variable.
- **v0, v1, v2, v3** - Specifies the values to be assigned to the first, second, third, and fourth component of the uniform variable.

### Return value

- `None`

### Errors

- INVALID_OPERATION - There is no current program object. location is an invalid uniform variable location.
