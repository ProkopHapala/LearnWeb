"use strict";


// 
// How to overload constructors in JavaScript ECMA6  https://stackoverflow.com/questions/38240744/how-to-overload-constructors-in-javascript-ecma6/38240835
// https://stackoverflow.com/questions/6885404/javascript-override-methods
// Clean Code with ES6 Default Parameters & Property Shorthands https://www.sitepoint.com/es6-default-parameters/
// https://medium.com/dailyjs/named-and-optional-arguments-in-javascript-using-es6-destructuring-292a683d5b4e

class Catalog{
    constructor(kindNames){
        this.kinds={};
        if(kindNames){
            //console.log(kindNames);
            for(let i in kindNames ){
                let name = kindNames[i];
                //console.log(name);
                this.kinds[name] = [];
            }
        }
    }
    insert(item){
        //console.log(this.kinds);
        //console.log(this.kinds[item.kind]);
        let kind = this.kinds[item.kind];
        kind.push(item);
        console.log( "kind.lenght : ", item, " item.kind: ", item.kind, " kind: ", kind, " kind.lenght: ",kind.length );
        return kind.length-1;
    }
}

var defaultCatalog = new Catalog( ["default",] );

// ==== Materials
class CatalogItem{
    constructor(name,id,kind){
        this.name = name;
        if(kind){
            this.kind = kind;
        }else{
            this.kind = "default";
            //this.kind = null;
        }
        if(id instanceof(Number)){
            this.id=id;
        }else if ( id instanceof(Catalog) ){
            this.id=id.insert(this);
        }
    }
};

// === SpaceShip

/*
class SpaceCraft extends Catalog {
    constructor(name){
        super();
        this.name=name;
        this.clear();
    }
    clear(){
        this.nodes=[];
        this.ropes=[];
        this.girders=[];
        this.rings=[];
        this.thrusters=[];
        this.guns=[];
        this.radiators=[];
        this.shields=[];
        this.tanks=[];
        this.pipes=[];
    }
}
*/

//var defaultShip = new SpaceCraft();
var defaultShip;

class Material extends CatalogItem {
    constructor(name,density,Spull,Spush,Kpull,Kpush,reflectivity,Tmelt,   catalog=defaultCatalog,kind="Material"){
        super(name,catalog,kind);
        this.density;      // [kg/m3]
        this.Spull;
        this.Spush;  // [Pa] Strenght
        this.Kpull;
        this.Kpush;  // [Pa] elastic modulus
        this.reflectivity; // [1] reflectivity
        this.Tmelt;        // [T] temperature of failure
            // What about heat, electricity etc. ?
    }
};

class BodyPose{
    constructor(pos,rot){
        if(pos){ this.pos=pos; }else{ this.pos=new vec3(); };
        if(rot){ this.rot=rot; }else{ this.rot=new mat3(); };
    }
};

class BBox{
    constructor(pmin,pmax){
        this.pmin=pmin;
        this.pmax=pmax;
    }
};

class Commodity extends CatalogItem {
    constructor(name,density,      catalog=defaultCatalog,kind="Commodity"){
        super(name,catalog,kind);
        this.density=density;      // [kg/m3]
    }
};

class FuelType extends Commodity {
    constructor(name,density,energyDesity,   catalog=defaultCatalog,kind="FuelType"){
        super(name,density,catalog||globalCatalog,kind||"fuel");
        this.EnergyDesity=energyDesity;
    }
};

// ==== Components

class Node{
    constructor(pos){
        this.pos=THREE.toVec3( pos );
        this.components=[];
    }
};

class ShipComponent extends CatalogItem {
    constructor(name,ship=defaultShip,kind="ShipComponent"){
        super(name,ship,kind);
        this.shape = null; // FIXME TODO
        this.mass = 0.0;   // FIXME TODO       
    }
    /*
    constructor(shape,mass){
        this.shape;
        this.mass;           
    }
    */
    //RigidBody pose;
};

class Modul extends ShipComponent {
    constructor(name,pos,rot,span, ship=defaultShip,kind="Modul"  ){
        super(name,ship,kind);
        this.pose=new BodyPose(THREE.toVec3(pos),rot); // TODO - rot just up:vec3
        this.span=THREE.toVec3(span);
        this.volume=0.0;
    }
};

class Tank extends Modul {
    constructor(name,pos,rot,span,comodity,      ship=defaultShip,kind="Tanks"){
        super(name,pos,rot,span,  ship,kind);
        this.comodity=comodity;
        this.filled=0.0;
    }
};

