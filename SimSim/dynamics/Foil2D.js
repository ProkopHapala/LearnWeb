"use strict";

var Foil2D = function(){
    SubBody2D.call();
	this.area   = 1.0;  // [m^2]
	this.CD0    = 0.02;
	this.dCD    = 0.9;
	this.dCDS   = 0.9;
	this.dCL    = 6.28;
	this.dCLS   = 2.82743338823;
	this.sStall = 0.16;
	this.wStall = 0.08;
}

Foil2D.prototype.polarModel = function( ca, sa, LD ){
	let abs_sa = (sa>0)?sa:-sa;
	let wS     = trashold_cub( abs_sa, this.sStall, this.sStall+this.wStall );
	let mS     = 1 - wS;
	LD[0]      = this.CD0 + ( mS*this.dCD*abs_sa + wS*this.dCDS    ) * abs_sa;
	if( ca <0 ){ ca=-ca; sa=-sa; };
	LD[1]      = ( mS*this.dCL        + wS*this.dCLS*ca ) * sa;
}

Foil2D.prototype.applyAeroForce( platform, vel, density ){
	let gpos  = [0.0,0.0]; 
	let grot  = [0.0,0.0];
	let vhat  = [0.0,0.0];
	let force = [0.0,0.0];
	let LD    = [0.0,0.0];
	
	vec2.mul_complex( grot, platform.rot, lrot );
	vec2.mul_complex( gpos, platform.rot, lpos );
	
	vhat[0] = vel[0] + gpos[1] * platform.omega;
	vhat[1] = vel[1] - gpos[0] * platform.omega;
	
	let vr2 = vec2.sqrLen( vhat );
	let ivr = 1/sqrt( vr2 + SAFETY_v );
	vec2.mul( vhat, vhat, ivr );
	
	let sa = vec2.dot   ( vhat, grot );
	let ca = vec2.fcross( vhat, grot );
	
	this.polarModel( ca, sa, LD );
	
	let prefactor = vr2 * density * area;
	force[0] = prefactor*( LD[0]*vhat[0] - LD[1]*vhat[1] );
	force[0] = prefactor*( LD[0]*vhat[1] + LD[1]*vhat[0] );
	
	platform.apply_force( force, gpos );
	
};

double AeroSurf2D::fromString( char * s ){
	double angle;
	//printf( "%s \n", s );
	sscanf ( s, "%lf %lf %lf %lf %lf %lf %lf %lf %lf %lf %lf", &pos.x, &pos.y, &angle, &area, &CD0, &dCD, &dCDS, &dCL, &dCLS, &sStall, &wStall );
	setAngle( angle );
	printf( "%s \n", toString( ) );
};

res = str.split();
