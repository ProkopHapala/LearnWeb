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

GunType.prototype.report = function(){
  return "name            : "+  this.name              +"\n"+  
         "reload      [s] : "+  this.reload            +"\n"+ 
         "penetration [mm]: "+  this.penetration*1e+3  +"\n"+ 
         "damage_kin  [kJ]: "+  this.damage_kin *1e-3  +"\n"+ 
         "damage_post [kJ]: "+  this.damage_post*1e-3  +"\n"+ 
         "ammo_mass   [kg]: "+  this.ammo_mass         +"\n"+ 
         "range       [km]: "+  this.range*1e-3        +"\n";
}

var Rifle8mm = new GunType( "Rifle8mm");

var Gun75mm  = new GunType( "Gun75mm" );
Gun75mm.reload      = 10.0;
Gun75mm.penetration = 100;
Gun75mm.damage_kin  = 1e+6; 
Gun75mm.damage_post = 0.5e+6; 
Gun75mm.ammo_mass   = 10.0;
Gun75mm.range       = 5000.0;  // [m] 

var MG8mm   = new GunType( "MG12mm"  );
MG8mm.reload        = 0.5;

// ===========================
//         UnitType 
// ===========================

var UnitType = function( name ){
    this.name  = name;
    this.cost  = 5.0;     
    this.size  = 2.0;   // [m^2]
    this.speed   = 1.5; // [m/s]
    this.offroad = 1.0; // factor affecting speed in rough terrain
// 
    this.armor = 0.003;   // [m] 
    this.HP    = 100.0;   // [Joule]
    this.gun1  = Rifle8mm;
    this.gun2  = null;
    this.max_ammo_1 = 100;
    this.max_ammo_2 = 0;
    //this.max_fuel   = ; 
}

UnitType.prototype.report = function(){
    //console.log( this.type.name, this.pos );
    var s_gun1 = "gun1========\n"+this.gun1.report()+"max_ammo "+  this.max_ammo_1 +"\n";
    var s_gun2 = "gun2========\n";
    if( this.gun2 ){  s_gun2+=this.gun2.report()+"max_ammo "+  this.max_ammo_2 +"\n"; }
    return  "name          : "+  this.name       +"\n"+ 
            "cost    [$]   : "+  this.cost       +"\n"+ 
            "size    [m]   : "+  this.size       +"\n"+ 
            "speed   [km/h]: "+  this.speed*3.6  +"\n"+ 
            "offroad [%]   : "+  this.offroad*100+"\n"+ 
            "armor   [mm]  : "+  this.armor*1e-3 +"\n"+ 
            "HP      [J]   : "+  this.HP         +"\n"+
            s_gun1+s_gun2;
}


var Infantry = new UnitType( "Infantry" );

var Tank   = new UnitType( "Name" );
Tank.cost       = 30.0 * Infantry.cost;
Tank.offroad    = 0.5;
Tank.size       = 10.0;
Tank.armor      = 0.1;
Tank.HP         = 1e+5;
Tank.gun1       = Gun75mm;
Tank.gun2       = MG8mm;
Tank.max_ammo_1 = 30;
Tank.max_ammo_1 = 5000;

var  AT75mm = new UnitType();
AT75mm.size    = 3.0;  // [m^2]
AT75mm.cost    = 5.0 * Infantry.cost;
AT75mm.speed   = 0.5;  // [m/s]
AT75mm.offroad = 0.1; 
AT75mm.armor   = 0.01;  
AT75mm.HP      = 300.0; 

AT75mm.gun1    = Gun75mm;
AT75mm.max_ammo_1 = 30;

// ===========================
//          UnitPath
// ===========================

var Path = function ( p0 ) {  
    //console.log( "new Path" ); 
    this.l = 0.0;  // TODO: better would be to store time (multiplied by speed in terrain) 
    //this.s      = 0.0;          // position of the path 
    this.i = 0;
    this.points = [p0,];
}

Path.prototype.addPoint = function(p){
    //console.log( "addPoint" ); 
    var  p0 = this.points[this.points.length-1];
    this.l += p.dist(p0);
    this.points.push(p);
}

Path.prototype.addPointRmin = function(p, Rmin){
    var p0 = this.points[this.points.length-1];
    var r2 = p.dist2(p0);
    if( r2 > Rmin*Rmin ){
        var r       = Math.sqrt( r2 ); 
        this.l += r;
        this.points.push(p);
    } 
}

Path.prototype.getTarget = function(){ return this.points[this.i+1]; }

Path.prototype.nextPoint = function(){
    var i = this.i;
    if( i >= this.points.length-2 ) return false;
    var p0  = this.points[i  ];
    var p1  = this.points[i+1];
    this.l -= p0.dist(p1);
    this.i=i+1;
    return true;
}

Path.prototype.getPoint = function(s, pout){
    var i  = Math.floor(s);
    var p0 = this.points[i  ];
    var p1 = this.points[i+1];
    pout.set_lerp( p0, p1, s - i );
}

// ===========================
//          Unit
// ===========================

function softmax_sqrt   (x){ return 0.5*(   Math.sqrt( 1 + x*x ) + x ); }
function smoothstep_sqrt(x){ return 0.5*( x*Math.sqrt( 1 + x*x ) + 1 ); }

var Unit = function (x, y, N, type ) {   
    this.pos     = new Vec2(x,y); 
    this.dir     = Vec2(1.0,0.0); 
    this.type    = type;
    this.N       = N;
    this.N_wound = 0;
    //this.target  = null;
    this.path    = null;
    this.enemy   = null;
    this.moral   = 1.0;
    this.stamina = 1.0; // affects predominantly movement 
    this.stuned  = 0.0; // affects predominantly combat power 
    this.Ammo1 = type.max_ammo_1; // kg
    this.Ammo2 = type.max_ammo_0; // kg
};