class NodeLinker extends ShipComponent {
    constructor(name,node1,node2,     ship=defaultShip,kind="NodeLinker"){
        super(name,ship,kind);
        this.node1=node1;
        this.node2=node2;
        this.length = 0; // FIXME ... can auto-compute at construction
    }
};

class Girder extends NodeLinker { 
    constructor(name, node1, node2, up, nseg, mseg, w,h,material,    ship=defaultShip,kind="Girder" ){
        //NodeLinker(node1,node2);
        super(name,node1,node2,ship,kind);
        this.up = up;
        this.nseg=nseg;
        this.mseg=mseg;
        this.width=w;
        this.height=h;
        this.material=material;
        // this.trussPoitRange; // index of start and end in Truss
        // this.trussStickRange; // --,,---
    }
};

class Ring extends NodeLinker {
    //int p1; // anchor node; p0 inherate
    //double length;
    constructor(name,node1,node2, nseg, mseg, R,w,h,material,   ship=defaultShip,kind="Ring"){
        super(name,node1,node2,ship,kind);
        this.nseg;
        this.nseg=nseg;
        this.mseg=mseg;
        this.Radius=R;
        this.width=w;
        this.height=h;
        this.material=material;
        //this.material;
        // this.trussPoitRange; // index of start and end in Truss
        // this.trussStickRange; // --,,---
    }
};

class Rope extends NodeLinker {
    constructor(name,node1,node2,thick,material,     ship=defaultShip,kind="Rope" ){
        super(name,node1,node2,ship,kind);
        this.thick=thick;
        this.material=material;
    }
};

class Pipe extends ShipComponent {
    constructor(name,pipeFrom,pipeTo,maxFlow,    ship=defaultShip,kind="Pipe" ){
        super(name,ship,kind);
        this.pipeFrom;
        this.pipeTo;
        this.maxFlow;
    }
};

//class Hub : public ShipComponent { public:
//	int   npipes;      // number of pipes going to hub;
//	Pipe * pipes;      //
//}

// ==== Motors

class Plate extends ShipComponent {
    constructor(name,g1,g2,   ship=defaultShip,kind="Plate" ){
        super(name,ship,kind);
        this.girder1=g1;
        this.girder2=g2;
        this.g1span = new Vec2(0.0,1.0); 
        this.g2span = new Vec2(0.0,1.0);
        this.area=0.0;
        //Vec3d normal;
        //int ntris;
        //int * tris;  // triangles from points of spaceship
    }
};

class Radiator extends Plate{
    constructor(name,g1,g2,temperature,    ship=defaultShip,kind="Radiator" ){
        super(name,g1,g2,ship,kind);
        this.temperature=temperature;
    }
};

class Shield extends Plate{
    constructor(name,g1,g2,   ship=defaultShip,kind="Shield" ){
        super(name,g1,g2,   ship=defaultShip,kind="Shield" );
    }
};

class Collector extends Plate{
    constructor(name,g1,g2,   ship=defaultShip,kind="Collector" ){
        super(name,g1,g2,   ship=defaultShip,kind="Collector" );
    }
};

// ==== Motors

/*
class ThrusterType extends CatalogItem {
    constructor(efficiency,veMin,veMin,bExhaustFuel,fuel,propelant){
        this.efficiency=efficiency;  // how much power is used for acceleration of propelant
        this.veMin=veMin;            // minimal exhaust velocity [m/s]
        this.veMax=veMax;            // maximal exhaust velocity [m/s]
        this.bExhaustFuel=bExhaustFuel;  // if true the burned fuel is added to propellant mass
        this.fuel=fuel;          // commodity
        this.propelant=propelant;
    }
};
*/

class Thruster extends Modul {
    constructor(name,pos,rot,span, thrust,power,consumption,type,  ship=defaultShip,kind="Pipe" ){
        super(name,pos,rot,span,  ship,kind);
        if(type instanceof(String)){
            this.type = defaultThrusterTypes[type];
        }else{
            this.type = type;
        }
         //  kind will solve this ?
        this.thrust=thrust;
        this.power=power;
        this.consumption=consumption;
    }
};

class Rotor extends ShipComponent { 
    // Move ship componenets with respect to each other in inner manuevers
    constructor( name,R,power,torque,inertia,       ship=defaultShip,kind=this.constructor.name   ){
        this.Radius;
        this.power;    //  [kg.m^2]
        this.torque;   //  [kg.m^2]
        this.inertia;  //  [kg.m^2]  moment of inertia
    }
};

