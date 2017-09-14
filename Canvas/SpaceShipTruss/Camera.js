"use strict";

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

function to2D( p3, p2, z_screen ){
    let sc = z_screen/p3[2];
    p2[0]  = p3[0]*sc;
    p2[1]  = p3[1]*sc;
}

