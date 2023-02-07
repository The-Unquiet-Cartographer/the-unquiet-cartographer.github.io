function Output_mapFile_brushes (_vertArray, _faceArray, _brushThickness, _invertNormals, _reverseOrder, _fileName) {
    //
    //INITIALISE OUTPUT
    //
    let output_text = "";
    const worldspawn = '// entity 0 \r\n\
        { \r\n\
        "classname" "worldspawn" \r\n\
        ';
        output_text = output_text.concat(worldspawn);

//
//GET FACES, MAKE BRUSHES
//
/*
    *   Don't forget, faces contain the indices for the verts in the vertArray, not the verts themselves.
    *   To define a brush, we start with the original face vertices, calculate a plane normal, and extend the brush relative to that normal.
*/
    for (let f = 0; f < _faceArray.length; f++) {
        let face_vertInds;
        if (_reverseOrder === true) face_vertInds = _faceArray[f].vertexArray.reverse();
        else face_vertInds = _faceArray[f].vertexArray;
        let face_texture;
        if (_faceArray[f].texture == undefined) face_texture = "common/caulk";
        else face_texture = `${_fileName}/${_faceArray[f].texture}`;

    //
    //DEFINE BRUSH VERTICES
    //
    //Define vertices for front (original) face
        const brushVerts = [];
        for (let i = 0; i < face_vertInds.length; i++) {
            brushVerts[i*2] = _vertArray[face_vertInds[i]];
        }
    //Get a normal vector with which to extend the original (2D) face into a (3D) brush entity.
        let unitNormal = Vector3.CrossProduct(
            Vector3.GetDirection(brushVerts[0],brushVerts[2]),
            Vector3.GetDirection(brushVerts[0],brushVerts[brushVerts.length-1])
        ).Sign(3);
        if (_invertNormals === true) unitNormal = unitNormal.Invert();
    //Define vertices for rear (extended) face
        unitNormal = Vector3.Scale1(unitNormal, _brushThickness);
        for(let i = 0; i < brushVerts.length; i+=2){
            brushVerts[i+1] = Vector3.Add(brushVerts[i], unitNormal);
        }

    //
    //WRITE BRUSH FACES
    //
    //Front and rear
        let brush = `// brush ${f} \r\n \
            { \r\n \
            ${WriteBrushPlane(brushVerts[0], brushVerts[2], brushVerts[4]), `${face_texture} 0 0 0 1 1`} \r\n\
            ${WriteBrushPlane(brushVerts[1], brushVerts[5], brushVerts[3])} \r\n\
        `;
    //All sides except last
        for (let i = 0; i < brushVerts.length-2; i+=2) {
            brush = brush.concat(
            `   ${WriteBrushPlane(brushVerts[i],brushVerts[i+1],brushVerts[i+2])} \r\n\
            `
            );
        }
    //Final side (wraps around array)
        brush = brush.concat(
        `   ${WriteBrushPlane(brushVerts[brushVerts.length-2],brushVerts[brushVerts.length-1],brushVerts[0])} \r\n\
            } \r\n`
        );

    //
    //FINISH (APPEND BRUSH TO OUTPUT TEXT)
    //
        output_text = output_text.concat(brush);
    
    //end for f in _faceArray
    }

//    
// DELIVER OUTPUT
//
    const closeWorldspawn = '} \r\n \
    ';
    output_text = output_text.concat(closeWorldspawn);
    return output_text;
//end method
}


//////////////////////////////////////////////////


function Output_mapFile_verticesOnly (_vertArray) {
    _vertArray = SortV3Array(_vertArray);
    let output_text = "";
    const worldspawn = '// entity 0 \r\n \
        { \r\n \
        "classname" "worldspawn" \r\n \
        } \r\n \
        ';
        output_text = output_text.concat(worldspawn);

    for (let i = 0; i < vertexArray.length; i++) {
        const info_null = `// entity ${i+1} \r\n \
            { \r\n \
            "origin" "${vertexArray[i].x} ${vertexArray[i].y} ${vertexArray[i].z}" \r\n \
            "classname" "info_null" \r\n \
            } \r\n \
            `;
        output_text = output_text.concat(info_null);
    }
    return output_text;
}


////////////////////////////////////////////////////////////////////////////////////////////////////


//Format for a brush plane in a .map file
/*
*   I think we need to invert the plane by swapping two of the coordinate values, due to the way QBSP processes .MAP files.
*/
function WriteBrushPlane(_vector3_h, _vector3_i, _vector3_j, textureInfo = "common/caulk 0 0 0 1 1") {
    return `${WriteCoord(_vector3_i)} ${WriteCoord(_vector3_h)} ${WriteCoord(_vector3_j)} ${textureInfo}`;
}

//Take a vertex and return a .map readable string
function WriteCoord(_vector3) {
    return `( ${_vector3.x} ${_vector3.y} ${_vector3.z} )`;
}