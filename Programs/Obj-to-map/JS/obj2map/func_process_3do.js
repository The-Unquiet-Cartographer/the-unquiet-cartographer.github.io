function ThreeDO_SplitFileContents (_file_contents) {
    return _file_contents.split("\r\n");
}

function ThreeDO_GetVertexArray (_file_contents_split = [], _scaleFactor, _rounding) {
    let subsection_vertices = ThreeDO_GetSubSection (_file_contents_split, "VERTICES");
    let vertexArray = [];
//Process sub-section...
    for (let i = 0; i < subsection_vertices.length; i++) {
        let thisEntry = subsection_vertices[i].split(" ");
        vertexArray.push(
            new Vector3 (
                i_ScaleAndRound(
                    parseFloat(f_MakeParsable(thisEntry[1])), _scaleFactor, _rounding
                ),
                i_ScaleAndRound(
                    parseFloat(f_MakeParsable(thisEntry[2])), _scaleFactor, _rounding
                ),
                i_ScaleAndRound(
                    parseFloat(f_MakeParsable(thisEntry[3])), _scaleFactor, _rounding
                )
            )
        );
    }
    return vertexArray;
}

function ThreeDO_GetTextureVertexArray (_file_contents_split = []) {
    let subsection_textureVertices = ThreeDO_GetSubSection (_file_contents_split, "TEXTURE VERTICES");
    let textureVertexArray = [];
//Process sub-section...
    for(let i = 0; i < subsection_textureVertices.length; i++) {
        let thisEntry = subsection_textureVertices[i].split(" ");
        let tVert = [];                                                             //<== For JK/MOTS at least, Texture Vertices have 2 components. Need a Vector2 class. Or just leave it because we're not doing anything with texture vertices for the time being.
        for (let j = 1; j < thisEntry.length; j++) {
            tVert.push(parsefloat(f_MakeParsable(thisEntry[j])));
        }
        textureVertexArray.push(tVert);
    }
    return textureVertexArray;
}

function ThreeDO_GetFaceArray (_file_contents_split = [], _subdivide) {
    let subsection_faces = ThreeDO_GetSubSection (_file_contents_split, "FACES");
    let faceArray = [];
    for (let i = 0; i < subsection_faces.length; i++) {
        let thisEntry = subsection_faces[i].split(" ");
    //Subdivide faces (convex only)
        if (_subdivide === true) {
            for (let j = 10; j < thisEntry.length-2; j+=2) {
                let subdividedFace_vertexIndices = [
                    ThreeDO_f_trimEnd(thisEntry[8]),                                 //<== Entries may contain both a vertex and a texture vertex, formatted as "vertex, textureVertex". We only want the vertex.
                    ThreeDO_f_trimEnd(thisEntry[j]),
                    ThreeDO_f_trimEnd(thisEntry[j+2])
                ];
                faceArray.push(new Face(subdividedFace_vertexIndices));
            }
        }
    //Or don't...
        else {
            let face_vertexIndices = [];
            for (let j = 8; j < thisEntry.length; j+=2) {
                face_vertexIndices.push(
                    ThreeDO_f_trimEnd(thisEntry[j])
                );
            }
            faceArray.push(new Face(face_vertexIndices));
        }
    }
    return faceArray;
}
function ThreeDO_f_trimEnd (string) {
    if (string[string.length-1] === ",") string = string.substring(0,string.length-1);
    return string;
}

//////////////////////////////////////////////////

function ThreeDO_GetSubSection (_data = [], sectionHeader) {
    let first = _data.findIndex(element => element.includes(sectionHeader)) +1;
    let subsection = [];
    for (let i = first; i < _data.length; i++) {
        let trimmedData = _data[i].trim();
        if (trimmedData.length === 0) continue;
        let firstChar = trimmedData[0];
    //Check for digit
        if (/^\d$/.test(firstChar)) {
            subsection.push(trimmedData);
            continue;
        }
    //Check for letter
        if (/^\D$/.test(firstChar)) {
            break;
        }
    }
    return subsection;
}