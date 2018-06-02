"use strict";

//var Objects = [];
var scene_root = [];

var DEFAULTS = { nCircle: 8 };

var tmps = {
	v_pos:   new THREE.Vector3(),
	v_up:   new THREE.Vector3(),
	v_fw:   new THREE.Vector3(),
	v_left: new THREE.Vector3(),
	m4_1 : new THREE.Matrix4(),
};


function makeDownloadableFile(text, id, fname) {
	type = 'text/plain';
	var a = document.getElementById(id);
	var file = new Blob([text], { type: type });
	a.href = URL.createObjectURL(file);
	a.download = fname;
}

class Sphere {
	constructor(pos, R, root = scene_root) {
		this.pos = pos; this.R = R;
		this.root = root;
		root.push(this);
	}
	toThreeJS(material) {
		//console.log( "toThreeJS : R=" +this.R + " pos= "+this.pos );
		var object = new THREE.Mesh(new THREE.SphereGeometry(this.R, DEFAULTS.nCircle, DEFAULTS.nCircle), material);
		object.position.set(this.pos[0], this.pos[1], this.pos[2]);
		return object;
	}
	toGlsl() {
		return "Sphere(" + this.pos + "," + this.R + ");";
	}
};

class Cylinder {
	constructor(p1, p2, R, root = scene_root) {
		this.p1 = p1; this.p2 = p2; this.R = R;
		this.root = root;
		root.push(this);
	}
	toThreeJS(material) {
		//console.log( "toThreeJS : R=" +this.R + " pos= "+this.pos );
		let dp = new THREE.Vector3();
		//let p1 = new THREE.Vector3(this.p2[0], this.p2[1], this.p2[2]);
		//let p2 = new THREE.Vector3(this.p1[0], this.p1[1], this.p1[2]);
		let p1 = new THREE.Vector3().fromArray(this.p1);
		let p2 = new THREE.Vector3().fromArray(this.p2);
		dp.subVectors(p2,p1);
		let L = dp.length();
		//console.log( "L= "+L+"  dp "+dp );
		let object = new THREE.Mesh(new THREE.CylinderGeometry(this.R, this.R, L, DEFAULTS.nCircle), material);
		//object.lookAt(dp);

		object.matrixAutoUpdate = false;
		object.matrix.setDirUp(dp);
		object.matrix.swap(1,2);
		object.quaternion.setFromRotationMatrix( object.matrix );
		console.log(object.matrix.toString()  );

		p1.addScaledVector (dp,0.5);
		//object.position.copy(p1);
		object.matrix.setPosition ( p1 );

		//object.matrixAutoUpdate = true;  // THIS BREAKS EVERYTHING

		console.log("p1=",p1);
		console.log("p2=",p2);
		console.log("dp=",dp);

		return object;
	}
	toGlsl() {
		return "Cylinder(" + this.p1 + "," + this.p2 + "," + this.R + ");";
	}
};

