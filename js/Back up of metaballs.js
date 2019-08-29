/**
 * Created by James on 5/4/2015.
 */
function makeSphere(vector) {
    //creates sphere
    var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    var sphereGeometry = new THREE.SphereGeometry(3, 40, 40);
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // adds sprite
    var glowSpriteMaterial = new THREE.SpriteMaterial(
        {
            map: new THREE.ImageUtils.loadTexture("media/glow4.png"),
            useScreenCoordinates: false,
            color: 0xFFFFFF, transparent: true, blending: THREE.AdditiveBlending
        });
    var glowSprite = new THREE.Sprite(glowSpriteMaterial);
    glowSprite.material.color.set(0xCCCCDD);
    glowSprite.scale.set(9, 9, 0.1);

    return sphere;
}
var sphere1Vector =new THREE.Vector3(0,0,5);
var sphere1 = makeSphere(sphere1Vector);
scene.add(sphere1);


/**
 //extablishes axisis
 var axisMin = -15;
 var axisMax = 15;
 var axisRange = axisMax - axisMin;
 scene.add(new THREE.AxisHelper(axisMax));

 var size = 75;
 var size3 = size * size * size;
 var points = [];
 for (var k = 0; k < size; k++)
 for (var j = 0; j < size; j++)
 for (var h= 0; h < size; h++)
 {
     var x = axisMin + axisRange * h/ (size - 1);
     var y = axisMin + axisRange * j / (size - 1);
     var z = axisMin + axisRange * k / (size - 1);
     points.push(new THREE.Vector3(x,y,z));
 }

 var values =[];
 for (var o = 0; o < size3; o++)
 values[o]=0;


 function addBall(points, values, center){
    for (var i = 0; i < values.length; i++){
        var oneMinusD2 = 1.0 - center.distanceToSquared(points[i]);
        values[i] += Math.exp(-(oneMinusD2 * oneMinusD2));
    }
}

 //// EDGE GLOW GOES HERE/////
 var ballV1 =new THREE.Vector3(0,0,5);
 var ballV2 = new THREE.Vector3(5,0,5);
 var ballV3 = new THREE.Vector3(-5,0,5);
 addBall( points, values, ballV1);
 addBall( points, values,ballV2);
 addBall( points, values,ballV3);
 edgeGlow(ballV1);
 edgeGlow(ballV2);
 edgeGlow(ballV3);


 function marchingCubes(points,values,isolevel){
    var size = Math.round(Math.pow(values.length, 1/3));
    var size2 = size * size;
    var vlist = new Array(12);
    var geometry = new THREE.Geometry();
    var vertexIndex = 0;
    for (var z = 0; z < size -1; z++)
    for (var y = 0; y < size -1; y++)
    for (var x = 0; x < size - 1; x++)
    {
        var p = x +size * y + size2 * z,
            px = p + 1,
            py = p + size,
            pxy = py + 1,
            pz   = p   + size2,
            pxz  = px  + size2,
            pyz  = py  + size2,
            pxyz = pxy + size2;

        var value0 = values[ p    ],
            value1 = values[ px   ],
            value2 = values[ py   ],
            value3 = values[ pxy  ],
            value4 = values[ pz   ],
            value5 = values[ pxz  ],
            value6 = values[ pyz  ],
            value7 = values[ pxyz ];

        var cubeindex = 0;
        if ( value0 < isolevel ) cubeindex |= 1;
        if ( value1 < isolevel ) cubeindex |= 2;
        if ( value2 < isolevel ) cubeindex |= 8;
        if ( value3 < isolevel ) cubeindex |= 4;
        if ( value4 < isolevel ) cubeindex |= 16;
        if ( value5 < isolevel ) cubeindex |= 32;
        if ( value6 < isolevel ) cubeindex |= 128;
        if ( value7 < isolevel ) cubeindex |= 64;


        var bits = THREE.edgeTable[cubeindex];

        if(bits === 0)continue;
        var mu = 0.5;
        if ( bits & 1 )
        {
            mu = ( isolevel - value0 ) / ( value1 - value0 );
            vlist[0] = points[p].clone().lerp( points[px], mu );
        }
        if ( bits & 2 )
        {
            mu = ( isolevel - value1 ) / ( value3 - value1 );
            vlist[1] = points[px].clone().lerp( points[pxy], mu );
        }
        if ( bits & 4 )
        {
            mu = ( isolevel - value2 ) / ( value3 - value2 );
            vlist[2] = points[py].clone().lerp( points[pxy], mu );
        }
        if ( bits & 8 )
        {
            mu = ( isolevel - value0 ) / ( value2 - value0 );
            vlist[3] = points[p].clone().lerp( points[py], mu );
        }
        // top of the cube
        if ( bits & 16 )
        {
            mu = ( isolevel - value4 ) / ( value5 - value4 );
            vlist[4] = points[pz].clone().lerp( points[pxz], mu );
        }
        if ( bits & 32 )
        {
            mu = ( isolevel - value5 ) / ( value7 - value5 );
            vlist[5] = points[pxz].clone().lerp( points[pxyz], mu );
        }
        if ( bits& 64 )
        {
            mu = ( isolevel - value6 ) / ( value7 - value6 );
            vlist[6] = points[pyz].clone().lerp( points[pxyz], mu );
        }
        if ( bits & 128 )
        {
            mu = ( isolevel - value4 ) / ( value6 - value4 );
            vlist[7] = points[pz].clone().lerp( points[pyz], mu );
        }
        // vertical lines of the cube
        if ( bits & 256 )
        {
            mu = ( isolevel - value0 ) / ( value4 - value0 );
            vlist[8] = points[p].clone().lerp( points[pz], mu );
        }
        if ( bits &  512 )
        {
            mu = ( isolevel - value1 ) / ( value5 - value1 );
            vlist[9] = points[px].clone().lerp( points[pxz], mu );
        }
        if ( bits & 1024 )
        {
            mu = ( isolevel - value3 ) / ( value7 - value3 );
            vlist[10] = points[pxy].clone().lerp( points[pxyz], mu );
        }
        if ( bits & 2048 )
        {
            mu = ( isolevel - value2 ) / ( value6 - value2 );
            vlist[11] = points[py].clone().lerp( points[pyz], mu );
        }
        var i = 0;
        cubeindex <<= 4;
        while ( THREE.triTable[ cubeindex + i ] != -1 )
        {
            var index1 = THREE.triTable[cubeindex + i];
            var index2 = THREE.triTable[cubeindex + i + 1];
            var index3 = THREE.triTable[cubeindex + i + 2];

            geometry.vertices.push( vlist[index1].clone() );
            geometry.vertices.push( vlist[index2].clone() );
            geometry.vertices.push( vlist[index3].clone() );
            var face = new THREE.Face3(vertexIndex, vertexIndex+1, vertexIndex+2);
            geometry.faces.push( face );

            geometry.faceVertexUvs[ 0 ].push( [ new THREE.Vector2(0,0), new THREE.Vector2(0,1), new THREE.Vector2(1,1) ] );

            vertexIndex += 3;
            i += 3;
        }
        geometry.mergeVertices();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        return geometry;
    }
}
 */

function edgeGlow(vector) {
    var glowSpriteMaterial = new THREE.SpriteMaterial(
        {
            map: new THREE.ImageUtils.loadTexture("media/glow4.png"),
            useScreenCoordinates: false,
            color: 0xFFFFFF, transparent: true, blending: THREE.AdditiveBlending
        });
    var glowSprite = new THREE.Sprite(glowSpriteMaterial);
    glowSprite.material.color.set(0xCCCCDD);
    glowSprite.scale.set(9, 9, 0.1);
    glowSprite.position.copy(vector);
    scene.add(glowSprite); // this centers the glow at the mesh
}


scene.add(sphere);

function makeSphere() {

    // var sphereGeometry = new THREE.SphereGeometry(300, 40, 40);
    //var wireframeMaterial = new THREE.MeshBasicMaterial({color:0x000000,wireframe:true ,transparent:true});

    //var multiMaterial = [wireframeMaterial, sphereMaterial];
    // sphere.position.z = 1000;
//Sphere glow
// use sprite because it appears the same from all angles

    var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    var sphereGeometry = new THREE.SphereGeometry(3, 40, 40);

    return new THREE.Mesh(sphereGeometry, sphereMaterial);
}
