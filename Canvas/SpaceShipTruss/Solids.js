
"use strict";

// ==== Tetrahedron

var Tetrahedron = {};
//Tetrahedron.nverts = 4;
//Tetrahedron.nedges = 6;
//Tetrahedron.ntris  = 4;
//Tetrahedron.nfaces = 4;
Tetrahedron.verts  = [ [-1.0,-1.0,-1.0], [+1.0,+1.0,-1.0], [-1.0,+1.0,+1.0], [+1.0,-1.0,+1.0] ];
Tetrahedron.edges  = [ [0,1],   [0,2],   [0,3],    [1,2],  [1,3],  [2,3] ];
Tetrahedron.tris   = [ [0,2,1], [0,1,3], [0,3,2],  [1,2,3] ];
Tetrahedron.faces  = [ [0,2,1], [0,1,3], [0,3,2],  [1,2,3] ];

// ==== Octahedron

var Octahedron = {};
//Octahedron.nverts = 6;
//Octahedron.nedges = 12;
//Octahedron.nfaces = 8;
//Octahedron.ntris  = 8;
Octahedron.verts  = [ [-1.0,0.0,0.0], [+1.0,0.0,0.0], [0.0,-1.0,0.0], [0.0,+1.0,0.0], [0.0,0.0,-1.0], [0.0,0.0,+1.0] ];
Octahedron.edges  = [ [0,2], [0,3], [0,4], [0,5],   [1,2], [1,3], [1,4], [1,5],   [2,4], [2,5], [3,4], [3,5]  ];
Octahedron.tris   = [ [0,4,2], [0,2,5], [0,3,4], [0,5,3],   [1,2,4], [1,5,2], [1,4,3], [1,3,5] ];
Octahedron.faces  = [ [0,4,2], [0,2,5], [0,3,4], [0,5,3],   [1,2,4], [1,5,2], [1,4,3], [1,3,5] ];

