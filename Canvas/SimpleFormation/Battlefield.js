"use strict";

// from  https://codepen.io/dissimulate/pen/KrAwx



window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000.0/60);
    };

// ============ Globals

//var units = [];
//var map   = [];

var army1 = new Army( "Army1" ); army1.color="#f00";
var army2 = new Army( "Army2" ); army2.color="#00f";

var Globals = {
    thisArmy: army1,
    thisUnit: null,
    dt:       0.2,
}

var mouse = {
    down:   false,
    button: 1,
    x:   0.0, y:   0.0,
    begX:0.0, begY:0.0
};

var canvas,ctx;

var Screen = function(){
    this.x0 =   0.0;
    this.y0 =   0.0;
    this.setZoom(1.0);
} 

Screen.prototype = {
    setZoom: function(Zoom){ this.Zoom=Zoom; this.invZoom=1.0/Zoom; },
    //x2pix:   function (x ){return (x-this.x0)*this.Zoom;     },
    //y2pix:   function (y ){return (y-this.y0)*this.Zoom;     },
    x2pix:   function (x ){return Math.fround( ( x-this.x0)*this.Zoom );  },   // recomanded to optimize speed of Canvas by removing antialiasing
    y2pix:   function (y ){return Math.fround( (y-this.y0)*this.Zoom  );  },
    pix2x:   function (px){return px*this.invZoom + this.x0; },
    pix2y:   function (py){return py*this.invZoom + this.y0; }
}

var screen = new Screen();

// ============ Functions

function updateScene(){
    //console.log( "units.length " + units.length );
    var dt = Globals.dt;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    //for(i=0; i<army1.units.length; i++){ army1.units[i].move( dt ); }

    army1.update(dt, army2);
    army2.update(dt, army1);

    ctx.stroke();
    drawScene( );
    requestAnimFrame(updateScene);
}

Path.prototype.draw = function(){
    var i0 = this.i;
    var p = this.points[i0];
    ctx.moveTo( screen.x2pix(p.x), screen.y2pix(p.y) ); 
    for(var i=i0+1; i<this.points.length; i++){ var p_ = this.points[i]; ctx.lineTo( screen.x2pix(p_.x), screen.y2pix(p_.y) ); }
}

Army.prototype.update = function( dt, emenyArmy ){
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    for(var i=0; i<this.units.length; i++){
        var unit = this.units[i];
        unit.move( dt );
        unit.tryFindBetterEnemy( emenyArmy.units );
    }
    ctx.stroke();
}

Army.prototype.draw = function(){
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    for(var i=0; i<this.units.length; i++){
        var unit = this.units[i]; 
        //console.log( unit );       
        var x  = screen.x2pix( unit.pos.x );
        var y  = screen.y2pix( unit.pos.y );
        var sz = unit.type.size;
        ctx.moveTo( x-sz, y-sz); 
        ctx.lineTo( x+sz, y-sz);
        ctx.lineTo( x+sz, y+sz);
        ctx.lineTo( x-sz, y+sz);
        ctx.lineTo( x-sz, y-sz);
        if( unit.path  ){ unit.path.draw(); }
        //console.log( unit.enemy );
        if( unit.enemy ){
            //console.log( unit.pos, unit.enemy.pos );
            ctx.moveTo( screen.x2pix( unit.pos.x       ), screen.y2pix( unit.pos.y   ) ); 
            ctx.lineTo( screen.x2pix( unit.enemy.pos.x ), screen.y2pix( unit.enemy.pos.y ) );
        }
    }
    ctx.stroke();
}

function drawScene(){
    army1.draw();
    army2.draw();
}

function initScene() {
    army1.addUnitLine( 5, new Vec2(10.0,20.0),  new Vec2(100.0,20.0),  Infantry, 10 );
    army2.addUnitLine( 5, new Vec2(10.0,200.0), new Vec2(100.0,200.0), Infantry, 10 );
    updateScene();
}

window.onload = function () {

    canvas  = document.getElementById('c');
    ctx     = canvas  .getContext('2d');
    canvas.width  = 1024;
    canvas.height = 512;

    //boundsx = canvas.width  - 1;
    //boundsy = canvas.height - 1;
    
    canvas.onmousedown = function (e) {
        mouse.button  = e.which;
        mouse.down    = true;
        var rect      = canvas.getBoundingClientRect();
        var px            = e.clientX - rect.left;
        var py            = e.clientY - rect.top;
        mouse.x = screen.pix2x( px );
        mouse.y = screen.pix2x( py );
        mouse.begX = mouse.x;
        mouse.begY = mouse.y;  
        //console.log( px, py );    
        //console.log( mouse  );  
        var imin = Globals.thisArmy.findNearestUnitRmax( mouse.x, mouse.y, 50.0 );
        //console.log( imin ); 
        if(imin>=0){
            Globals.thisUnit = Globals.thisArmy.units[imin];
            document.getElementById("txUnit")    .innerHTML = Globals.thisUnit.report();
            document.getElementById("txUnitType").innerHTML = Globals.thisUnit.type.report();
            if( Globals.thisUnit.path ){ Globals.thisUnit.path = null; }
        }
        e.preventDefault();
    };
    
    canvas.onmouseup = function (e) {
        mouse.down = false;
        if( Globals.thisUnit ){ Globals.thisUnit = null; }
        e.preventDefault();
    };
    
    canvas.onmousemove = function (e) {
        var rect  = canvas.getBoundingClientRect();
        var px = e.clientX - rect.left;
        var py = e.clientY - rect.top;
        mouse.x = screen.pix2x( px );
        mouse.y = screen.pix2x( py );
        //console.log( "onmousemove" );
        if( Globals.thisUnit  ){
            //console.log( "onmousemove Globals.thisUnit " );
            if( Globals.thisUnit.path ){
                Globals.thisUnit.path.addPointRmin( new Vec2(mouse.x,mouse.y), 20.0 );
            }else{
                if( norm2_2D( mouse.x-Globals.thisUnit.pos.x, mouse.y-Globals.thisUnit.pos.y ) > 400.0 ){
                    Globals.thisUnit.path = new Path( new Vec2(Globals.thisUnit.pos.x,Globals.thisUnit.pos.y) );
                    Globals.thisUnit.path.addPoint( new Vec2(mouse.x,mouse.y) );
                    //console.log( Globals.thisUnit.path );
                }
            }
            
        }
        e.preventDefault();
    };
    
    canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };

    initScene();
};
