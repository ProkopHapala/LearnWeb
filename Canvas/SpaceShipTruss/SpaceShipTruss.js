"use strict";

window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000.0/60);
    };

var Globals = {
    truss1: new Truss(),
    dt:       0.2,
}

var mouse = {
    down:   false,
    button: 1,
    x:   0.0, y:   0.0,
    begX:0.0, begY:0.0
};

var canvas,ctx,camera;

// ============ Functions

Truss.prototype.drawStics = function(camera){
    //let nodes = this.nodes;
    ctx.beginPath();
    ctx.strokeStyle = '000';
    
    //ctx.moveTo( 0.0, 0.0 );
    //ctx.lineTo( 100.0, 100.0 );
    
    for(let i=0; i<this.sticks.length; i++){
        let stick = this.sticks[i];
        camera.line( this.nodes[stick.i].pos, this.nodes[stick.j].pos );
        //console.log( i,  stick.i, stick.j, this.nodes[stick.i].pos, this.nodes[stick.j].pos );
    }
    ctx.stroke();
}

Truss.prototype.drawNodes = function(camera){
    ctx.strokeStyle = '000';
    for(let i=0; i<this.nodes.length; i++){
        camera.point( this.nodes[i].pos, 2 );
    }
}

function drawScene(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Globals.truss1.drawNodes( camera );
    Globals.truss1.drawStics( camera );
}

function updateScene(){
    let dt = Globals.dt;
    //Globals.truss1.update(dt);
    drawScene();
    
    requestAnimFrame(updateScene);
}

function initScene() {
    let nNodes = 30; 
    let nStick = 50;

    let mater = new Material( 10.0, 10.0, 1.0, 1.0 );
    
    Globals.truss1.makeSolid( Octahedron.verts, Octahedron.edges, 1.0, {S:1.0,mat:mater} );
    
    let kind_long   = {S:1.0,mat:mater};
    let kind_perp   = {S:1.0,mat:mater};
    let kind_zigIn  = {S:1.0,mat:mater};
    let kind_zigOut = {S:1.0,mat:mater};
    Globals.truss1.makeGirder_1( vec3.fromValues(0.0,0.0,0.0), vec3.fromValues(10.0,5.0,0.0), vec3.fromValues(0.0,1.0,0.0), 6, 2.0, kind_long, kind_perp, kind_zigIn, kind_zigOut );
    
    /*
    let nodes  = Globals.truss1.nodes;
    let sticks = Globals.truss1.sticks; 
    
    for( let i=0; i<nNodes; i++ ){
        let pos = vec3.fromValues( Math.random(), Math.random(), Math.random() );
        let nd  = new Node( i, pos, 1.0 );
        nodes.push( nd );
    }
    
    for( let i=0; i<nStick; i++ ){
        let ii = Math.floor( Math.random()*nNodes );
        let jj = Math.floor( Math.random()*nNodes );
        let l0 = vec3.dist( nodes[ii].pos, nodes[jj].pos );
        let nd  = new Stick( ii, jj, 1.0, l0, mater );
        sticks.push( nd );
    }
    */
    
    drawScene();
}


function keyPressed(event) {
    var key = event.keyCode;
    //console.log(key);
    let drot = 0.1;
    switch(key) {
        case 38: mat3.rotateAxisAngle( camera.rot,camera.rot, [1.0,0.0,0.0],  drot); break;
        case 40: mat3.rotateAxisAngle( camera.rot,camera.rot, [1.0,0.0,0.0], -drot); break;
        //case 37: mat3.rotateAxisAngle( camera.rot,camera.rot, vec3.fromValues(0.0,1.0,0.0),  drot); break;
        //case 39: mat3.rotateAxisAngle( camera.rot,camera.rot, vec3.fromValues(0.0,1.0,0.0), -drot); break;
        case 37: vec3.rotateAxisAngle( camera.pos, camera.pos, [0.0,1.0,0.0],  drot); camera.lookAt([0.0,0.0,0.0]); break;
        case 39: vec3.rotateAxisAngle( camera.pos, camera.pos, [0.0,1.0,0.0], -drot); camera.lookAt([0.0,0.0,0.0]); break;
        //case 38: mat3.rotate( camera.rot, camera.rot,   drot); break;
        //case 40: mat3.rotate( camera.rot, camera.rot,  -drot); break;
        //case 37: mat3.rotate( camera.rot, camera.rot,   drot); break;
        //case 39: mat3.rotate( camera.rot, camera.rot,  -drot); break;
    } 
    //console.log( camera.pos  );
    //console.log( camera.rot );
}

window.onload = function () {

    canvas  = document.getElementById('canvasFrame');
    ctx     = canvas  .getContext('2d');
    canvas.width  = 1024;
    canvas.height = 512;

    // https://stackoverflow.com/questions/15631991/how-to-register-onkeydown-event-for-html5-canvas
    
    //canvas.onkeypress = keyPressed;
    //canvas.tabIndex = 1000;
    //canvas.addEventListener("keydown", keyPressed, false);
    window.addEventListener("keydown", keyPressed, false);
    
    //object.onkeypress = function(){myScript};

    canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };
    
    let camPos = vec3.fromValues( 0.0,0.0, -20.0 );
    let camRot = mat3.create();
    let wh     = vec2.fromValues( canvas.width, canvas.height );
    camera = new Camera( camRot, camPos, wh, 500.0, ctx );

    initScene();
    updateScene();
};
