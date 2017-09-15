"use strict";

// http://www.redblobgames.com/grids/hexagons/

function hash_Wang( a ){
    a = (a ^ 61) ^ (a >> 16);
    a = a + (a << 3);
    a = a ^ (a >> 4);
    a = a * 0x27d4eb2d;
    a = a ^ (a >> 15);
    return a;
}

var HexRuler = function( step, x0, y0 ){
    this.step    = step;
    this.invStep = 1.0/step;
    this.x0 = x0;
    this.y0 = y0;
    
    // outputs
    this.ia = 0;
    this.ib = 0;
    this.da = 0;
    this.db = 0;
}

HexRuler.prototype.simplexIndex = function ( x, y ){
    x-=this.x0; y-=this.y0;
    let a   = ( this.invStep * (  x - 0.57735026919*y   ) );
    let b   = ( this.invStep *    y * 1.15470053839       );
    // http://blog.blakesimpson.co.uk/read/58-fastest-alternative-to-math-floor-in-javascript
	let ia   = Math.floor( a );  this.ia = ia;
    let ib   = Math.floor( b );  this.ib = ib;
    this.da  = a - ia;
    this.db  = b - ib;
    //console.log( a, b, " | ", ia, ib,  " | ", this.da, this.db );
}

HexRuler.prototype.hexIndex = function ( x, y ){
    x-=this.x0; y-=this.y0;
    let a    = ( this.invStep * (  x - 0.57735026919*y   ) );
    let b    = ( this.invStep *    y * 1.15470053839       );
	let ia   = Math.floor( a );
    let ib   = Math.floor( b );
    let da  = a - ia;   this.da = da;
    let db  = b - ib;   this.db = db;
    let ab  = da+db;
    let ab2 = ab+db;
    let a2b = ab+da;
    if      ( (ab2<1.0)&&(a2b<1.0) ){ this.ia=ia;   this.ib=ib;   }  // else{ this.ia=ia+1; this.ib=ib+1; }
    else if ( (ab2>2.0)&&(a2b>2.0) ){ this.ia=ia+1; this.ib=ib+1; }
    else if ( da>db                ){ this.ia=ia+1; this.ib=ib;   }
    else                            { this.ia=ia;   this.ib=ib+1; }
}

HexRuler.prototype.drawHexSamples = function( ctx, nx, ny, d, dpx ){
    let dpx2 = dpx+dpx;
    for( let ix=0; ix<nx; ix++ ){
        for( let iy=0; iy<ny; iy++ ){
           this.hexIndex( ix*d, iy*d );
           //this.simplexIndex( ix*d, iy*d );
           let icol = this.ia*65536 + this.ib;
           ctx.fillStyle =  "rgb("+   (hash_Wang(icol)&255)   +","+   (hash_Wang(icol+46487)&255)   +","+   (hash_Wang(icol+1379)&255)   +")";
           //console.log( this.ia, this.ib, " | ", ctx.fillStyle );
           ctx.fillRect( ix*dpx2-dpx, iy*dpx2-dpx, dpx2-1, dpx2-1 );
        }
    }
}

HexRuler.prototype.drawHexagon = function( ia, ib ){
    let yc = this.y0 + this.step * (ia * 0.86602540378);
    let xc = this.x0 + this.step * (ib + 0.5*ia);
    ctx.fillRect( xc-5, yc-5, 10, 10 );
    console.log( xc, yc );
    ctx.beginPath();
    let dx = this.step*0.5;
    let dy = this.step*0.86602540378;
    ctx.moveTo( xc+dx+dx, yc    );
    ctx.lineTo( xc+dx   , yc+dy );
    ctx.lineTo( xc-dx   , yc+dy );
    ctx.lineTo( xc-dx-dx, yc    );
    ctx.lineTo( xc-dx   , yc-dy );
    ctx.lineTo( xc+dx   , yc-dy );
    ctx.lineTo( xc+dx+dx, yc    );
    ctx.stroke();
}



