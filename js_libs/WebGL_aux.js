"use strict";

function printWithLineNumbers( str ){
    let lines = str.split('\n');
    for( let i=0; i<lines.length; i++ ){
        console.log( i, lines[i] );
    }
}

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
    //console.log( source );
    printWithLineNumbers(  source );
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

// ====  loadTexture

function genMinimap( gl, w, h ){
    if (isPowerOf2(w) && isPowerOf2(h)) {
       gl.generateMipmap(gl.TEXTURE_2D);   // Yes, it's a power of 2. Generate mips.
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
}

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
    genMinimap( gl, image.width, image.height );
  };
  image.src = url;
  return texture;
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D

function textureFromUint8Array( gl, arr, w, h ){
    //gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D ( gl.TEXTURE_2D, 0, gl.LUMINANCE, w, h, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, arr);
    genMinimap( gl, w, h );
    return texture;
}

    function textureFromFloat32Array( gl, arr, w, h ){
        console.log( "in textureFromFloat32Array: ");
        // https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float
        gl.getExtension('OES_texture_float');         // just in case
        gl.getExtension('OES_texture_float_linear');  // do I need this with WebGL2 ?
        // see https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
        const texture = gl.createTexture();
        gl.bindTexture( gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, w, h, 0, gl.RED, gl.FLOAT, arr);
        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, w, h, 0, gl.LUMINANCE, gl.FLOAT, arr);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        return texture;
    }


function texture3DFromFloat32Array( gl, arr, nx, ny, nz ){
    //var data = new Float32Array(SIZE * SIZE * SIZE);
    gl.getExtension('OES_texture_float');         // just in case
    gl.getExtension('OES_texture_float_linear');  // do I need this with WebGL2 ?
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_3D, texture);
    //gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL,  0);
    //gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    //gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage3D(
        gl.TEXTURE_3D,  // target
        0,              // level
        gl.R32F,        // internalformat
        nx,           // width
        ny,           // height
        nz,              // depth
        0,              // border
        gl.RED,         // format
        gl.FLOAT,       // type
        arr            // pixel
    );
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