class Slider extends ShipComponent{
    constructor( name,R,power,torque,inertia,       ship=defaultShip,kind=this.constructor.name ){
        // allow slide a note over a girder
        this.girder;
        this.power;    //  [kg.m^2]
        this.Force;
    }
};

// === Guns

class GunType extends CatalogItem {
    constructor(){
        this.recoil;
    }
};

// Also Accelerator?

class Accelerator extends ShipComponent{
    constructor(name,     suppType,suppId,suppSpan,   PowerPeak,PulseEnergy,PulseDuration,PulsePerios,             ship=defaultShip,kind=this.constructor.name   ){
        // TODO: can be also attached to Ring ?
        //       This can be perhaps determined from type
        this.suppType=suppType; // ring or girder
        this.suppId=suppId;   // anchor girders
        this.suppSpan=suppSpan; // pos along girdes
        this.lenght;        // [m]
        this.PowerPeak=PowerPeak;     // [W]
        this.PulseEnergy=PulseEnergy;   // [J]
        this.PulseDuration=PulseDuration; // [s]
        this.PulsePerios=PulsePerios;   // [s]
    }
};

class Gun extends Accelerator{
    constructor( name,     suppType,suppId,suppSpan,   PowerPeak,PulseEnergy,PulseDuration,PulsePerios,   aperture,divergence,          ship=defaultShip,kind=this.constructor.name){
        this.type = null;
        this.aperture;      // [m^2]
        this.divergence;    // [1] tangens of angle
        // attached to girder?
        // incorporated in girder?
    }
};

class SpaceCraft {
    constructor(){
        this.LODs  = [];
        this.truss = new Truss();
        this.nodes     = [];
        this.ropes     = [];
        this.girders   = [];
        this.rings     = [];
        this.thrusters = [];
        this.guns      = [];
        this.radiators = [];
        this.shields   = [];
        this.tanks     = [];
        this.pipes     = [];
    }

    node(pos){
        let o = new Node(pos);
        o.id = this.nodes.length;
        this.nodes.push(o);
        return o;
        //return this.nodes.length - 1;
    }

    girder(nd1,nd2,up,nseg,mseg,wh,mat){
        // constructor(name, node1, node2, up, nseg, mseg, w,h, material,    ship=defaultShip,kind="Girder" ){
        let name="girder_"+this.girders.length;
        let o = new Girder( name, nd1, nd2, up, nseg, mseg, wh[0], wh[1] );
        o.id = this.girders.length;
        this.girders.push(o);
        return o;
        //return this.girders.length - 1;
    }

    rope( nd1, nd2, thick, mat ){
        let name="rope_"+this.ropes.length;
        let o = new Rope( name, nd1, nd2, thick, mat );
        o.id = this.ropes.length;
        this.ropes.push(o);
        return o;
        //return this.ropes.length - 1;
    }

    ring(){
        let o = new Ring();
        o.id = this.rings.length;
        this.rings.push(o);
        return o;
        //return this.rings.length - 1;
    }

    radiator( g1, g1span, g2, g2span, T ){
        // s.radiator( g6,0.15,0.8, g7,0.02,0.8, 1280.0 )
        let name="radiator_"+this.radiators.length;
        let o = new Radiator(name, g1, g2, T );
        o.g1span.setArr(g1span);
        o.g2span.setArr(g2span);
        o.id = this.radiators.length;
        this.radiators.push(o);
        return o;
        //return this.radiators.length - 1;
    }

    shield(){
        let o = new Shield();
        o.id = this.shields.length;
        this.shields.push(o);
        return o;
        //return this.shields.length - 1;
    }

    thruster( pos, ax, span, type ){
        // constructor(name,pos,rot,span, thrust,power,consumption,type,  ship=defaultShip,kind="Pipe" ){
        //console.log( " thruster ", pos, ax, span,  type );
        ax = THREE.toVec3(ax);
        let rot = new Mat3();
        rot.c.setv( ax );
        rot.c.getSomeOrtho( rot.a, rot.b);

        let name="thruster_"+this.thrusters.length;
        let o = new Thruster(name, pos, rot, span, 0.0, 0.0, 0.0, type );
        o.id = this.thrusters.length;
        this.thrusters.push(o);
        return o;
        //return this.thrusters.length - 1;
    }