/*
// ==== Cube

const static int  Cube_nverts = 8;
const static int  Cube_nedges = 12;
const static int  Cube_ntris  = 12;
const static int  Cube_nfaces = 6;
static Vec3d      Cube_verts  [Cube_nverts] = {
    {-1.0d,-1.0d,-1.0d},
    {-1.0d,-1.0d,+1.0d},
    {-1.0d,+1.0d,-1.0d},
    {-1.0d,+1.0d,+1.0d},
    {+1.0d,-1.0d,-1.0d},
    {+1.0d,-1.0d,+1.0d},
    {+1.0d,+1.0d,-1.0d},
    {+1.0d,+1.0d,+1.0d},
};
static Vec2i   Cube_edges [Cube_nedges  ] = { 0,1, 0,2, 0,4,  1,3,1,5, 2,3, 2,6,    7,5, 7,6, 7,3,  5,4, 6,4    };
static Vec3i   Cube_tris  [Cube_ntris   ] = { 0,1,3, 0,3,2,  0,4,5, 0,5,1,  0,2,6, 0,6,4,  7,5,4,  7,4,6,  7,3,1,   7,1,5,  7,6,2,  7,2,3  };
static int     Cube_ngons [Cube_nfaces  ] = { 4,        4,          4,         4,         4,         4        };
static int     Cube_faces [Cube_nfaces*4] = { 0,1,3,2,  0,4,5,1,    0,2,6,4,   7,5,4,6,   7,3,1,5,   7,6,2,3  };

const static CMesh Cube = (CMesh){Cube_nverts,Cube_nedges,Cube_ntris,Cube_nfaces, Cube_verts, Cube_edges, Cube_tris, Cube_ngons, Cube_faces};


// ==== RhombicDodecahedron

const static int  RhombicDodecahedron_nverts = 14;
const static int  RhombicDodecahedron_nedges = 24;
const static int  RhombicDodecahedron_ntris  = 24;
const static int  RhombicDodecahedron_nfaces = 12;
static Vec3d      RhombicDodecahedron_verts [RhombicDodecahedron_nverts] = {
    {-1.0d,-1.0d,-1.0d},
    {-1.0d,-1.0d,+1.0d},
    {-1.0d,+1.0d,-1.0d},
    {-1.0d,+1.0d,+1.0d},
    {+1.0d,-1.0d,-1.0d},
    {+1.0d,-1.0d,+1.0d},
    {+1.0d,+1.0d,-1.0d},
    {+1.0d,+1.0d,+1.0d},

    {-2.0d,0.0d,0.0d},
    {+2.0d,0.0d,0.0d},
    {0.0d,-2.0d,0.0d},
    {0.0d,+2.0d,0.0d},
    {0.0d,0.0d,-2.0d},
    {0.0d,0.0d,+2.0d}
};
static Vec2i   RhombicDodecahedron_edges [RhombicDodecahedron_nedges  ] = { 0,8, 0,10, 0,12,   1,8, 1,10, 1,13,   2,8, 2,11, 2,12,  3,8, 3,11, 3,13,  4,9, 4,10, 4,12,  5,9, 5,10, 5,13,  6,9, 6,11, 6,12,   7,9, 7,11, 7,13   };
static Vec3i   RhombicDodecahedron_tris  [RhombicDodecahedron_nedges  ] = { 0,10,1, 0,1,8,   0,8,2, 0,2,12,   0,12,4, 0,4,10,    7,11,3, 7,3,13,   7,9,6, 7,6,11,   7,13,5, 7,5,9,   1,13,3, 1,3,8,  1,10,5, 1,5,13,   4,9,5, 4,5,10,  4,12,6, 4,6,9,  2,8,3, 2,3,11,  2,11,6, 2,6,12 };
static int     RhombicDodecahedron_ngons [RhombicDodecahedron_nfaces  ] = { 4,4,4,4,  4,4,4,4,    4,4,4,4  };
static int     RhombicDodecahedron_faces [RhombicDodecahedron_nfaces*4] = { 0,10,1,8,  0,8,2,12,    0,12,4,10,   7,11,3,13,   7,9,6,11,   7,13,5,9,   1,13,3,8,  1,10,5,13,   4,9,5,10,  4,12,6,9,  2,8,3,11,  2,11,6,12    };

const static CMesh RhombicDodecahedron = (CMesh){RhombicDodecahedron_nverts,RhombicDodecahedron_nedges,RhombicDodecahedron_ntris,RhombicDodecahedron_nfaces, RhombicDodecahedron_verts, RhombicDodecahedron_edges, RhombicDodecahedron_tris, RhombicDodecahedron_ngons,RhombicDodecahedron_faces};


// ==== Icosahedron

const static int  Icosahedron_nverts = 12;
const static int  Icosahedron_nedges = 30;
const static int  Icosahedron_ntris  = 20;
const static int  Icosahedron_nfaces = 20;
const double a = 1.0d;
const double b = GOLDEN_RATIO;
static Vec3d      Icosahedron_verts [RhombicDodecahedron_nverts] = {
    {0.0d,-a,-b}, // 0
    {0.0d,-a,+b}, // 1
    {0.0d,+a,-b}, // 2
    {0.0d,+a,+b}, // 3
    {-a,-b,0.0d}, // 4
    {-a,+b,0.0d}, // 5
    {+a,-b,0.0d}, // 6
    {+a,+b,0.0d}, // 7
    {-b,0.0d,-a}, // 8
    {+b,0.0d,-a}, // 9
    {-b,0.0d,+a}, // 10
    {+b,0.0d,+a}, // 11
};
static Vec2i     Icosahedron_edges [Icosahedron_nedges] = {
    0,2,  0,8,  0,4, 0,6,  0,9,
    3,1,  3,10, 3,5, 3,7,  3,11,
    2,8,  8,4,  4,6, 6,9,  9,2,
    1,10, 10,5, 5,7, 7,11, 11,1,
    1,4,  10,8, 5,2, 7,9,  11,6,
    1,6,  10,4, 5,8, 7,2,  11,9
};
static Vec3i     Icosahedron_tris [Icosahedron_ntris] = {
    0,8,2,   0,4,8,   0,6,4,  0,9,6,   0,2,9,
    3,10,1,  3,5,10,  3,7,5,  3,11,7,  3,1,11,
    4,1,10,  8,10,5,  2,5,7,  9,7,11,  6,11,1,
    1,4,6,   10,8,4,  5,2,8,  7,9,2,   11,6,9
};
static int     Icosahedron_ngons [Icosahedron_nfaces  ] = { 3,3,3,3,3,  3,3,3,3,3,    3,3,3,3,3,    3,3,3,3,3  };
static int     Icosahedron_faces [Icosahedron_nfaces*3] = {
    0,8,2,   0,4,8,   0,6,4,  0,9,6,   0,2,9,
    3,10,1,  3,5,10,  3,7,5,  3,11,7,  3,1,11,
    4,1,10,  8,10,5,  2,5,7,  9,7,11,  6,11,1,
    1,4,6,   10,8,4,  5,2,8,  7,9,2,   11,6,9
};
*/


