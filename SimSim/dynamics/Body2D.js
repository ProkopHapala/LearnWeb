"use strict";

class SubBody2D{
    constructor(){
        this.radius = 1.0;
        //this.mass   = 0;
        this.lpos   = vec2.create();
        this.lrot   = vec2.create();
    }
    /*
    pointDist(p){
        let dx = p[0] - this.lpos[0];
        let dy = p[1] - this.lpos[1];
        let r2 = dx*dx + dy*dy;
        return r2-this.radius;
    }
    */
}

class RectObject extends SubBody2D{

    constructor(){
        //SubBody2D.call();
        super();
        this.span = vec2.create();
    }

    pointDist(x,y){
        let dx = x - this.lpos[0];
        let dy = y - this.lpos[1];
        let ca = dx*this.lrot[0] + dy*this.lrot[1];   if(ca<0) ca=-ca;
        let cb = dy*this.lrot[1] - dx*this.lrot[0];   if(cb<0) cb=-cb;
        //console.log( dx, dy, ca, cb, ca-this.span[0], cb-this.span[1] );
        return Math.max( ca-this.span[0], cb-this.span[1] );
    }

    draw( screen, filled ){
        let ctx = screen.ctx;
        let x0 =this.lpos[0], y0=this.lpos[1];
        let dax= this.lrot[0]*this.span[0], day=this.lrot[1]*this.span[0];
        let dbx=-this.lrot[1]*this.span[1], dby=this.lrot[0]*this.span[1];
        //console.log(x0,y0, dax,day, dbx,dby );
        ctx.beginPath();
        ctx.moveTo( screen.x2pix(x0-dax-dbx), screen.x2pix(y0-day-dby) );
        ctx.lineTo( screen.x2pix(x0+dax-dbx), screen.x2pix(y0+day-dby) );
        ctx.lineTo( screen.x2pix(x0+dax+dbx), screen.x2pix(y0+day+dby) );
        ctx.lineTo( screen.x2pix(x0-dax+dbx), screen.x2pix(y0-day+dby) );
        ctx.lineTo( screen.x2pix(x0-dax-dbx), screen.x2pix(y0-day-dby) );
        if(filled){ ctx.fill(); } else{ ctx.stroke(); };
    }

}

class Body2D{
    constructor(){
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

    move(dt){
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
    
    apply_force( dforce, gdpos ){
        this.torq += vec2.fcross( gdpos, dforce );
        vec2.add( this.force, this.force, dforce );
    }
    
    transformSub_d( loc, glob ){ vec2.mul_complex( glob, loc, this.rot );  };
    transformSub_p( loc, glob ){ vec2.mul_complex( glob, loc, this.rot ); vec2.add(glob,blob,this.pos); };
    applySubForce( sub, dforce ){
        let  gdpos = [];
        vec2.mul_complex( gpos, sub.lpos, this.rot );
        this.torq += vec2.fcross( gdpos, dforce );
        vec2.add( this.force, this.force, dforce );
    }

}


