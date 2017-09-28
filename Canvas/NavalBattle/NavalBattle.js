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
    polar:    null,
    angle:    0.0,
    testFoilPlatform: null,
    waterAngLen : [ Math.PI*-0.5, 1.0 ],
    dt:       0.01,
}

var environment = new Environment2D();

var units = [];

var canvas,ctx;
var screen;

//var screen = new Screen( );

// ============ Functions

function makeFoilPlatform(){
        
    let body       = new DynamicBody2D( );
    let foil     = new Foil2D();
    foil.pos[0]  = 5.0;

    Globals.polar = foil.samplePolar( 100, Math.PI, -Math.PI );

    //body.foils.push( foil );
    body.foil = foil;
    body.pos[0]=100; body.pos[1]=30;
    return body;
};

function makeShip(){

    let gunType1   = new GunType( "75mm", new AmmoType() );
    let turretType = new TurretType( 1, gunType1, 1.0 ); 
    let turret1    = new Turret( turretType ); turret1.pos[0] = 2.0; turret1.setAngle( Math.PI * 0.6 );
    let turret2    = new Turret( turretType ); turret2.pos[0] = 5.0; turret2.setAngle( Math.PI * 0.6 );
    
    let shipType   = new ShipType();

    let ship       = new Ship( "ship1", shipType );
    ship.turrets.push( turret1 );
    ship.turrets.push( turret2 );

    let keel       = new Foil2D(); keel  .area = 10.0;
    let rudder     = new Foil2D(); rudder.area = 0.1;   rudder.setAngle( -0.15 );
    rudder.pos[0]  = -shipType.length*0.5 + shipType.lcog;

    //Globals.polar = rudder.samplePolar( 100, Math.PI, -Math.PI );

    ship.I = 10.0;

    ship.foils.push( keel   );
    ship.foils.push( rudder );
    //shipType.sails.push( sail1 );

    ship.pos[0]=100; ship.pos[1]=30;
    return ship;
};

function makeTank(){
    
    let gunType1   = new GunType( "75mm", new AmmoType() );
    let turretType = new TurretType( 1, gunType1, 1.5 ); 
    let tankType   = new TankType( turretType );

    let tank       = new Tank( tankType );
    tank.pos[0]=150; tank.pos[1]=50;
    return tank;
};

function updateScene(){
    //console.log( "units.length " + units.length );
    var dt = Globals.dt;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //army1.update(dt, army2);

    //vec2.fromAngleLength( environment.water_speed,  Globals.waterAngLen[0], Globals.waterAngLen[1] ); 

    //vec2.fromAngleLength( environment.water_speed,  Globals.waterAngLen[0], 0.0 ); 
    vec2.set( environment.water_speed,0.0,0.0 );
    for( let i=0; i<units.length; i++ ){
        units[i].update( dt, environment );
    }

    //Globals.thisUnit.setAngle  ( Globals.angle );
    //Globals.thisUnit.evalForces( environment   );    
    //Globals.thisUnit.move( dt   );    

    drawScene();
    requestAnimFrame(updateScene);
}

function drawTestFoilPolar(){
    Foil2D_temps.screen = screen;
    //vec2.fromAngleLength( environment.water_speed,  Globals.waterAngLen[0], Globals.waterAngLen[1] ); 
    Globals.testFoilPlatform.setAngle  ( Globals.angle );
    //Globals.testFoilPlatform.evalForces( environment );
    Globals.testFoilPlatform.foil.applyAeroForce( Globals.testFoilPlatform, [1.0,0.0], 1.0 );
    Foil2D_temps.screen = null;

    if( Globals.polar ){
        let xscale = [50.0,10.0]; 
        let yscale = [50.0,10.0]; 
        screen.ctx.strokeStyle = "#f00"; screen.plot( Globals.polar.alphas, Globals.polar.CDs, xscale, yscale );
        screen.ctx.strokeStyle = "#00f"; screen.plot( Globals.polar.alphas, Globals.polar.CLs, xscale, yscale );
        screen.ctx.strokeStyle = "#888"; screen.drawAxis( xscale, yscale ); screen.axhline( Globals.angle-Globals.waterAngLen[0], xscale );

        xscale[1] *= 4.0; 
        yscale[0] += 30.0; 
        screen.ctx.strokeStyle = "#f0f"; screen.plot( Globals.polar.CDs,    Globals.polar.CLs, xscale, yscale );
        screen.ctx.strokeStyle = "#888"; screen.drawAxis( xscale, yscale );
    }
}

function drawScene(){

    screen.ctx.strokeStyle = "#000";

    let ship = Globals.thisUnit;
    //vec2.drot( ship.rot, ship.rot, 0.01 );
    //vec2.drot( ship.turrets[0].rot, ship.turrets[0].rot, 0.01 );
    ship.draw(screen);

    let tank = Globals.tank1;
    //vec2.drot( tank.rot, tank.rot, 0.01 );
    //vec2.drot( tank.turret.rot, tank.turret.rot, 0.01 );
    tank.draw(screen);

    drawTestFoilPolar();

}

function initScene() {
    //army1.addUnitLine( 5, new Vec2(10.0,10.0),  new Vec2(100.0,10.0), Infantry, 10 );
    drawScene();
    updateScene();
}


function keyPressed(event) {
    var key = event.keyCode;
    console.log(key);
    let drot = 0.1;
    switch(key) {
        case 107: screen.setZoom( screen.Zoom*1.2 ); console.log( "Zoom: ", screen.Zoom); break;
        case 109: screen.setZoom( screen.Zoom*0.8 ); console.log( "Zoom: ", screen.Zoom); break;
        case 37: Globals.angle += 0.02; break;
        case 39: Globals.angle -= 0.02; break;
    } 
    //console.log( camera.pos  );
    //console.log( camera.rot );
}


window.onload = function () {

    canvas        = document.getElementById('c');
    ctx           = canvas  .getContext('2d');
    canvas.width  = 1024;
    canvas.height = 512;
    screen = new Screen2D( canvas, ctx, 5.0 );

    Globals.testFoilPlatform = makeFoilPlatform(); 
    Globals.thisUnit         = makeShip();  units.push( Globals.thisUnit );
    Globals.tank1            = makeTank();

    window.addEventListener("keydown", keyPressed, false);

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
