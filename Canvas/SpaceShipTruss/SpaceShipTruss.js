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

function drawScene(){
    Globals.truss1.drawStics( camera );
}

function updateScene(){
    let dt = Globals.dt;
    Globals.truss1.update(dt);
    drawScene();
}

function initScene() {
    let nNodes = 30; 
    let nStick = 50;

    let nodes  = Globals.truss1.nodes;
    let sticks = Globals.truss1.sticks; 
    
    for( let i=0; i<nNodes; i++ ){
        let pos = vec3.fromValues( Math.random(), Math.random(), Math.random() );
        let nd  = new Node( i, pos, 1.0 );
        nodes.push( nd );
    }
    
    let mater = new Material( 10.0, 10.0, 1.0, 1.0 );
    for( let i=0; i<nStick; i++ ){
        let ii = Math.floor( Math.random()*nNodes );
        let jj = Math.floor( Math.random()*nNodes );
        let l0 = vec3.dist( nodes[ii].pos, nodes[jj].pos );
        let nd  = new Stick( ii, jj, 1.0, l0, mater );
        sticks.push( nd );
    }
    
    drawScene();
}

window.onload = function () {

    canvas  = document.getElementById('canvasFrame');
    ctx     = canvas  .getContext('2d');
    canvas.width  = 1024;
    canvas.height = 512;

    canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };
    
    let camPos = vec3.fromValues( 0.0,0.0, -20.0 );
    let camRot = mat3.create();
    let wh     = vec2.fromValues( canvas.width, canvas.height );
    camera = new Camera( camRot, camPos, wh, 1005.0, ctx );

    initScene();
};
