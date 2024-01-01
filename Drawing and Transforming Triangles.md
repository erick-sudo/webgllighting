# Drawing and Transforming Triangles

3D models are actually made from a simple building block: **`the humble trangle`**

WebGl provides a convenient way to pass multiple vertices to the vertex shader via buffer object. A **buffer object** is a memory area that can store multiple vertices in the WebGL system. It is used both as a staging area for the vertex data and a way to simultaneously pass the vertices to a vertex shader.

Five steps are involved in passing multiple data values to a vertex shader through a buffer object:

1. Create the buffer object (gl.createBuffer()).
2. Bund the buffer object to a target (gl.bindBuffer()).
3. Write data into the buffer object (gl.bufferData()).
4. Assign the buffer object to an attribute variable (gl.vertexAttribPointer()).
5. Enable assignment (gl.enableVertextAttribArray()).

### **Creating a Buffer Object**

---

#### gl.createBuffer()

---

Create a buffer object.

##### Return value

- non-null - The newly created buffer object.
- null - Failed to create a buffer object.

##### Errors

- None

---

#### gl.deleteBuffer()

---

Delete the buffer object specified by buffer.

##### Parameters

- **buffer** - Specifies the buffer object to be deleted.

##### Return value

- None

##### Errors

- None

### **Bnding a Buffer Object to a Target**

The target tells WebGL what type of data the buffer object contains, allowing it to deal with the contents correctly

---

#### gl.bindBuffer(target, buffer)

---

Enable the buffer object specified by buffer and bind it to the target.

##### Parameters

- **target** can be one of the following:
  - gl.ARRAY_BUFFER - Specifies that the buffer object contains vertex data.
  - gl.ELEMENT_ARRAY_BUFFER - Specifies that the buffer object contains index values pointing to vertex data.
- **buffer** - Specifies the buffer object created by a previous call to gl.createBuffer(). When null is specified, binding to the target is disabled.

##### Return Value

None

##### Errors

- **INVALID_ENUM** - target is none of the above values. In this case, the current binding is maintained.

### **Write Data into a Buffer Object**

Allocating storage and writing data to the buffer.  
`gl.bufferData()` writes the data specified by the second parameter into the buffer object bound to the first parameter.

---

#### gl.bufferData(target, data, usage)

---

Allocate storage and write the data specified by data to the buffer object bound to target.

##### Parameters

- **target** - Specifies gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER.
- **data** - Specifies the data to be written to the buffer object (typed array).
- **usage** - Specifies a hint about how the program is going to use the data stored in the buffer object. This hint helps WebGL optimize performance but will not stop your program from working if you get it wrong.
  - gl.STATIC_DRAW - The buffer object data will be specified once and used many times to draw shapes.
  - gl.STREAM_DRAW - The buffer object data will be specified once and used a few times to draw shapes.
  - gl.DYNAMIC_DRAW - The buffer object data will be specified repeatedly and used many times to draw shapes.

##### Return value

- `None`

##### Errors

- `INVALID_ENUM` - target is none of the preceding constants

## Typed Arrays

WebGL often deals with large quantities of data of the same type, such as vertex coordinates and colors, for drawing 3D objects.

Typed Arrays Used in WebGL
Typed Array Numberof Bytes per Element Description (C Types)
Int8Array 1 8-bit signed integer (signed char)
Uint8Array 1 8-bit unsigned integer (unsigned char)
Int16Array 2 16-bit signed integer (signed short)
Uint16Array 2 16-bit unsigned integer (unsigned short)
Int32Array 4 32-bit signed integer (signed int)
Uint32Array 4 32-bit unsigned integer (unsigned int)
Float32Array 4 32-bit floating point number (float)
Float64Array 8 64-bit floating point number (double)

---

## **Assigning the Buffer Object to an Attribute Variable**

`gl.vertexAttribPointer()` can be used to assign a buffer object(a reference or handle to the buffer object) to an atribute variable.

---

### gl.vertexAttribPointer(location, size, type, normalized, stride, offset)

---

Assign the buffer object **bound** to gl.ARRAY*BUFFER to the attribute variable specified by *location*.

#### Parameters

- **location** - Specifies the storage location of an attribute variable.
- **size** - Specifies the number of components per vertex in the buffer object (valid values are 1 to 4). If size is less than the number of compo-
  nents required by the attribute variable, the missing components
  are automatically supplied just like gl.vertexAttrib[1234]f().
  For example, if size is 1, the second and third components will be
  set to 0, and the fourth component will be set to 1.
