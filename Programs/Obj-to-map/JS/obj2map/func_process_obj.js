function OBJ_SplitFileContents (_file_contents) {
    return _file_contents.split("\r\n");
}

function OBJ_GetVertexArray (_file_contents_split = [], _scaleFactor, _rounding) {
    let vertexArray = [null];                                                 //<== .OBJ file uses a 1-based index, so we set the 0th value to null for convenience later
//Process allTheData (line-by-line)
    for(let i = 0; i < _file_contents_split.length; i++) {
    //If line is vertex...
        if(_file_contents_split[i].includes("v ")){
            let thisEntry = _file_contents_split[i].split(" ");
            vertexArray.push(
                new Vector3 (
                    i_ScaleAndRound(
                        parseFloat(thisEntry[1]), _scaleFactor, _rounding
                    ),
                    i_ScaleAndRound(
                        parseFloat(thisEntry[2]), _scaleFactor, _rounding
                    ),
                    i_ScaleAndRound(
                        parseFloat(thisEntry[3]), _scaleFactor, _rounding
                    )
                )
            );
        }
    }
    return vertexArray;
}

function OBJ_GetTextureVertexArray (_file_contents_split = []) {
    let textureVertexArray = [null];                                                 //<== .OBJ file uses a 1-based index, so we set the 0th value to null for convenience later
//Process allTheData (line-by-line)
    for(let i = 0; i < _file_contents_split.length; i++) {
    //If line is texture vertex...
        if(_file_contents_split[i].slice(0,3).includes("vt ")) {
            let thisEntry = _file_contents_split[i].split(" ");
            let tVert = [];                                                         //<== Texture Vertices have 2 components, and we don't have a Vector2 class yet.
            for (let i = 1; i < thisEntry.length; i++) {
                tVert.push(parsefloat(thisEntry[i]));
            }
            textureVertexArray.push(tVert);
        }
    }
    return textureVertexArray;
}

function OBJ_GetFaceArray (_file_contents_split = [], materialArray = [], _subdivide) {
/*
    Faces in .OBJ do not hold coordinate data; rather they list the indices of the vertices that were previously recorded.
*/
    let faceArray = [];
    let currentTexture = undefined;
//Process allTheData (line-by-line)
    for(let i = 0; i < _file_contents_split.length; i++) {
    //If line is face...
        if(_file_contents_split[i].includes("f ")){
            let thisEntry = _file_contents_split[i].split(" ");
        //Subdivide faces if applicable (convex only)
            if (_subdivide === true && thisEntry.length > 4) {
                for (let j = 2; j < thisEntry.length-1; j+=1) {
                    let subdividedFace_vertexIndices = [
                        thisEntry[1].split("/")[0],                                 //<== Entries may contain both a vertex and a texture vertex, formatted as "vertex/textureVertex". We only want the vertex.
                        thisEntry[j].split("/")[0],
                        thisEntry[j+1].split("/")[0]
                    ];
                    faceArray.push(new Face(subdividedFace_vertexIndices, currentTexture));
                }
            }
        //Or don't...
            else {
                let face_vertexIndices = [];
                for (let j = 1; j < thisEntry.length; j++) {
                    face_vertexIndices.push(
                        thisEntry[j].split("/")[0]
                    );
                }
                faceArray.push(new Face(face_vertexIndices, currentTexture));
            }
        }
    //if line is mtl, get texture
        else if (_file_contents_split[i].includes("usemtl ")) {
            materialName = _file_contents_split[i].slice(_file_contents_split[i].indexOf(' '));
            for(let i = 0; i < materialArray.length; i++) {
                if (materialArray[i].name === materialName) currentMaterial = materialArray[i].texture;
                break;
            }
        }
    }
    return faceArray;
}