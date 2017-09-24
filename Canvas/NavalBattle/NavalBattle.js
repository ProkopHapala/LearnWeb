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

const minDrawLength = 10.0;

var Globals = {
    //thisArmy: army1,
    thisUnit: null,
    tank1:    null,
    dt:       0.2,
}

var canvas,ctx;
var screen;

//var screen = new Screen( );

// ============ Functions

function makeShip(){

    let gunType1   = new GunType( "75mm", new AmmoType() );
    let turretType = new TurretType( 1, gunType1, 1.0 ); 
    let turret1  = new Turret( turretType ); turret1.pos[0] = 2.0; turret1.setAngle( Math.PI * 0.6 );
    let turret2  = new Turret( turretType ); turret2.pos[0] = 5.0; turret2.setAngle( Math.PI * 0.6 );
    
    let shipType = new ShipType();

    let ship     = new Ship( "ship1", shipType );
    ship.turrets.push( turret1 );
    ship.turrets.push( turret2 );

    let keel      = new Foil2D();
    let rudder    = new Foil2D();
    rudder.pos[0] = -shipType.length*0.5 + shipType.lcog;

    ship.foils.push( keel   );
    ship.foils.push( rudder );
    //shipType.sails.push( sail1 );

    ship.pos[0]=30; ship.pos[1]=30;
    return ship;
};


function makeTank(){
    
    let gunType1   = new GunType( "75mm", new AmmoType() );
    let turretType = new TurretType( 1, gunType1, 1.5 ); 
    let tankType = new TankType( turretType );

    let tank     = new Tank( tankType );
    tank.pos[0]=50; tank.pos[1]=50;
    return tank;
};


function updateScene(){
    //console.log( "units.length " + units.length );
    var dt = Globals.dt;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //army1.update(dt, army2);

    drawScene( );
    requestAnimFrame(updateScene);
}

function drawScene(){

    let ship = Globals.thisUnit;
    vec2.drot( ship.rot, ship.rot, 0.01 );
    vec2.drot( ship.turrets[0].rot, ship.turrets[0].rot, 0.01 );
    ship.draw(screen);


    let tank = Globals.tank1;
    vec2.drot( tank.rot, tank.rot, 0.01 );
    vec2.drot( tank.turret.rot, tank.turret.rot, 0.01 );
    tank.draw(screen);

}

function initScene() {
    //army1.addUnitLine( 5, new Vec2(10.0,10.0),  new Vec2(100.0,10.0), Infantry, 10 );
    drawScene();
    updateScene();
}

window.onload = function () {

    canvas        = document.getElementById('c');
    ctx           = canvas  .getContext('2d');
    canvas.width  = 1024;
    canvas.height = 512;
    screen = new Screen2D( canvas, ctx, 5.0 );

    Globals.thisUnit  = makeShip();
    Globals.tank1     = makeTank();

    canvas.onmousedown = function (e) {
        let mouse = screen.mouse;
        mouse.button  = e.which;
        mouse.down    = true;
        mouse.begX = mouse.x; mouse.begY = mouse.y;  
        screen.updateMousePos(e);
        //var imin = Globals.thisArmy.findNearestUnitRmax( mouse.x, mouse.y, 50.0 );
        //console.log( imin ); 
        //if(imin>=0){
        //    Globals.thisUnit = Globals.thisArmy.units[imin];
        //    document.getElementById("txUnit")    .innerHTML = Globals.thisUnit.report();
        //    document.getElementById("txUnitType").innerHTML = Globals.thisUnit.type.report();
        //    if( Globals.thisUnit.path ){ Globals.thisUnit.path = null; }
        //}
        e.preventDefault();
    };
    
    canvas.onmouseup = function (e) {
        let mouse = screen.mouse;
        mouse.down = false;
        //if( Globals.thisUnit ){ Globals.thisUnit = null; }
        e.preventDefault();
    };
    
    canvas.onmousemove = function (e) {
        let mouse = screen.mouse;
        screen.updateMousePos(e);
        /*
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
        */
        e.preventDefault();
    };
    
    canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };

    initScene();
};
