//https://en.wikipedia.org/wiki/Wavefront_.obj_file
//https://quakewiki.org/wiki/Quake_Map_Format


//INPUT FIELDS
    const inp_obj_scaleFactor = document.querySelector('#inp_obj_scaleFactor');
    const inp_obj_rounding = document.querySelector('#inp_obj_rounding');
    const inp_obj_brushThickness = document.querySelector('#inp_obj_brushThickness');
    const inp_obj_subdivide = document.querySelector('#inp_obj_subdivide');
    const inp_obj_invertNormals = document.querySelector('#inp_obj_invertNormals');
    const inp_obj_reverseOrder = document.querySelector('#inp_obj_reverseOrder');
    const inp_obj_flipYZ = document.querySelector('#inp_obj_flipYZ');

//SELECT FILE(S)
    const inp_obj_fileSelect_obj = document.querySelector('#inp_obj_fileSelect_obj');
    const inp_obj_fileSelect_mtl = document.querySelector('#inp_obj_fileSelect_mtl');

//PROCESS & DOWNLOAD
    const btn_obj_processFile = document.querySelector('#btn_obj_processFile');
    const btn_obj_downloadFile = document.querySelector('#btn_obj_downloadFile');

////////////////////////////////////////////////////////////////////////////////////////////////////

