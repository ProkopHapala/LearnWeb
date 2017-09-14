"use strict";

var Node = function( id, pos, mass ){
    this.id    = id; 
    this.mass  = mass;
    this.pos   = pos;
    this.vel   = vec3.create();
    this.force = vec3.create();
}

var Material = function( Kpull, Kpush, Spull, Spush ){
    this.Spull  = Kpull; 
    this.Spush  = Kpush;
    this.Kpull  = Spull; 
    this.Kpush  = Spush;
}

var Stick = function( i,j, S, l0, mat ){
    this.i = i | 0;
    this.j = j | 0;
    this.mat = mat;
    this.S  = S;
    this.l  = l0;
    this.l0 = l0;
    this.broken = 0;
}

var Truss = function( ){
    this.nodes  = [];
    this.sticks = [];
}

Truss.prototype.evalStickForces = function(){
    let d  = vec2.create();
    //let f  = vec2.create();
    for( let i=0; i<sticks.length; i++ ){
        let stick = this.sticks[i]; 
        let ndi   = this.nodes[stick.i];
        let ndj   = this.nodes[stick.j];
        let mat   = stick.mat;
        vec3.subtract(d, ndi.pos, ndj.pos );
        let l    = vec3.length(d);
        let l0   = stick.l0;
        let kfac = stick.S / l0;
        let f,fmax;
        let dl = l-l0;
        if( dl > 0 ){
            f        = dl*( mat.Kpull*kfac );
            let fmax =      mat.Spull*kfac;
        }else{
            f        = dl*( mat.Kpush*kfac );
            let fmax =      mat.Spush*kfac;
        }
        if( f > fmax ){ stick.broken = true; f=fmax; } 
        d.mul( f/l );
        vec3.sub(ndi,d);
        vec3.add(ndj,d);
    }
}

Truss.prototype.clenForce = function(){
    for( let i=0; i<nodes.length; i++ ){
        this.nodes[i].force.set(out, 0.0, 0.0, 0.0);
    }
}

Truss.prototype.moveNodes = function( dt ){
    for( let i=0; i<nodes.length; i++ ){
        let ndi = this.nodes[i];
        let vel = ndi.vel;
        let pos = ndi.pos;
        vec2.scaleAndAdd( vel, vel, ndi.force, dt);
        vec2.scaleAndAdd( pos, pos, vel,       dt);
    }
}

Truss.prototype.upadate = function( dt ){
    this.clenForce( nodes );
    this.evalStickForces( sticks, nodes );
    this.moveNodes( nodes, dt );
}




