//https://en.wikipedia.org/wiki/Wavefront_.obj_file
//https://quakewiki.org/wiki/Quake_Map_Format

    const inp_obj_scaleFactor = document.querySelector('#inp_obj_scaleFactor');
    const inp_obj_rounding = document.querySelector('#inp_obj_rounding');
    const inp_obj_brushThickness = document.querySelector('#inp_obj_brushThickness');
    const inp_obj_subdivide = document.querySelector('#inp_obj_subdivide');
    const inp_obj_invertNormals = document.querySelector('#inp_obj_invertNormals');
    const inp_obj_reverseOrder = document.querySelector('#inp_obj_reverseOrder');

//
// CHOOSE INPUT FILE
//
    const inp_obj_fileSelect_obj = document.querySelector('#inp_obj_fileSelect_obj');
    const inp_obj_fileSelect_mtl = document.querySelector('#inp_obj_fileSelect_mtl');
    const btn_obj_processFile = document.querySelector('#btn_obj_processFile');
    const btn_obj_downloadFile = document.querySelector('#btn_obj_downloadFile');
    let objFile_contents;
    let mtlFile_contents;
    let objFile_type;
    let objFile_name;
//"Upload" .obj file - listener
    inp_obj_fileSelect_obj.addEventListener('change', ()=>{
        const file = inp_obj_fileSelect_obj.files[0];
        return new Promise ((resolve, reject)=>{
            const reader = new FileReader();
            reader.readAsText(file);
        //Do stuff
            reader.onload = ()=> {
                objFile_contents = reader.result;
                const filename_parts = file.name.split('.');
                objFile_type = '.'+filename_parts[filename_parts.length-1].toLowerCase();
                objFile_name = filename_parts[0];
                btn_obj_processFile.setAttribute('style', "display: block;");
            //Resolve
                resolve(reader.result);
            }
        });
    });
//"Upload" .mtl file - listener
    inp_obj_fileSelect_mtl.addEventListener('change', ()=>{
        const file = inp_obj_fileSelect_mtl.files[0];
        return new Promise ((resolve, reject)=>{
            const reader = new FileReader();
            reader.readAsText(file);
        //Do stuff
            reader.onload = ()=> {
                mtlFile_contents = reader.result;
            //Resolve
                resolve(reader.result);
            }
        });
    });

//
// PROCESS FILE
//
btn_obj_processFile.addEventListener('click', ()=>{
    ProcessFile_Obj();
});

function ProcessFile_Obj() {
    let file_contents_split = [];
    let materialArray = [];

    let vertexArray = [];
    //let textureVertexArray = [];
    let faceArray = [];

    let output_mapFile = "";
    const targetField = document.querySelector('#outputField');
    targetField.innerHTML = "";

    switch (objFile_type) {
        case ".obj":
            file_contents_split = OBJ_SplitFileContents(objFile_contents);
            //materialArray = MTL_GetMaterialArray(mtlFile_contents);

            vertexArray = OBJ_GetVertexArray(file_contents_split, inp_obj_scaleFactor.value, inp_obj_rounding.value);
            //textureVertexArray = OBJ_GetTextureVertexArray (file_contents_split);
            faceArray = OBJ_GetFaceArray(file_contents_split, materialArray, inp_obj_subdivide.checked);

            output_mapFile = Output_mapFile_brushes(vertexArray, faceArray, inp_obj_brushThickness.value, inp_obj_invertNormals.checked, inp_obj_reverseOrder.checked);
            targetField.appendChild(CreateEntry(output_mapFile));
            SetDownload_Obj2Map(output_mapFile);

            break;
        case ".3do":
            file_contents_split = ThreeDO_SplitFileContents(objFile_contents);

            vertexArray = ThreeDO_GetVertexArray(file_contents_split, inp_obj_scaleFactor.value, inp_obj_rounding.value)
            //textureVertexArray = ThreeDO_GetTextureVertexArray (file_contents_split);
            faceArray = ThreeDO_GetFaceArray(file_contents_split, inp_obj_subdivide.checked);

            output_mapFile = Output_mapFile_brushes(vertexArray, faceArray, inp_obj_brushThickness.value, inp_obj_invertNormals.checked, inp_obj_reverseOrder.checked);
            targetField.appendChild(CreateEntry(output_mapFile));
            SetDownload_Obj2Map(output_mapFile);

            break;
    }
    return;
}

function SetDownload_Obj2Map(_output_mapFile) {
    btn_obj_downloadFile.setAttribute('style', "display: inline-block;");
    btn_obj_downloadFile.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(_output_mapFile));
    btn_obj_downloadFile.setAttribute('download', `output_${file.name.split('.')[0]}.map`);
}