// ===========================
//        ProjectileType
// ===========================

class AmmoType{
    constructor(){
        this.mass_prj    = 1.0;
        this.mass_charge = 1.0;
        this.mass_tot    = 2.5;
        //this.crossection = 1.0;
        this.caliber      = 0.075; 
        this.damage_post  = 0.0;   // [J] 
    }
}

// ===========================
//        Projectile
// ===========================

class Projectile extends DynamicPoitBody3D{
    constructor( pos, vel, type ){
        super();
        this.type = type;
        this.mass = type.mass;
        vec3.set( this.pos, pos );
        vec3.set( this.vel, vel );
    }
}

// ===========================
//        GunType
// ===========================

class GunType{
    constructor( name, ammo ){
        this.name         = name; 
        this.ammo         = ammo;

        this.reload       = 3.0;   // [s]
        this.length       = 3.5;

        // these should be computed
        this.v_muzzle     =  800.0;   // [m/s]
        this.penetration  =  0.010;   // [m]
        this.damage_kin   = 1000.0;  // [J] 
        this.range        = 1000.0;  // [m] 
        //this.ammo_mass    = 0.05;    // [kg]
    }

    getMuzzle( ammo ){
        if( !ammo ) prjType=this.ammo;
        return 0.0; //https://en.wikipedia.org/wiki/Adiabatic_process
    }
}

// ===========================
//        TurretType
// ===========================

class TurretType{ 
    constructor( Ngun, gunType, radius ){
        this.radius  = radius;
        this.Ngun    = Ngun;
        this.gun     = gunType;
    }
}

// ===========================
//        Turret
// ===========================

class Turret extends Body2D{ 
    constructor( type ){
        super();
        this.type = type;
        this.elev = vec2.create();
    }

    draw(screen, platform){
        let gpos  = [0.0,0.0]; 
        let grot  = [0.0,0.0];
        vec2.mul_complex( grot, platform.rot, this.rot );
        vec2.mul_complex( gpos, platform.rot, this.pos );
        vec2.add( gpos, gpos, platform.pos ); 
        screen.circle( gpos[0], gpos[1], this.type.radius, false );
        let sz = this.type.gun.length;
        screen.line  ( gpos[0], gpos[1], gpos[0]+grot[0]*sz, gpos[1]+grot[1]*sz );
    }

}

