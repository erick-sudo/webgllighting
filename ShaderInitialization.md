# SHADER AND PROGRAM OBJECTS

Two types of objects are necessary to use shaders: shader objects and program objects.

- **Shader object** - A shader object manages a vertex shader or a fragment shader. One shader object is created per shader.

- **Program object** - A program object is a container that manages the shader objects. A vertex shader object and a fragment shader object must be attached to a program object in WebGL.

All shader objects must be created with a call to **gl.createShader()**.

---

## gl.createShader(type)

---

Creates a shader of the specified type

### Parameters

- **type** - Specifies the type of shader object to be created: either **gl.VERTEX_SHADER** or **gl.FRAGMENT_SHADER**.

### Return value

- `Non-null` - The created shader object.
- `null` - The creation of the shader object failed.

### Errors

- `INVALID_ENUM` - The specified type is none of the above

---

## gl.deleteShader(shader)

---

Delete the shader object  
The shader object specified will be deleted when the program objet no longer uses it.

### Parameters

- **shader** - Specifies the shader object to be deleted.

### Return value

- `None`

### Errors

- `None`

---

## gl.shaderSource(shader, source)

---

Stores the source code specified by source in the shader object specified by shader

### Return Value

- `None`

### Errors

- `None`

---

## gl.compileShader(shader)

---

Compile the source code stored in the shader object specified by shader.
Like C or C++, shaders need to be compiled to executable format(binary) and kept in the WebGL system.

### Parameters

- **shader** - Specified the shader object in which the source code to be compiled is stored.

### Return Value

- `None`

### Errors

- `None`

---

## gl.getShaderParameter(shader, pname)

---

Get the information specified by pname from the shader object specified by shader.

### Parameters

- **shader** - Specifies the shader object
- **pname** - Specifies the information to get from the shader: `gl.SHADER_TYPE, gl.DELETE_STATUS, gl.COMPILE_STATUS`.

### Return Value

This function return the following depending on pname:

- `gl.SHADER_TYPE` - The type of shader(gl.VERTEX_SHADER or gl.FRAGMENT_SHADER).
- `gl.DELETE_STATUS` - Whether the deletion has succeeded(true or false).
- `gl.COMPILE_STATUS` - Whether the compilation has succeeded(true r false)

### Errors

- `INVALID_ENUM` - pname is none of the above values

```
If compilation has failed, gl.getShaderParameter(gl.COMPILE_STATUS) return false, and the error information is written in the **information log** for the shader in the WebGL system. This information can be retrieved with gl.getShaderInfoLog()
```

---

## gl.getShaderInfoLog(shader)

---

Retrieve the information log from the shader object specified by shader.

### Parameters

- **shader** - Specifies the shader object from which the information log is retrieved.

### Return value

- **non-null** - The string containing the loggeg information.
- **null** - Any errors are generated.

### Errors

- `None`

```javascript
// Note
Although the exact details of the logged information is implementation specific, almost all WebGL systems return error messages containing the line numbers where the compiler has detected the errors in the program.
```

---

## gl.createProgram()

---

Create a program object

### Return value

- **non-null** - The newly created program object.
- **null** - Failed to create a program object.

### Errors

- `None`

A program object can be deleted using gl.deleteProgram()

---

## gl.deleteProgram(program)

---

Delete the program object specified by **program**. If the program object is not referred to from anywhere, it is deleted immediately. Otherwise, it will be deleted when it is no longer referred to.

### Return value

- `None`

### Errors

- `None`

---

## gl.attachShader(program, shader)

---

Attach the shader object specified by shader to the program object specified by program.

### Parameters

- **program** - Specifies the program object.
- **shader** - Specifies the shader object to be attached to program.

### Return value

- `None`

### Errors

- `INVALID_OPERATION` - Shader had already been attached to program.

---

## gl.detachShader(program, shader)

---

Detach the shader object specified by shader from the program object specified by program.

### Parameters

- **program** - Specifies the program object.
- **shader** - Specifies the shader object to be detached from program.

### Return value

- `None`

### Errors

- `INVALID_OPERATION` - shader is not attached to program.

---

## gl.linkProgram(program)

---

Link the program object specified by program.

### Parameters

- program - Specifies the program object to be linked

### Return value

- None

### Errors

- None

```
During linking, various constraints of the WebGL system are checked:

(1). When varying variables in a vertex shader, whether varying variables with the same names and types are declared in a fragment shader.

(2). Whether a vertex shader has written data to varying variables used in a fragment shader.

(3). When the same uniform variables are used in both a vertex shader and a fragment shader, whether their types and names match.

(4). Whether the numbers of attribute variables, uniform variables, and varying variables does not exceed an upper limit.

etc.
```

The result of linking the program object can be confirmed with `gl.getProgramParameters()`

---

## gl.getProgramParameter(program, pname)

---

Return information about pname for the program object specified by program. The return value differs depending on pname.

### Parameters

- **program** - Specifies the program object.
- **pname** - Specifies any one of `gl.DELETE*STATUS, gl.LINK_STATUS, gl.VALIDATE_STATUS, gl.ATTACHED_SHADERS, gl.ACTIVE_ATTRIBUTES, or gl.ACTIVE_UNIFORMS`.

### Return value

Depending on pname, the following values can be returned:

- **gl.DELETE_STATUS** - Whether the program has been deleted (true or false)
- **gl.LINK_STATUS** - Whether the program was linked successfully (true or false)
- **gl.VALIDATE_STATUS** - Whether the program was validated successfully (true or false)
- **gl.ATTACHED_SHADERS** - The number of attached shader objects
- **gl.ACTIVE_ATTRIBUTES** - The number of attribute variables in the vertex shader
- **gl.ACTIVE_UNIFORMS** - The number of uniform variables

### Errors

- `INVALID_ENUM` - pname is none of the above values.

```
If linking succeeded, you are returned an executable program object. Otherwise, you can get the information about the linking from the information log of the program object with gl.getProgramInfoLog().
```

---

## gl.getProgramInfoLog(program)

---

Retrieve the information log from the program object specified by program.

### Parameters

- **program** - Specifies the program object from which the information log is retrieved.

### Return value

The string containing the logged information

### Errors

- `None`

---
## gl.useProgram(program))
---

This function tell's the WebGL system that the program object specified by program will be used.

One powerful feature of this function is that you can use it during drawing to switch between multiple shaders prepared in advance.