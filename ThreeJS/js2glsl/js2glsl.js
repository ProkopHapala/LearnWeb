"use strict";

//var Objects = [];
var scene_root = [];

var DEFAULTS={ nCircle:8 };

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

class Cylinder{
    constructor(p1,p2,R,root=scene_root){
		this.p1=p1; this.p2=p2; this.R=R;
		this.root=root;
		root.push(this);
	}
	toThreeJS( material ){
		//console.log( "toThreeJS : R=" +this.R + " pos= "+this.pos );
		let dp = new THREE.Vector3();
		dp.subVectors ( new THREE.Vector3(this.p2[0], this.p2[1], this.p2[2]), new THREE.Vector3(this.p1[0], this.p1[1], this.p1[2])   );
		let L = dp.length(); 
		//console.log( "L= "+L+"  dp "+dp );
		let object = new THREE.Mesh( new THREE.CylinderGeometry( this.R, this.R, L, DEFAULTS.nCircle ), material );
		object.lookAt ( dp );
		object.position.set( this.p1[0], this.p1[1], this.p1[2] );
		return object;
	}
	toGlsl(){
		return "Cylinder("+this.p1+","+this.p2+","+this.R+");";
	}
}

