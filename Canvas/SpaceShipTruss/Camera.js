"use strict";

// https://stackoverflow.com/questions/13916066/speed-up-the-drawing-of-many-points-on-a-html5-canvas-element

var Camera = function( rot, pos, wh, z_screen, ctx ){
    this.ctx     = ctx;
    this.z_screen = z_screen;
    this.pos     = pos;
    this.rot     = rot;
    this.invRot  = mat3.create(); mat3.invert(rot, this.invRot);
    this.wh      = wh; 
    this.tmp2d   = vec2.create();
    this.tmp3d   = vec3.create();
}

Camera.prototype.lookAt = function( p ){
    //let dir = vec3d_temps[0];
    //let up  = vec3d_temps[1];
    let dir = [], up = [];
    vec3.add    ( dir, p, this.pos );
    mat3.getRow ( this.rot, 1, up       );
    mat3.setDirUp( this.rot, dir, up );
}

Camera.prototype.to2D = function( p3, p2 ){
    let tmp = this.tmp3d;
    vec3.subtract     ( tmp, p3,  this.pos );
    vec3.transformMat3( tmp, tmp, this.rot );
    let sc = this.z_screen/tmp[2];
    p2[0]  = tmp[0]*sc + this.wh[0]*0.5;
    p2[1]  = tmp[1]*sc + this.wh[1]*0.5;
    //console.log( p3, tmp, this.z_screen, sc, this.wh, p2 );
    //console.log( tmp, sc, this.wh, p2 );
}

Camera.prototype.line = function( p1, p2 ){
    let p2d = this.tmp2d;
    this.to2D( p1, p2d );  ctx.moveTo( p2d[0], p2d[1] ); //console.log( "1 ", p2d );
    this.to2D( p2, p2d );  ctx.lineTo( p2d[0], p2d[1] ); //console.log( "2 ", p2d );
}

Camera.prototype.point = function( p1, sz ){
    let p2d = this.tmp2d;
    this.to2D( p1, p2d );
    let x = Math.round(p2d[0]);
    let y = Math.round(p2d[1]);
    //console.log( p1, p2d, x,y );
    ctx.rect(x-sz,y-sz,2*sz,2*sz);
    //ctx.stroke(); 
    ctx.fill(); 
}

function to2D( p3, p2, z_screen ){
    let sc = z_screen/p3[2];
    p2[0]  = p3[0]*sc;
    p2[1]  = p3[1]*sc;
}