Unit.prototype.report = function(){
    //console.log( this.type.name, this.pos );
    return  "type       : " + this.type.name  +"\n"+ 
            "N          : " + this.N          +"\n"+
            "N_wound    : " + this.N_wound    +"\n"+
            "moral   [%]: " + this.moral*100  +"\n"+
            "stamina [%]: " + this.stamina*100+"\n"+
            "stuned  [%]: " + this.stuned*100 +"\n"+
            "Ammo1      : " + this.Ammo1      +"\n"+
            "Ammo2      : " + this.Ammo2      +"\n";
}


Unit.prototype.move = function(dt){
    if( this.path ){
        //console.log( this.path.i, this.path.points.length );
        var target = this.path.getTarget(); 
        var dx     = target.x - this.pos.x;
        var dy     = target.y - this.pos.y;
        var r2     = dx*dx + dy*dy;
        var rmax   = this.type.speed*dt;
        //console.log( " r "+Math.sqrt(r2)+"  rmax "+rmax+" dt "+dt );
        if( r2 > rmax*rmax ){ 
            var renorm = dt/Math.sqrt(r2);
            this.pos.x+=dx*renorm; this.pos.y+=dy*renorm; 
        }else{
            this.pos.x=target.x; this.pos.y=target.y; 
            if( !this.path.nextPoint() ){ this.path = null; }
        }
    }
}

Unit.prototype.evalHitDamage = function( gun, dt, distance ){
    var cDist = ( gun.range - distance ) / gun.range;
    if( cDist < 0.0 ) return 0.0;
    var pen  =   gun.penetration * cDist; // should be non-linear ?
    var cPen = ( pen - this.type.armor ) / pen;
    if( cPen < 0.0 ) return 0;
    var damage = gun.damage_post + cPen*gun.damage_kin;
    //console.log( "cDist ", cDist, " pen ", pen, "this.armor", this.type.armor, " cPen ", cPen, " damage ", damage, " dt ", dt );
    return damage * (dt/gun.reload);
}

Unit.prototype.scoreEnemy = function( enemy ){
    var dx = this.pos.x - enemy.pos.x;
    var dy = this.pos.y - enemy.pos.y;
    var distance = Math.sqrt( dx*dx + dy*dy );
    var dt = 1.0;
    //console.log( this.type.gun1, this.type.gun1, enemy.type.gun1, enemy.type.gun1 );
    var me2him = enemy.evalHitDamage(this .type.gun1, dt, distance ); if( this .type.gun2 ) me2him += enemy.evalHitDamage(this .type.gun2, dt, distance );
    var him2me = this .evalHitDamage(enemy.type.gun1, dt, distance ); if( enemy.type.gun2 ) him2me += this .evalHitDamage(enemy.type.gun2, dt, distance );
    me2him *= 1.0/enemy.type.HP;
    him2me *= 1.0/this.type.HP; 
    // TODO: to do consider terrain on which enemy stands
    //console.log( distance, me2him, him2me );
    return me2him*( 1 + him2me/this.type.HP ); // TODO : check this later
}

Unit.prototype.tryFindBetterEnemy = function( units ){
    var i = Math.floor( ( Math.random() * units.length ) );
    var unit_i = units[i];
    if( this.enemy ){
        var new_score = this.scoreEnemy(unit_i);
        var old_score = this.scoreEnemy(this.enemy);
        //console.log( new_score, old_score );
        if( new_score > old_score ) this.enemy = unit_i;
    }else{
        this.enemy = unit_i;
    }
    //console.log( this.enemy );
}

// ===========================
//          Army 
// ===========================

var Army = function( name ){
    this.name  = name;
    this.units = [];
    this.color = '#000';
}

Army.prototype.findNearestUnit = function( x, y ){
    var imin  = -1;
    var r2min = 1e+300;
    for(var i=0; i<this.units.length; i++ ){
        var unit = this.units[i];
        var dx = unit.pos.x - x;
        var dy = unit.pos.y - y;
        var r2 = dx*dx + dy*dy;
        if( r2<r2min ){ imin=i; r2min = r2; }
    }
    return imin;
}

Army.prototype.findNearestUnitRmax = function( x, y, Rmax ){
    var imin  = -1;
    var r2min = 1e+300;
    var r2max = Rmax*Rmax;
    for(var i=0; i<this.units.length; i++ ){
        var unit = this.units[i];
        var dx = unit.pos.x - x;
        var dy = unit.pos.y - y;
        var r2 = dx*dx + dy*dy;
        if( (r2<r2max)&&(r2<r2min) ){ imin=i; r2min = r2; }
    }
    return imin;
}

Army.prototype.addUnitLine = function( n, p0, p1, type, N ){
    var invn = 1.0/(n-1);
    var dx = (p1.x - p0.x)*invn; 
    var dy = (p1.y - p0.y)*invn;
    var x  = p0.x;
    var y  = p0.y;
    for(var i=0; i<n; i++ ){
        this.units.push( new Unit( x,y, N, type ) );
        //console.log( this.units[this.units.length-1] );
        //console.log( this.units[this.units.length-1].pos );
        x+=dx; y+=dy;
    }
}

function attack_meele(attacker, defender){
    let d = new Vec2(); 
    d.set_subv(attacker.pos,defender.pos);
    let catt = d.dot(attacker.dir);
    let cdef = d.dot(defender.dir);
    
    
}