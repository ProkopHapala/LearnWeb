"use strict";

// ===========================
//        GunType
// ===========================

var GunType = function( name ){
    this.name         = name; 
    this.reload       = 3.0;     // [s]
    this.penetration  = 0.010;   // [m]
    this.damage_kin   = 1000.0;  // [J] 
    this.damage_post  = 0.0;     // [J] 
    this.ammo_mass    = 0.05;    // [kg]
    this.range        = 1000.0;  // [m] 
}

// ===========================
//        Turret
// ===========================

var Turret = function( Ngun, gunType ){
    this.Ngun    = Ngun;
    this.gunType = gunType;
    this.lpos;
    this.ldir;
}

// ===========================
//          ShipType
// ===========================

var ShipType = function( , sails, foils ){

    this.turrets;
    this.sails;
    this.foils;
}

// ===========================
//          Ship
// ===========================

var Ship = function( pos, dir ){
    this.pos;
    this.dir;
    
    this.omega;
    this.
    
    this.torq;
    this.force;
}









