
class DynamicPoitBody3D{

    constructor(){
        this.mass = 1.0;
        this.pos   = vec3.create();
        this.vel   = vec3.create();
        this.force = vec3.create();
    }

    move(dt){
        let invMass = 1.0/this.mass;
        vec2.scaleAndAdd( this.vel,this.vel, this.force, dt*invMass );
        vec2.scaleAndAdd( this.pos,this.pos, this.vel,   dt         );
    }

}

