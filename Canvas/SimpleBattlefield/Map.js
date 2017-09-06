"use strict";

// ===========================
//        TerrainType 
// ===========================

var TerrainType = function( name ){
    this.name = name;
    this.cover_fac  = 0.6; // visibility reduction factor 
    this.cover_size = 1.0; // [m]   
    this.offroad    = 0.4; 
}

var Plain = new TerrainType("Plain");

var Swamp = new TerrainType("Swamp");
Swamp.cover_fac  = 0.8;
Swamp.cover_size = 0.1; 
Swamp.offroad    = 0.9; 
Swamp.color      = "#0f0f0f";

var Rocks = new TerrainType("Rocks");
Rocks.cover_fac  = 0.2;
Rocks.cover_size = 2.5;
Rocks.offroad    = 0.9; 

var Forrest = new TerrainType("Forrest");
Forrest.cover_fac  = 0.3;
Forrest.cover_size = 1.0;
Forrest.offroad    = 0.4; 

var Urban = new TerrainType("Urban");
Urban.cover_fac  = 0.1;
Urban.cover_size = 5.0;
Urban.offroad    = 0.4; 

// ===========================
//        Map
// ===========================

var Site = function( height, type ){
    this.height = height;
    this.type   = type;
}

var Map = function( nx,ny, x0,y0, step_x, step_y ){
    this.nx=nx; this.ny=ny; this.ntot = nx*ny;   
    this.x0=x0; this.y0=y0; 
    this.span_x   =step_x;     this.span_y   =step_y;  
    this.invStep_x=1.0/step_x; this.invStep_y=1.0/step_y;   
    this.sites = [];
    for(var i=0; i<this.ntot; i++ ){
        sites.push( Site( 0.0, Plain ) );
    }
}

Map.prototype.getSite = function( x, y ){
    var ix = int( (x-this.x0)* this.invStep_x );
    var iy = int( (y-this.y0)* this.invStep_y ); 
    var i  = this.nx*iy + ix;
    return Site;
}

Map.prototype.lerpSite = function( x, y, site ){
    var dx = (x-this.x0)* this.invStep_x;
    var dy = (y-this.y0)* this.invStep_y;
    var ix = int( dx );
    var iy = int( dy );
    dx = dx - ix; var mx = 1.0-dx;
    dy = dy - iy; var my = 1.0-dy;
    var c00=my*mx, c01=my*dx, c10=dy*mx, c11=dy*dx;
    var iiy = this.nx*iy;
    var i   = iiy+ix;
    var s00=this.sites[i];    var s01 =this.sites[i+iiy];     var s10 =this.sites[i+1];     var s11 =this.sites[i+iiy+1]; 
    site.height     = c00*s00.height     + c01*s01.height     + c10*s10.height     + c11*s11.height;
    site.cover_fac  = c00*s00.cover_fac  + c01*s01.cover_fac  + c10*s10.cover_fac  + c11*s11.cover_fac;
    site.cover_size = c00*s00.cover_size + c01*s01.cover_size + c10*s10.cover_size + c11*s11.cover_size;
    site.offroad    = c00*s00.offroad    + c01*offroad        + c10*s10.offroad    + c11*offroad;
}
