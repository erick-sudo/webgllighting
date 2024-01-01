# **The OpenGL ES Shading Language (GLSL ES)**

## Overview of GLSL ES

The GLSL ES programming language was developed from the OpenGL Shading Languafe by reducing or simplifying functionality, assuming that the target platforms were consumer electronics or embedded devices such as smart phones and game consoles.

The prime goal was to allow hardware manufacturers to simplify the hardwrae needed to execute GLSL ES programs.

GLSL ES supports a limited(and partially extended) version of the C language syntax.

## Data

GLSL ES supports only two data types:

- **Numerical value** - GLSL ES supports integer numbers and floating point numbers. Numbers without a decimal point are treated as integer numbers, and those with a decimal point are treated as floating point numbers.
- **Boolean value** - GLSL ES supports true and false as boolean constants.

## Variable basic naming rules

- The character set for variables names contains only the letters a–z, A–Z, the underscore (\_), and the numbers 0–9.
- Numbers are not allowed to be used as the first character of variable names.
- The keywords and the reserved keywords are not allowed to be used as variable names. However, you can use them as part of the variable name.
- Variable names starting with gl*, webgl*, or _webgl_ are reserved for use by OpenGL ES. No user-defined variable names may begin with them.

## Keywords Used in GLSL ES

```glsl es
attribute   bool        break           bvec2   bvec3   bvec4
const       continue    discard         do      else    false
float       for         highp           if      in      inout
Int         invariant   ivec2           ivec3   ivec4   lowp
mat2        mat3        mat4            medium  out     precision
return      sampler2D   samplerCube     struct  true    uniform
varying     vec2        vec3            vec4    void    while
```

## Reserved Keywords for Future Version of GLSL ES

```glsl es
asm             cast                class           default
double          dvec2               dvec3           dvec4
enum            extern              external        fixed
flat            fvec2               fvec3           fvec4
goto            half                hvec2           hvec3
hvec4           inline              input           interface
long            namespace           noinline        output
packed          public              sampler1D       sampler1DShadow
sampler2DRect   sampler2DRectShadow sampler2D       Shadowsampler3D
sampler3DRect   short               sizeof          static
superp          switch              template        this
typedef         union               unsigned        using
volatile
```

## GLSL ES Is a Type Sensitive Language

GLSL ES require specification for the type of data a variable will contain.

_Syntax_  
`<data -type> <variable name>`

## Basic Types

---

- **float** - The data type for a single floating point number. It indicates the variable will contain a single floating point number.
- **int** - The data type for a single integer number. It indicates the variable will contain a single integer number.
- **bool** - The data type for a boolean value. It indicates the variable will contain a boolean value.

## Bulti-In type conversion functions

#### To an integer number

- _int(float)_ - The fractional part of the floating-point value is dropped
- _int(bool)_ - true is converted to 1, or false is converted to 0.

#### To a floating point number

- _float(int)_ - The integer number is converted to a floating point number.
- _float(bool_ -) true is converted to 1.0, or false is converted to 0.0.

#### To a boolean value

- _bool(int)_ - 0 is converted to false, or non-zero values are converted to true.
- _bool(float)_ - 0.0 is converted to false, or non-zero values are converted to true.

## Vector Types and Matrix Types

--

GLSL ES supports vector and matrix data types which are useful when dealing with computer graphics.

A vector type, which arranges data in a list, is useful for representing vertext coordinates or color data.
A matrix arranges data in an array and is useful for representing transformation matrices.

### Access to Components

To access components in a vector or matrix, you can use the operators . and []

#### The . Operator

An individual component in a vector can be accessed by the variable name followed by period and then the component name

Component names:

- **x, y, z, w** - Useful for accessing vertex coordinates.
- **r, g, b, a** - Useful for accessing colors.
- **s, t, p, q** - Useful for accessing texture coordinates.

Attempting to access a component beyond the number of components in a vector will result in an error

Multiple components can be selected by appending their names (from the name set above) after the period. This is called **swizzling**.

Swizzling can also be used in the left-side expression of an assignment operation

```javascript
//NB
Component names must come from the set

        - x, y, z, w
        - r, g, b, a
        - s, t, p, q
```

#### The [] Operator

The components of a vector or a matrix can be accessed using the array indexing operator [].
Elements in a matrix are also read out in colum major order

Two [] operators can be used to select a column and then a row of a matrix.

A component name can be used to select a component in conjunction with the [] operator with a restriction that only a constant index can be specified as the index number in the [] operator. The constant index is defined as:

- A integral literal value
- A global or local variable qualified as const, excluding function parameters
- Loop indices
- Expressions composed from any of the preceding

### Vector and Matrix Operations

The only comparative operators available for a vector and matrix are == and !=. The <, >, <=, and >= operators cannot be used for comparisons of vectors or matrices. There exists built-in function such as **lessThan()** for the other unsupported comparison operators.

```
When an arithmetic operator operates on a vector or a matrix, it is operating independently on each component of the vector or matrix in component-wise order
```

## Structures

---

GLSL ES also supports user-defined types, called **structures** which aggregate other already defined types using the keyword **struct**.
Unlike C, the **typedef** keyword is not necessary because, by default, the name of the structure becomes the name of the type.
As a convenience, variables of the new type can be declared with the definition of the structure.

