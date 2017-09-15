"use strict";

void SubBody2D = function(){
    //this.radius = 0;
    ///this.mass   = 0;
    this.lpos   = 0;
    this.lrot   = 0;
}

//SubBody2D.prototype.globalPose = function( gpos, grot ){}

var Body2D = function(){
    this.mass   = 1.0;
    this.I      = 1.0;
    //this.invI   = 1/this.I;
    this.radius = 1.0; 
    
    this.pos    = vec2.create();
    this.vel    = vec2.create();
    this.force  = vec2.create();
    
    this.rot    = vec2.create();
    this.omega  = 0.0;
    this.torq   = 0.0;
}

Body2D.prototype.move = function(dt){
    let invMass = 1.0/this.mass;
    vec2.scaleAndAdd( this.vel,this.vel, this.force, dt*invMass );
    vec2.scaleAndAdd( this.pos,this.pos, this.vel,   dt         );
    let invI = 1.0/this.I;
    this.omega += this.torq * invI * dt;
    vec2.drot( this.rot, this.rot, omega*dt );
    // check if rot is unitary
    let r2 =  vec2.sqrLen(this.rot);
    if( (r2>1.0001) || (r2<0.9999) ){ vec2.scale( this.dir, this.dir, 1/Math.sqrt(r2) );  }
}

Body2D.prototype.apply_force = function( dforce, gdpos ){
	this.torq += vec2.fcross( gdpos, dforce );
	vec2.add( this.force, this.force, dforce );
};

Body2D.prototype.transformSub_d = function( loc, glob ){ vec2.mul_complex( glob, loc, this.rot );  };
Body2D.prototype.transformSub_p = function( loc, glob ){ vec2.mul_complex( glob, loc, this.rot ); vec2.add(glob,blob,this.pos); };
Body2D.prototype.applySubForce  = function( sub, dforce ){
    let  gdpos = [];
    vec2.mul_complex( gpos, sub.lpos, this.rot );
    this.torq += vec2.fcross( gdpos, dforce );
    vec2.add( this.force, this.force, dforce );
 }