- **type** - Specifies the data format using one of the following:

```
    gl.UNSIGNED_BYTE          unsigned byte               for Uint8Array
    gl.SHORT                  signed short integer        for Int16Array
    gl.UNSIGNED_SHORT         unsigned short integer      for Uint16Array
    gl.INT                    signed integer              for Int32Array
    gl.UNSIGNED_INT           unsigned integer            for Uint32Array
    gl.FLOAT                  floating point number       for Float32Array
```

- **normalized** - Either true or false to indicate whether nonfloating data should be normalized to [0, 1] or [–1, 1].
- **stride** - Specifies the number of bytes between different vertex data elements, or zero for default stride.
- **offset** - Specifies the offset (in bytes) in a buffer object to indicate what number-th byte the vertex data is stored from. If the data is stored from the beginning, offset is 0.

#### Return value

- `None`

#### Errors

- INVALID_OPERATION - There is no current program object.
- INVALID_VALUE - location is greater than or equal to the maximum number of attribute variables (8, by default). stride or offset is a negative value.

---

## **Enable the Assignment to an Attribute Variable**

The fifth and final step is to enable the assignment of the buffer object to the attribute variable.  
To make it possible to access a buffer object in a vertex shader, we need to enable the assignment of the buffer object to an attribute variable by using **gl.enableVertextAttribArray()**

---

### gl.enableVertexAttribArray(location)

---

Enable the assignment of a buffer object to the attribute variable specified by location.

#### Parameters

- **location** - Specifies the storage location of an attribute variable.

#### Return value

- `None`

#### Errors

- INVALID_VALUE - location is greater than or equal to the maximum number of attribute variables (8 by default).

---

### gl.disableVertexAttribArray(location)

---

Disable the assignment of a buffer object to the attribute variable specified by location.

#### Parameters

- **location** - Specifies the storage location of an attribute variable.

#### Return Value

- `None`

#### Errors

- INVALID_VALUE - location is greater than or equal to the maximum number of attribute variables (8 by default).

```javascript
// NOTE
After enabling the assignment, you can no longer use gl.vertexAtrib[1234]f() to assign data to the attribute variable
```

---

## gl.drawArrays(mode, first, count)

---

Execute a vertex shader to draw shapes specified by the mode parameter.

### Parameters

- **mode** - Specifies the type of shape to be drawn. The following symbolic
  constants are accepted: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.
  LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, and gl.TRIANGLE_FAN.
- **first** - Specifies what number-th vertex is used to draw from (integer).
- **count** - Specifies the number of vertices to be used (integer).

---

## **BASIC SHAPES**

---

- **Points - _gl.POINTS_** - A series of points
- **Line segements - _gl.LINES_** - A series of unconnected line segments. If the number of vertices is odd, the last one is ignored.
- **Line strips - _gl.LINE_STRIP_** - A series of connected line segments
- **Line loops - _gl.LINE_LOOP_** - A series of connected line segments including a line from last to first vertex
- **Triangles - _gl.TRIANGLES_** - A series of separate triangles. If the number of vertices is not a multiple of 3, the remaining vertices are ignored.
- **Triangle strips - _gl.TRIANGLE_STRIP_** - A series of connected triangles in strip fashion. The first three vertices form the first triangle and the second triangle is formed from the next vertex and one of the sides of the first triangle.
- **Triangle fans - _gl.TRIANGLE_FAN_** - A series of connected triangles sharing the first vertex in fan like fashion. The first three vertices form th first triangle and the second triangle is formed from the next vertex, one of the sides of the first triangle, and the first vertex

---

## **Moving, Rotating, and Scaling**

---

### gl.uniformMatrix4fv(location, transpose, array)
---
Assign the 4×4 matrix specified by array to the uniform variable specified by location.
#### Parameters
- **location** - Specifies the storage location of the uniform variable.
- **Transpose** Must be false in WebGL. This parameter specifies whether to transpose the matrix or not. The transpose operation, which exchanges the column and row elements of the matrix, is not supported by WebGl's implementtion of this method and must always be set to false.
- **array** - Specifies an array containing a 4×4 matrix in column major order (typed array).

#### Return value
- ```None```
#### Errors
- INVALID_OPERATION - There is no current program object.
- INVALID_VALUE - transpose is not false, or the length of array is less than 16.
