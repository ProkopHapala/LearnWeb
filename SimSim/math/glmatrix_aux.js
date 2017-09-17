"use strict";


// ========================
//   fastmath
// ========================

function trashold_cub( x, x1, x2 ){
	if      (x<x1){ return 0.0; }
	else if (x>x2){ return 1.0; }
	else    { let a =(x-x1)/(x2-x1); return a*a*( 3 - 2*a );  };
}

function quadratic_roots( a, b, c,  roots ){
    let D     = b*b - 4*a*c;
    if (D < 0) return false;
    let sqrtD = sqrt( D );
    let ia    = -0.5/a;
    roots[0]     = ( b - sqrtD )*ia;
    roots[1]     = ( b + sqrtD )*ia;
    return true;
}

// ========================
//   2D
// ========================

vec2.mul_complex=function( out, a, b ){
    let ax=a[0]; let ay=a[1];   let bx=b[0]; let by=b[1];
    out[0] = ax*bx - ay*by;     out[1] = ax*by + ay*bx;
}

vec2.perp   = function( out, a ){ out[0] = -a[1]; out[1] = a[0]; }
vec2.fcross = function( a, b   ){ return a[0]*b[1] - a[1]*b[0];  };

vec2.drot = function( out, v, a ){
    let a2   = a*a;
    var ca,sa;
    if( a2<0.01 ){
	    ca   =       1 - a2*( 0.50000000000 - 0.04166666666*a2 )   ;
	    sa   = a * ( 1 - a2*( 0.16666666666 - 0.00833333333*a2 ) ) ;
	}else{
	    ca = Math.cos();
	    sa = Math.sin();
	}
	let vx=v[0]; let vy=v[1];
	out[0] = vx*ca - vy*sa;     out[1] = vx*sa + vy*ca;
}

vec2.sincos_taylor2 = function( out, a ){
	let a2  = a*a;
	out[0]  =       1 - a2*( 0.50000000000 - 0.04166666666*a2 )   ;
	out[1]  = a * ( 1 - a2*( 0.16666666666 - 0.00833333333*a2 ) ) ;
}

// ========================
//   3D
// ========================

var vec3temp = vec3.create();

var vec3_axis   = { x:vec3.fromValues(1.0,0.0,0.0), y:vec3.fromValues(0.0,1.0,0.0), z:vec3.fromValues(0.0,0.0,1.0) };
var vec3d_temps = [ vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create() ]; 

var TempVars = function( type ){
	this.type   = type; 
	this.n      = 0;
	this.stack  = [];
}
TempVars.prototype.get     = function( ){
	let n = this.n;
	if( this.stack<n ){ stack.push( this.type.create() ); }; // 
	this.n++;
	return n;
}
TempVars.prototype.release = function( i ){
	let n = this.n;
	if( i<n ){ let tmp=stack[n]; stack[n]=stack[i]; tmp=tmp; } // swap so that released variable is last
	this.n--;
}

vec3.lincomb = function( out, a, b, c, fa, fb, fc ){
    out[0] = a[0]*fa + b[0]*fb + c[0]*fc;
    out[1] = a[1]*fa + b[1]*fb + c[1]*fc;
    out[2] = a[2]*fa + b[2]*fb + c[2]*fc;
}

vec3.rotate_csa_raw = function( out, ioff, x,y,z, ux,uy,uz, ca, sa ){
    //console.log( "rotate_csa_raw: ", ioff, x,y,z,  ux,uy,uz, ca, sa );
	let cu = (1-ca)*( ux*x + uy*y + uz*z );
    let utx = uy*z - uz*y;
	let uty = uz*x - ux*z;
	let utz = ux*y - uy*x;
	out[0+ioff]  = ca*x + sa*utx + cu*ux;
	out[1+ioff]  = ca*y + sa*uty + cu*uy;
	out[2+ioff]  = ca*z + sa*utz + cu*uz;
}

vec3.rotate_csa = function( out, a, uaxis, ca, sa ){
	//let cu = (1-ca)*vec3.dot( a, uaxis );
	let  x=a[0];     let  y=a[1];     let  z=a[2];
	let ux=uaxis[0]; let uy=uaxis[1]; let uz=uaxis[2];
	let cu = (1-ca)*( ux*x + uy*y + uz*z );
    let utx = uy*z - uz*y;
	let uty = uz*x - ux*z;
	let utz = ux*y - uy*x;
	out[0]  = ca*x + sa*utx + cu*ux;
	out[1]  = ca*y + sa*uty + cu*uy;
	out[2]  = ca*z + sa*utz + cu*uz;
}

