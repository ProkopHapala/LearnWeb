"use strict";

// ==================================
// ========= Globals
// ==================================

// https://stackoverflow.com/questions/50654388/is-there-editor-with-working-go-to-definition-for-multiple-javascript-files-li
//"use strict";
var screen;
var root_group = new THREE.Group();

var scene_root = [];

var DEFAULTS = { nCircle: 8 };

var tmps = {
	v_pos:  new THREE.Vector3(),
	v_up:   new THREE.Vector3(),
	v_fw:   new THREE.Vector3(),
	v_left: new THREE.Vector3(),
	m4_1 :  new THREE.Matrix4(),
};

// ==================================
// ========= Management
// ==================================

function selectText(element){
	let text = document.getElementById(element.value).contentDocument.body.childNodes[0].textContent;
	document.getElementById('txtScene').value = text;
	updateScene();
}

function updateScene(element){
	console.log("updateScene");
	
	// clean
	scene_root = [];               
	THREE.disposeHierarchy( root_group );

	// load
	let txt = document.getElementById('txtScene').value;
	makeDownloadableFile( txt, "urlResult", "result.txt" );
	
	let txColor = {r:0, g:200, b:0, a:1.0};;
	let material = screen.materials.lambert;
	let matwire = screen.materials.wire;	
	let scene = root_group;
	
	try {
		eval(txt);
		document.getElementById('txtLog').value = "Scene successfully compiled.";
	}catch(err){
		var vDebug = ""; 
		for (var prop in err) {  
		   vDebug += "property: "+ prop+ " value: ["+ err[prop]+ "]\n"; 
		} 
		vDebug += "ERROR: " + err.toString(); 
		//vDebug += "HEY";
		//status.rawValue = vDebug; 
		//document.getElementById('txtLog').value = vDebug;
		document.getElementById('txtLog').value = err.message;
	}


	for(let i=0;i<scene_root.length; i++){
		root_group.add( scene_root[i].toThreeJS( screen.materials.wire ) );
	}
	screen.render();
}

function makeDownloadableFile(text, id, fname) {
	type = 'text/plain';
	var a = document.getElementById(id);
	var file = new Blob([text], { type: type });
	a.href = URL.createObjectURL(file);
	a.download = fname;
}

function makeDownloadableFile( text, id, fname ){
	var a = document.getElementById( id );
	var file = new Blob([text], {type: 'text/plain'});
	a.href = URL.createObjectURL(file);
	a.download = fname;
}