### Structure Assignments and Constructors

Structures support the standard constructor, which has the same as the structure.
The arguments of the constructor must be in the same order and of the same type as they were declared in the structure.

### Structure member access

Each member of a structure can be accessed by appending the variable name with a period and then the member name.

### Structure operations

For each member in the structure, you can use any operators allowed for that member's type. However, the operators allowed for the structure itself are only the assignment( = ) and comparative operators ( == and != ).
The assignment and comparison operators are not allowed for the structures that contain arrays or sampler types.

When using the == operator, the result is true if and only if, all the members are component-wise equal. When using the != , the result is false if one of the members is not component-wise equal.

## Arrays

---

GLSL ES arrays have a simliar form to the array in JavaScript, with only one-dimensional arrays being supported.
The new operator is not necessary to create arrays.
The arrays are declared by a name followed by square brackets enclosing their sizes.

The array size must be specified as an integral constant expression greater than zero where the integral constant expression is defined as follows:

- A numerical value (for example, 0 or 1)
- A global or local variable qualified as const, excluding function parameters.
- Expressions composed of both of the above

```javascript
// NOTE

Arrays cannot be qualified as const
```

Array elements can be accessed using the array indexing operator
Only an integral constant expression or uniform variable can be used as an index of an array.  
An array cannot be initialized at declaration time. Implying that each element of the array must be initialized explicitly.  
Arrays only support [] operators. However, elements in an array do support the standard operators available for their type.

## Samplers

---

GLSL ES supports a dedicated type called sampler for accessing textures.
Two types of samplers are available: `sampler3D` and `samplerCube`.
Variables of the sampler type can be used only as a uniform variable or an argument of the function that can access textures such as **texture2D()**.

The only value that can be assigned to the variable is a texture unit number, and you must use the WebGL method gl.uniform1i() to set the value.  
Variables of type sampler are not allowed to be operands in any expressions other than =, ==, and !=.

## Conditional Control Flow and Iteration

---

- Boolean vector types, such as bvec2, are not allowed in the conditional expression

### continue, break, discard Statements

`continue` and `break` statements are allowed only within a for statement and are genrally used within if statements.

- continue - skips the remainder of the body of the innermost loop containing the continue, increases/decreases the loop index, and then moves to the next loop.

- break - exits the innermost loop containing the break.

- discard - only allowed in fragment shaders and discards the current fragment, abandoning the operation on the current fragment and skipping to the next fragment.

## Functions

---

Argument types must use one of the data types.  
When the function returns no value, the return statement does not need to be included but the return type has to be specified as void.  
An error will result a function is called with a number of arguments or types that do not match the declared parameter types.  
Recursive calls are not allowed since the compilers can in-line function calls.

### Prototype Declarations

A function to be called before definition must be declared with a prototype.  
The prototype declaration tells WebGL in advance about the types of parameters and the return value of the function.

### Parameter Qualifiers

GLSL ES supports qualifiers for parameters that control the roles of parameters within a function.  
They can define that a parameter:

1. Is to be passed into a function
2. Is to be passed back out of a function
3. Is to be passed both into and out of a function

The qualifiers include:

- **in** - Passes a value into a function

  - The parameter is passed by value. Its value can be referred to and modified in the function. The caller cannot refer to the modification.

- **const in** - Passes a value into the function

  - The parameter is passed by constant value. Its value cn be referred to but cannot be modified.

- **out** - Passes a value out of the function

  - The parameter is passed by reference. If its value is modified, the caller can refer to the modification

- **inout** - Passes a value both into/out of the function

  - The parameter is passed by reference, and its value is copied in the function. Its value can be referred to and modified in the function. The caller can also refer to the modification.

- **\<none:default\>** - Passes a value into the function
  - Same as **in**.

## Preprocessor Directives

---

GLSL ES supports preprocessor directives, which are commands(directives) for the preprocessor stage before actual compilation.

The following three preprocessor directives are available in GLSL ES:

```glsl
#if constant-expression
If the constant-expression is true, this part is executed
#endif
```

```glsl
#ifdef macro
If the macro is defined, this part is executed
#endif
```

```glsl
#ifndef macro
If the macro is not defined, this part is executed
#endif
```

The **#define** is used to define macros. Unlike C, macros in GLSL ES cannot have macro parameters.

```glsl
#define macro-name string
```

You can use **#undef** to undefine the macro

```glsl
#undef macro-name
```

You can use **#else** directives juust like an if statement in javascript or c:

```glsl
#define NUM 100

#if NUM == 100
If NUM == 100 then this part is executed.
#else
If NUM != 100 then this part is exceuted.
#endif
```

Macros can use any name except for the predefined macro names:

- **GL_ES** - Defined and set to 1 in OpenGL ES 2.0
- **GL_FRAGMENT_PRECISION_HIGH** - `highp` is supported in a fragment shader

You can specify which version of GLSL ES is used in the shader by using the **#version** directive:

```glsl
#version number
```

Accepted versions include 100 (for GLSL ES 1.00) and 101 (for GLSL ES 1.01). By default, shaders that do not include a `#version` directive will be treated as written in GLSL ES version 1.00.
The `#version` directive must be specified at the top of the shader program and can only be preceded by comments and white space.
