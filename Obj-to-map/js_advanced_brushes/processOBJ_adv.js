
    const brushThickness = 8;

//
// ADVANCED PROGRAM FOR GENERATING BRUSHES IN A .MAP, NOT JUST VERTICES
//
    function ProcessOBJ_advanced(_file_contents, _scaleFactor, _rounding) {
        let allTheData = _file_contents.split("\r\n");
        let vertArray = [null];                                                 //<== .OBJ file uses a 1-based index, so we set the 0th value to null for convenience later
        let faceArray = [];
        for(let i = 0; i < allTheData.length; i++) {
        //Record vertex to vertex array
            if(allTheData[i].includes("v ")){
                let thisEntry = allTheData[i].split(" ");
                vertArray.push(
                    [
                        ScaleAndRound(
                            parseFloat(thisEntry[1]), _scaleFactor, _rounding
                        ),
                        ScaleAndRound(
                            parseFloat(thisEntry[2]), _scaleFactor, _rounding
                        ),
                        ScaleAndRound(
                            parseFloat(thisEntry[3]), _scaleFactor, _rounding
                        )
                    ]
                );
            }

        //Record face to face array
        //Faces in .OBJ do not hold coordinate data; rather they list the indices of the vertices that were previously recorded.
            if(allTheData[i].includes("f ")){
                let thisEntry = allTheData[i].split(" ");
                let face_vertIndices = [];
                for (let j = 1; j < thisEntry.length; j++) {
                    face_vertIndices.push(
                        thisEntry[j].split("/")[0]
                    );
                }
                faceArray.push(face_vertIndices);
            }
        //end for
        }


    //
    //INITIALISE OUTPUT
    //
        let output_text = "";
        const targetField = document.querySelector('#outputField');
        const worldspawn = '// entity 0 \r\n\
            { \r\n\
            "classname" "worldspawn" \r\n\
        ';
            output_text = output_text.concat(worldspawn);
        targetField.appendChild(CreateEntry(worldspawn));


    //
    //GET FACES, MAKE BRUSHES
    //
    //Don't forget, faces contain the indices for the verts in the vertArray, not the verts themselves.
        for (let f = 0; f < faceArray.length; f++) {
            const face = faceArray[f];

        /*
        *   Calculate all the verts required to define the brush
        *   We start with the original face, get a plane normal, and extend the brush relative to the unit normal.
        */

        //Front (original) face
            const brushVerts = [];
            for (let i = 0; i < face.length; i++) {
                brushVerts[i*2] = vertArray[face[i]];
            }

        //Get a plane vector with which to extend the original (2D) face into a (3D) brush entity.
            const unitNormal = 
                V3_Invert(
                    V3_SignDir(
                        V3_CrossProduct(
                            V3_GetDir(brushVerts[0],brushVerts[2]),
                            V3_GetDir(brushVerts[0],brushVerts[brushVerts.length-1])
                        )
                    )
                );
            for (let i = 0; i < unitNormal.length; i++) unitNormal[i] *= brushThickness;

        //Rear (extended) face
            for(let i = 0; i < brushVerts.length; i+=2){
                brushVerts[i+1] = V3_Sum(brushVerts[i], unitNormal);
            }

        //Write Brush
        /*Front and rear side*/
            let brush = `// brush ${f} \r\n \
                { \r\n \
                ${WriteBrushPlane(brushVerts[0], brushVerts[2], brushVerts[4])} \r\n\
                ${WriteBrushPlane(brushVerts[1], brushVerts[5], brushVerts[3])} \r\n\
            `;
        /*First set of sides*/
            for (let i = 0; i < brushVerts.length-2; i+=2) {
                brush = brush.concat(
                `   ${WriteBrushPlane(brushVerts[i],brushVerts[i+1],brushVerts[i+2])} \r\n\
                `
                );
            }
        /*Final side wraps around array*/
            brush = brush.concat(
            `   ${WriteBrushPlane(brushVerts[brushVerts.length-2],brushVerts[brushVerts.length-1],brushVerts[0])} \r\n\
                } \r\n`
            );
                    
        //FINISH (ONE FACE CONVERTED TO BRUSH, AT ANY RATE)    
            output_text = output_text.concat(brush);
            targetField.appendChild(CreateEntry(brush));
        //end for f in faceArray
        }


    //    
    // DELIVER OUTPUT
    //
        const closeWorldspawn = '} \r\n \
        ';
        output_text = output_text.concat(closeWorldspawn);
        targetField.appendChild(CreateEntry(closeWorldspawn));
        return output_text;
    //end method
    }


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

    
//Subtract the "from" coordinate from the "to" coordinate to get a direction vector. 
    function V3_GetDir(from = [], to = []){
        let result = [];
        for (let i = 0; i < 3; i++) {
            result[i] = to[i] - from[i];
        }
        return result;
    }

//Get a normal vector for two direction vectors
    function V3_CrossProduct(_dir1 = [], _dir2 = []) {
        let result = [];
        result[0] = (_dir1[1] * _dir2[2]) - (_dir1[2] * _dir2[1]);
        result[1] = (_dir1[2] * _dir2[0]) - (_dir1[0] * _dir2[2]);
        result[2] = (_dir1[0] * _dir2[1]) - (_dir1[1] * _dir2[0]);
        return result;

        //https://mathjs.org/docs/reference/functions/cross.html
    }

//Take an input vector and return a signed/normalized output, ideal for use on a square grid where the minimum resolution is 1.0.
    function V3_SignDir(_dir = []) {
        let result = [];
        let i_biggest = 0;
        for (let i = 1; i < 3; i++) {
            if (Math.abs(_dir[i]) > Math.abs(_dir[i_biggest])) i_biggest = i;
        }
        result[i_biggest] = Math.sign(_dir[i_biggest]);
    /*
    * We can raise the fidelity of the approximate vector by checking to see if the other coordinate values put the vector.
    * closer to the diagonal (e.g. 1,1,0) or the orthagonal (e.g. 0,1,0)
    * Basically, if the other coordinate values are >= half the size of the biggest, then the direction is closer to diagonal.
    */
    //SO:
        let halfBig = Math.abs(_dir[i_biggest]) / 2;
        for (let i = 0; i < 3; i++) {
            if (i == i_biggest) continue;
            if (Math.abs(_dir[i]) >= halfBig) result[i] = Math.sign(_dir[i]); 
            else result[i] = 0;
        }
        return result;
    }

//Invert a vector, for e.g. when we want the normal to go the opposite direction.
    function V3_Invert(_v3 = []) {
        let result = [];
        for (let i = 0; i < 3; i++) {
            result[i] = _v3[i] *-1;
        }
        return result;
    }

//Sum of two vertices
    function V3_Sum(a = [], b = []){
        let result = [];
        for (let i = 0; i < 3; i++) {
            result[i] = a[i] + b[i];
        }
        return result;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////

//Format for a brush plane in a .map file
/*
*   I think we need to invert the plane by swapping two of the coordinate values, due to the way QBSP processes .MAP files.
*/
    function WriteBrushPlane(_i = [], _j = [], _h = []) {
        //const textureInfo = "common/caulk 0 0 0 1 1";
        return `${WriteCoord(_i)} ${WriteCoord(_h)} ${WriteCoord(_j)} common/caulk 0 0 0 1 1`;
    }

//Take a vertex and return a .map readable string
    function WriteCoord(_vert = []) {
        return `( ${_vert[0]} ${_vert[1]} ${_vert[2]} )`;
    }
