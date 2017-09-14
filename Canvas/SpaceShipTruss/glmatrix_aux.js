var vec3temp = vec3.create();

vec3.lincomb = function( out, a, b, c, fa, fb, fc ){
    out[0] = a[0]*fa + b[0]*fb + c[0]*fc;
    out[1] = a[1]*fa + b[1]*fb + c[1]*fc;
    out[2] = a[2]*fa + b[2]*fb + c[2]*fc;
}

vec3.rotate_csa_raw = function( out, ioff, x,y,z, ux,uy,uz, ca, sa ){
    console.log( "rotate_csa_raw: ", ioff, x,y,z,  ux,uy,uz, ca, sa );
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
	out[0+ioff]  = ca*x + sa*utx + cu*ux;
	out[1+ioff]  = ca*y + sa*uty + cu*uy;
	out[2+ioff]  = ca*z + sa*utz + cu*uz;
}

﻿mat3.rotate_csa = function( out, mat, uaxis, ca, sa ){
	let ux=uaxis[0]; let uy=uaxis[1]; let uz=uaxis[2];
 	vec3.rotate_csa_raw( out, 0, mat[0], mat[1], mat[2], ux, uy, uz, ca, sa );
 	vec3.rotate_csa_raw( out, 3, mat[3], mat[4], mat[5], ux, uy, uz, ca, sa );
 	vec3.rotate_csa_raw( out, 6, mat[6], mat[7], mat[8], ux, uy, uz, ca, sa );
}

﻿mat3.rotateAxisAngle = function( out, mat, uaxis, angle ){
	//uaxis.set( axis.mul( 1/axis.length() ) );
	let r2 = vec3.squaredLength(uaxis);
	if( (r2>1.000001)||(r2<0.999999) ){
	    vec3.mul( vec3temp, uaxis, 1.0/sqrt(r2) );
	    uaxis = vec3temp;
	}
	let ca   = Math.cos(angle);
	let sa   = Math.sin(angle);
	console.log( "rotateAxisAngle:  ", mat, uaxis, ca, sa );
 	mat3.rotate_csa( out, mat, uaxis, ca, sa );
}
