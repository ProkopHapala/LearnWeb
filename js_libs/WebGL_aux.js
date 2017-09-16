"use strict";

// ====  initShaderProgram

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader  = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

// ====  loadShader

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

// ====  loadTexture

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

  const image  = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       gl.generateMipmap(gl.TEXTURE_2D);   // Yes, it's a power of 2. Generate mips.
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;
  return texture;
}


// ========= GLBuffer

var GLBuffer = function( gl, arr, perItem, usage=null, target=null ){
    if( !usage  ) usage =gl.STATIC_DRAW;
    if( !target ) target=gl.ARRAY_BUFFER;
    const buff = gl.createBuffer();
    if       ( target==gl.ARRAY_BUFFER         ){
        if( !(arr instanceof Float32Array) ){ arr = new Float32Array(arr); }; console.log( "ARRAY_BUFFER ",       arr.length/perItem, perItem );
    }else if ( target==gl.ELEMENT_ARRAY_BUFFER ){
        if( !(arr instanceof Uint16Array ) ){ arr = new Uint16Array(arr); }; console.log ( "ELEMENT_ARRAY_BUFFE ", arr.length/perItem, perItem );
    }
    gl.bindBuffer(target, buff );
    gl.bufferData(target, arr, usage );
    this.gl   = gl; 
    this.buff = buff;
    this.n    = arr.length/perItem; 
    this.m    = perItem;
}

GLBuffer.prototype.bind = function( loc ){
    const gl = this.gl;
    gl.bindBuffer( gl.ARRAY_BUFFER,  this.buff );
    gl.vertexAttribPointer    ( loc, this.m, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( loc );
}

// ========= GLObject

var GLObject = function( gl ){
    this.gl      = gl;
    this.mode    = gl.TRIANGLES;
    this.verts   = null;
    this.normals = null;
    this.UVs     = null;
    this.inds    = null;
}

GLObject.prototype.fromVertNormUVind = function( verts, normals, UVs, inds, usage=null ){
    const gl = this.gl;
    if(!usage) usage = this.gl.STATIC_DRAW;
    if( verts   ) this.verts   = new GLBuffer( gl, verts,   3, usage );
    if( normals ) this.normals = new GLBuffer( gl, normals, 3, usage );
    if( UVs     ) this.UVs     = new GLBuffer( gl, UVs,     2, usage );
    if( inds    ) this.inds    = new GLBuffer( gl, inds,    1, usage, gl.ELEMENT_ARRAY_BUFFER );
}

GLObject.prototype.bind = function( attribLocations ){
    const gl = this.gl;
    this.verts  .bind( attribLocations.vert );
    if( this.normals ){ this.normals.bind( attribLocations.normal ); }
    if( this.UVs     ){ this.UVs    .bind( attribLocations.UV     ); }
    if( this.inds    ){ gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.inds.buff ); }
}

GLObject.prototype.draw = function( mode = null ){
    const gl = this.gl;
    if( !mode ) mode = this.mode;
    if( this.inds ){
        //console.log( mode, this.inds.n,  );
        gl.drawElements( mode, this.inds.n, gl.UNSIGNED_SHORT, 0 );
    }else{
        gl.drawArrays  ( mode, 0, this.verts.n );
    }
}