    tank( pos, ax, span, commodity ){
        // constructor(name,pos,rot,span,comodity,      ship=defaultShip,kind="Modul"){
        // this.tank( new Vec3( Math.cos(a)*R,Math.sin(a)*R,z0 ), zvec, new Vec3( r,r,L ), "H2");
        console.log( " tank ", pos, ax, span, commodity );
        ax = THREE.toVec3(ax);
        let rot = new Mat3();
        rot.c.setv( ax );
        rot.c.getSomeOrtho( rot.a, rot.b);

        let o = new Tank( name,pos,rot,span,commodity );
        o.id = this.tanks.length;
        this.tanks.push(o);
        return o;
        //return this.tanks.length - 1;
    }

    tankRing( n, aOff, R, r, L, z0 ){
        for (let i=0; i<n; i++ ){
            let a = (i/n + aOff)*2*Math.pi 
            this.tank( new Vec3( Math.cos(a)*R,Math.sin(a)*R,z0 ), zvec, new Vec3( r,r,L ), "H2");
        }
    }

    girderFan( n, aOff, w, h, z0,z1,   nseg, thick, shielded ){
        let tipNode = new Node( new Vec3(0.0,0.0,z1) );
        let a = aOff*2*Math.pi 
        let gd0  = new Girder( tipNode, this.node( new Vec3( Math.cos(a)*w, Math.sin(a)*h, z0) ), xvec, nseg, 2, [thick,thick], "steel")
        let ogd  = gd0;
        for (let i=0; i<n; i++ ){
            let gd=gd0
            if( i<n ) {
                let a = (i/n + aOff)*2*Math.pi
                gd = new Girder( tipNode, this.node( new Vec3( Math.cos(a)*w, Math.sin(a)*h, z0) ), xvec, nseg, 2, [thick,thick],  "steel" )
            }
            if (shielded){ this.shield( ogd,0.0,1.0, gd,0.0,1.0 ) }
            ogd = gd;
        }
    }

    clear(){
        this.truss.clear();
        this.nodes     = [];
        this.ropes     = [];
        this.girders   = [];
        this.rings     = [];
        this.thrusters = [];
        this.guns      = [];
        this.radiators = [];
        this.shields   = [];
        this.tanks     = [];
        this.pipes     = [];
    }

};


defaultShip = new SpaceCraft();

var origin = [0.0,0.0,0.0];
var xvec   = [1.0,0.0,0.0];
var yvec   = [0.0,1.0,0.0];
var zvec   = [0.0,0.0,1.0];

/*
Material{ name="Kevlar", density=1.44e+3, Spull=3.6e+9, Spush=0.0, Kpull=154.0e+9, Kpush=0.0, reflectivity=0.6,  Tmelt=350 }
Material{ name="Steel" , density=7.89e+3, Spull=1.2e+9, Spush=0.0, Kpull=200.0e+9, Kpush=0.0, reflectivity=0.85, Tmelt=800 }
--Material{ name="Titanium" , density=7.89e+3, Spull=3.6e+9, Spush=0.0, Kpull=154.0e+9, Kpush=0.0, reflectivity=0.7, Tmelt=450 }

origin = {0.0,0.0,0.0}
xvec   = {1.0,0.0,0.0}
yvec   = {0.0,1.0,0.0}
zvec   = {0.0,0.0,1.0}

function tanks( n,aOff, R, r, L, z0 )
    for i=1,n do
        local a = (i/n + aOff)*2*math.pi 
        Tank( {math.cos(a)*R,math.sin(a)*R,z0}, zvec, {r,r,L}, "H2")
    end
end

function girderFan( n, aOff, w, h, z0,z1,   nseg, thick, shielded )
    local tipNode = Node({0.0,0.0,z1});
    local a = aOff*2*math.pi 
    local gd0  = Girder( tipNode, Node({math.cos(a)*w,math.sin(a)*h,z0}), xvec, nseg, 2, {thick,thick}, "steel")
    local ogd  = gd0;
    for i=1,n do
        local gd=gd0
        if i<n then
            local a = (i/n + aOff)*2*math.pi
            gd = Girder( tipNode, Node({math.cos(a)*w,math.sin(a)*h,z0}), xvec, nseg, 2, {thick,thick},  "steel" )
        end
        if shielded then Shield( ogd,0.0,1.0, gd,0.0,1.0 ) end
        ogd = gd;
    end
end
*/
