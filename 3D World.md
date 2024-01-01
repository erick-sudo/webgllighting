# **3D World**

## Specifying the Viewing Direction

---

The critical factor when considering 3D objects is that they have depth in a 3D space.  
When describing the way you view objects, two points need consideration:

- The viewing direction
- The visible range

### Eye point

This is the starting point from which the 3D space is viewed. i.e `(eyeX, eyeY, eyeZ)`

### Look-at-point

This the point at which you are looking and which determines the direction of the line of sight from the eye point. The look-at-point is a point on the line of sight extending from the eye point. The coordinates referred to as `(atX, atY, atZ)`.

### Up direction

This determines the up direction in the scene that is being viewed from the eye point to the look-at-point.  
If only the eye point and the lool-at-point are determined, there is freedom to rotate the line of sight from the eye point to the look-at point.  
To define the rotation, you must determine the up direction along the line of sight.  
The up direction is specified by three number representing direction. ie. `(upX, upY, upZ)`.


In WebGL, you can specify the position and direction the eye point faces by converting these tree items of information in a matrix and passiing the matrix to a vertext shader. This matrix is called a **view transformation matrix** or **view matrix**, because it changes the view of the scene.