vec3.rotateAxisAngle = function( out, vec, uaxis, angle ){
	let r2 = vec3.squaredLength(uaxis);
	if( (r2>1.000001)||(r2<0.999999) ){
	    vec3.mul( vec3temp, uaxis, 1.0/sqrt(r2) );
	    uaxis = vec3temp;
	}
	let ca   = Math.cos(angle);
	let sa   = Math.sin(angle);
	vec3.rotate_csa( out, vec, uaxis, ca, sa );
}

mat3.rotate_csa = function( out, mat, uaxis, ca, sa ){
	let ux=uaxis[0]; let uy=uaxis[1]; let uz=uaxis[2];
 	vec3.rotate_csa_raw( out, 0, mat[0], mat[1], mat[2], ux, uy, uz, ca, sa );
 	vec3.rotate_csa_raw( out, 3, mat[3], mat[4], mat[5], ux, uy, uz, ca, sa );
 	vec3.rotate_csa_raw( out, 6, mat[6], mat[7], mat[8], ux, uy, uz, ca, sa );
}

mat3.rotateAxisAngle = function( out, mat, uaxis, angle ){
	//uaxis.set( axis.mul( 1/axis.length() ) );
	let r2 = vec3.squaredLength(uaxis);
	if( (r2>1.000001)||(r2<0.999999) ){
	    vec3.mul( vec3temp, uaxis, 1.0/sqrt(r2) );
	    uaxis = vec3temp;
	}
	let ca   = Math.cos(angle);
	let sa   = Math.sin(angle);
	//console.log( "rotateAxisAngle:  ", mat, uaxis, ca, sa );
 	mat3.rotate_csa( out, mat, uaxis, ca, sa );
}

mat3.getRow=function( mat, i, vec ){ let i3 = i*3; vec[0 ]=mat[i3]; vec[1   ]=mat[i3+1]; vec[2   ]=mat[i3+2]; }
mat3.getCol=function( mat, i, vec ){               vec[0 ]=mat[i ]; vec[1   ]=mat[i +3]; vec[2   ]=mat[i +6]; }
mat3.setRow=function( mat, i, vec ){ let i3 = i*3; mat[i3]=vec[0 ]; mat[i3+1]=vec[1   ]; mat[i3+2]=vec[2   ]; }
mat3.setRow=function( mat, i, vec ){               mat[i ]=vec[0 ]; mat[i +3]=vec[1   ]; mat[i +6]=vec[2   ]; }

vec3.makeOrthoNormal = function( dir, up, side ){
	let ax=dir[0],ay=dir[1],az=dir[2];
	let la = Math.sqrt( ax*ax + ay*ay + az*az );
	let ira = 1/la;
	ax*=ira; ay*=ira; az*=ira;
	dir[0]=ax; dir[1]=ay; dir[2]=az;

	let bx=up [0],by=up [1],bz=up [2];
	let ab = ax*bx + ay*by + az*bz;
	bx-=ax*ab; by-=ay*ab; bz-=az*ab;
	let irb = 1/Math.sqrt( bx*bx + by*by + bz*bz );
	bx*=irb; by*=irb; bz*=irb;
	up[0]=bx; up[1]=by; up[2]=bz;

	let cx = ay*bz - az*by;
	let cy = az*bx - ax*bz;
	let cz = ax*by - ay*bx;
	side[0]=cx; side[1]=cy; side[2]=cz;

	return la;
}

mat3.setDirUp = function( out, dir, up ){
	let ax=dir[0],ay=dir[1],az=dir[2];
	let ira = 1/Math.sqrt( ax*ax + ay*ay + az*az );
	ax*=ira; ay*=ira; az*=ira;
	let bx=up [0],by=up [1],bz=up [2];
	let ab = ax*bx + ay*by + az*bz;
	bx-=ax*ab; by-=ay*ab; bz-=az*ab;
	let irb = 1/Math.sqrt( bx*bx + by*by + bz*bz );
	bx*=irb; by*=irb; bz*=irb;
	let cx = ay*bz - az*by;
	let cy = az*bx - ax*bz;
	let cz = ax*by - ay*bx;
	out[0]=cx; out[1]=cy; out[2]=cz;
	out[3]=bx; out[4]=by; out[5]=bz;
	out[6]=ax; out[7]=ay; out[8]=az;
}
