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

var ntiles = 16;
var tiles = Array( ntiles*ntiles );
let results_tmp = Array(9);

var houses = [];

const minDrawLength = 10.0;

var army1 = new Army( "Army1" ); army1.color="#f00";
var army2 = new Army( "Army2" ); army2.color="#00f";

//var hexRuler1 = new HexRuler( 5.0, 0, 0 );

var ruler1 = new SquareRuler( 10.0, -20, -20, ntiles );

var Globals = {
    thisArmy: army1,
    thisUnit: null,
    dt:       0.2,
}

var canvas,ctx;
var screen;

//var screen = new Screen( );

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
        //screen.rect( unit.pos.x, unit.pos.y, 0.5, 0.5, true );
        var x  = screen.x2pix( unit.pos.x );
        var y  = screen.y2pix( unit.pos.y );
        //console.log( x, y,  unit.pos.x, unit.pos.y );
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
    
    //hexRuler1.drawHexSamples( ctx, 128, 128, 0.025, 2 );
    let mouse = screen.mouse;
    //screen.rect( mouse.x, mouse.y, 0.5, 0.5, true );

    /*
    hexRuler1.hexIndex( mouse.x, mouse.y );
    //console.log( "mouse x,y: ", mouse.x, mouse.y, " ruler ia,ib: ",  hexRuler1.ia, hexRuler1.ib );
    hexRuler1.drawHexagon( screen, hexRuler1.ia, hexRuler1.ib );

    for( let i=0; i<5; i++ ){
        hexRuler1.drawHexagon( screen, 5,  5+i );
        //hexRuler1.drawHexagon( screen, 5+i,  5 );
    }
    */

    //ruler1.index( mouse.x, mouse.y );
    //console.log( "mouse x,y: ", mouse.x, mouse.y, " ruler ia,ib: ",  ruler1.ia, ruler1.ib );
    //ruler1.drawTile( screen, ruler1.ia, ruler1.ib );
    //for( let i=0; i<5; i++ ){ ruler1.drawTile( screen, 5+i,5   ); ruler1.drawTile( screen, 5,  5+i ); }


    let r = 3.0;
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    screen.circle( mouse.x, mouse.y, r, false );

    let nres = ruler1.getOverlapingTiles( mouse.x, mouse.y, r, results_tmp );
    //console.log( nres, results_tmp );
    ctx.beginPath();
    ctx.strokeStyle = '#888';
    for( let j=0; j<nres; j++ ){
        let itile = results_tmp[j];
        ruler1.i2ip(itile);
        //console.log( itile, ruler1.ia, ruler1.ib  );
        ruler1.drawTile( screen, ruler1.ia, ruler1.ib );
        //tiles[itile].push( i );
    }

    ruler1.index( mouse.x, mouse.y );
    ctx.beginPath();
    ctx.strokeStyle = '#f00';
    ruler1.drawTile( screen, ruler1.ia, ruler1.ib );
    let itile = ruler1.ip2i( ruler1.ia, ruler1.ib );
    let tile = tiles[itile];
    //console.log( itile, tile.length );
    for( let i=0; i<tile.length; i++ ){
        let iobj = tile[i];
        let obj  = houses[iobj]; 
        obj.draw(screen, true);
    }

    //screen.ngon( mouse.x, mouse.y, 1.5,0.0, 6, false );
    ctx.beginPath();
    ctx.strokeStyle = '#00f';
    for(let i=0; i<houses.length; i++ ){
        let obj = houses[i];
        obj.draw(screen);
        /*
        if( obj.pointDist( mouse.x,mouse.y ) < 0.0 ){
            console.log( " picked  ", i );
            obj.draw(screen, true);
        }
        */
    }

}

function initScene() {
    army1.addUnitLine( 5, new Vec2(10.0,10.0),  new Vec2(100.0,10.0), Infantry, 10 );
    army2.addUnitLine( 5, new Vec2(10.0,50.0), new Vec2(100.0, 50.0), Infantry, 10 );
    drawScene();
    updateScene();
}

window.onload = function () {

    canvas  = document.getElementById('c');
    ctx     = canvas  .getContext('2d');
    canvas.width  = 1024;
    canvas.height = 512;

    screen = new Screen2D( canvas, ctx, 5.0 );

    for(let i=0; i<tiles.length; i++){
        tiles[i] = [];
    }

    let nhouses = 10;
    for(let i=0; i<nhouses; i++ ){
        let obj = new RectObject();
        obj.lpos[0] = Math.random()*100.0; 
        obj.lpos[1] = Math.random()*50.0;
        let a = Math.random()*2*Math.PI;
        obj.lrot[0] = Math.cos(a);
        obj.lrot[1] = Math.sin(a);
        obj.span[0] = 1.0;
        obj.span[1] = 0.5;
        houses.push( obj );

        let nres = ruler1.getOverlapingTiles( obj.lpos[0], obj.lpos[1], 3.0, results_tmp );
        console.log( nres, results_tmp );
        for( let j=0; j<nres; j++ ){
            let itile = results_tmp[j];
            tiles[itile].push( i );
        }
    }

    canvas.onmousedown = function (e) {
        let mouse = screen.mouse;
        mouse.button  = e.which;
        mouse.down    = true;
        mouse.begX = mouse.x; mouse.begY = mouse.y;  
        screen.updateMousePos(e);
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
        let mouse = screen.mouse;
        mouse.down = false;
        if( Globals.thisUnit ){ Globals.thisUnit = null; }
        e.preventDefault();
    };
    
    canvas.onmousemove = function (e) {
        let mouse = screen.mouse;
        screen.updateMousePos(e);
        
        if( Globals.thisUnit  ){
            //console.log( "onmousemove Globals.thisUnit " );
            if( Globals.thisUnit.path ){
                Globals.thisUnit.path.addPointRmin( new Vec2(mouse.x,mouse.y), minDrawLength );
            }else{
                if( norm2_2D( mouse.x-Globals.thisUnit.pos.x, mouse.y-Globals.thisUnit.pos.y ) > minDrawLength*minDrawLength ){
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