//MARATHON FIX?
    const inp_obj_marathonFix = document.querySelector('#inp_obj_marathonFix');

    function Marathon_FaceIsCeiling (thisFace, prevFace) {
        if (thisFace.vertexArray.length != prevFace.vertexArray.length) return false;
        for (let i = 0; i < thisFace.vertexArray.length; i++) {
            if (
                thisFace.vertexArray[i].x == prevFace.vertexArray[i].x
                && thisFace.vertexArray[i].z == prevFace.vertexArray[i].z
                && thisFace.vertexArray[i].y > prevFace.vertexArray[i].y
            ) continue;
            else return false;
        }
        console.log("Found ceiling");
        return true;
    }

    function Marathon_InvertFace (thisFace) {
        let verts = [];
        for (let i = thisFace.vertexArray.length-1; i > -1; i--) {
            verts.push(new Vector3(thisFace.vertexArray[i].x, thisFace.vertexArray[i].y, thisFace.vertexArray[i].z));
        }
        return new Face (verts, thisFace.texture);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////

// CHOOSE INPUT FILE
    let objFile_contents;
    let objFile_name;
    let objFile_type;
    let mtlFile_contents;

//"Upload" .obj file - listener
    inp_obj_fileSelect_obj.addEventListener('change', ()=>{
        const file = inp_obj_fileSelect_obj.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = ()=> {
            objFile_contents = reader.result;
            const filename_parts = file.name.split('.');
            objFile_name = filename_parts[0];
            objFile_type = '.'+filename_parts[filename_parts.length-1].toLowerCase();
            btn_obj_processFile.setAttribute('style', "display: block;");
        }
    });
//"Upload" .mtl file - listener
    inp_obj_fileSelect_mtl.addEventListener('change', ()=>{
        const file = inp_obj_fileSelect_mtl.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = ()=> {
            mtlFile_contents = reader.result;
        }
    });

////////////////////////////////////////////////////////////////////////////////////////////////////

// PROCESS FILE(S)
    btn_obj_processFile.addEventListener('click', ()=>{
        const vertexArray = [];
        //const textureVertexArray = [];
        const faceArray = [];
        if (mtlFile_contents == undefined) mtlFile_contents = "";

        switch (objFile_type) {
        //FILETYPE: OBJ
            case ".obj":
            //Mtl
                const mtlArray = mtlFile_contents.split("newmtl ");
                for (let i = 0; i < mtlArray.length; i++) mtlArray[i] = new Material("newmtl ".concat(mtlArray[i]));

            //Obj
                const objFile_split = objFile_contents.split("\r\n");

            //Obj data, line-by line
                vertexArray.push(null);                                     //.OBJ file uses a 1-based index, so we set the 0th vertex to null for convenience.
                //textureVertexArray.push(null);                            //.OBJ file uses a 1-based index, so we set the 0th texture vertex to null for convenience.
                function f_v (f_) {return f_.split('/')[0]}                 //Face data may contain a reference to a vertex AND a texture vertex data, formatted as "vertex/textureVertex". This will get only the vertex.
                //function f_vt (f_) {return f_.split('/')[1]}              //Face data may contain a reference to a vertex AND a texture vertex data, formatted as "vertex/textureVertex". This will get only the texture vertex.
                let _currentMaterial;

                for (let i = 0; i < objFile_split.length; i++) {
                    let thisLine = objFile_split[i].split(' ');
                    switch(thisLine[0]) {
                    //Vertices
                        case "v":
                            let vert = new Vector3
                                (parseFloat(thisLine[1]), parseFloat(thisLine[2]), parseFloat(thisLine[3]))
                                .Scale1(inp_obj_scaleFactor.value)
                                .Round(inp_obj_rounding.value)
                            ;
                            if (inp_obj_flipYZ.checked) {
                                vert = new Vector3(vert.x, -vert.z, vert.y);
                            }
                            vertexArray.push(vert);
                            break;
                    //Texture Vertices
                        /*case "vt":
                            textureVertexArray.push( new Vector2(parseFloat(thisLine[1]), parseFloat(thisLine[2])) );
                            break;*/
                    //Faces
                        case "f":
                        //Subdivide faces. Only convex faces may be subdivided.
                            if (inp_obj_subdivide.checked && thisLine.length > 4)
                            {   
                                for (let j = 1; j < thisLine.length-2; j++) {
                                    faceArray.push(new Face(
                                        [f_v(thisLine[1]), f_v(thisLine[1+j]), f_v(thisLine[1+j+1])],
                                        _currentMaterial == undefined ? undefined : mtlArray[_currentMaterial].texture
                                    ));
                                }
                            }
                        //Or don't subdivide, I guess.
                            else {
                                const faceVerts = [];
                                for (let j = 1; j < thisLine.length; j++) faceVerts.push(f_v(thisLine[j]));
                                faceArray.push(new Face(
                                    faceVerts,
                                    _currentMaterial == undefined ? undefined : mtlArray[_currentMaterial].texture
                                ));
                            }

                        //Marathon fix?
                            if (inp_obj_marathonFix.checked === true) {
                                if (Marathon_FaceIsCeiling(faceArray[faceArray.length-1], faceArray[faceArray.length-2])) {
                                    faceArray[faceArray.length-1] = Marathon_InvertFace(faceArray[faceArray.length-1]);
                                }
                            }
                            break;
                    //Using material
                        case "usemtl":
                            for (let j = 0; j < mtlArray.length; j++) {
                                if (mtlArray[j].name === thisLine[1]) {_currentMaterial = j; break;}
                            }
                            break;
                        //end switch obj data
                    }
                }
                break;
            //end case .obj

        //FILETYPE: 3DO
            case ".3do":
                fileContents = ThreeDO_SplitFileContents(objFile_contents);

                vertexArray = ThreeDO_GetVertexArray(fileContents, inp_obj_scaleFactor.value, inp_obj_rounding.value)
                //textureVertexArray = ThreeDO_GetTextureVertexArray (fileContents);
                faceArray = ThreeDO_GetFaceArray(fileContents, inp_obj_subdivide.checked);
                break;
            //end case .3do
            //end switch filetype
        }

    //ALLOW DOWNLOAD OUTPUT
        const output_mapFile = Output_mapFile_brushes(vertexArray, faceArray, inp_obj_brushThickness.value, inp_obj_invertNormals.checked, inp_obj_reverseOrder.checked, objFile_name);
        const targetField = document.querySelector('#outputField');
        targetField.innerHTML = "";
        targetField.appendChild(CreateEntry(output_mapFile));
        SetDownload_Obj2Map(output_mapFile);

        return;
    });

function SetDownload_Obj2Map(_output_mapFile) {
    btn_obj_downloadFile.setAttribute('style', "display: inline-block;");
    btn_obj_downloadFile.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(_output_mapFile));
    btn_obj_downloadFile.setAttribute('download', `output_${objFile_name}.map`);
}
