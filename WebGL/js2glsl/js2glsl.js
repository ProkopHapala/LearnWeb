"use strict";

//var Objects = [];
var scene_root = [];

var DEFAULTS={ nCircle:8 };

function makeTextSprite( message, parameters ){
	if ( parameters === undefined ) parameters = {};
	var  font  = parameters.hasOwnProperty("font")  ? parameters["font"]  : "Arial";
	var  size  = parameters.hasOwnProperty("size")  ? parameters["size"]  : 18;
	var color = parameters.hasOwnProperty("color") ? parameters["color"] : { r:0, g:0, b:0, a:1.0 };
	var canvas   = document.createElement('canvas');
	var context  = canvas.getContext('2d');
	context.font = "Bold " + size + "px " + font;
	var metrics = context.measureText( message );
	var textWidth = metrics.width;
	context.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
	context.fillText( message, 0, size);
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;
	var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100,50,1.0);
	return sprite;	
}

class Sphere{
    constructor(pos,R,root=scene_root){
		this.pos=pos; this.R=R;
		this.root=root;
		root.push(this);
	}
	toThreeJS( material ){
		//console.log( "toThreeJS : R=" +this.R + " pos= "+this.pos );
		var object = new THREE.Mesh( new THREE.SphereGeometry( this.R, DEFAULTS.nCircle, DEFAULTS.nCircle ), material );
		object.position.set( this.pos[0], this.pos[1], this.pos[2] );
		return object;
	}
	toGlsl(){
		return "Sphere("+this.pos+","+this.R+");";
	}
}

