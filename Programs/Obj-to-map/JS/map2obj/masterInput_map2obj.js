//https://en.wikipedia.org/wiki/Wavefront_.obj_file
//https://quakewiki.org/wiki/Quake_Map_Format

const inp_map_scaleFactor = document.querySelector('#inp_map_scaleFactor');
const inp_map_rounding = document.querySelector('#inp_map_rounding');
const inp_map_flipYZ = document.querySelector('#inp_map_flipYZ');
const inp_map_skipTextures = document.querySelector('#inp_map_skipTextures');

//
// CHOOSE INPUT FILE
//
const inp_map_fileSelect = document.querySelector('#inp_map_fileSelect');
const btn_map_processFile = document.querySelector('#btn_map_processFile');
const btn_map_downloadFile = document.querySelector('#btn_map_downloadFile');
let mapFile_contents;
let mapFile_name;
let mapFile_type;
//"Upload" file - listener
inp_map_fileSelect.addEventListener('change', ()=>{
    const file = inp_map_fileSelect.files[0];
    return new Promise ((resolve, reject)=>{
        const reader = new FileReader();
        reader.readAsText(file);
    //Do stuff
        reader.onload = ()=> {
            //console.log(reader.result);
            mapFile_contents = reader.result;
            const filename_parts = file.name.split('.');
            mapFile_type = '.'+filename_parts[filename_parts.length-1].toLowerCase();
            mapFile_name = filename_parts[0];
            btn_map_processFile.setAttribute('style', "display: block;");
        //Resolve
            resolve(reader.result);
        }
    });
});

//
// PROCESS FILE
//
btn_map_processFile.addEventListener('click', ()=>{
    ProcessFile_Map();
});

function ProcessFile_Map() {
    let file_contents_split = [];
    let brushArray_raw = [];
    let brushArray_planes = [];

    let output_objFile = "";
    const targetField = document.querySelector('#outputField');
    targetField.innerHTML = "";
console.log(inp_map_flipYZ.checked);
    switch (mapFile_type) {
        case ".map":
            file_contents_split = MAP_SplitFileContents(mapFile_contents);
            brushArray_raw = MAP_GetBrushArray(file_contents_split);
            brushArray_planes = MAP_GetBrushPlaneArray(brushArray_raw);
            output_objFile = Output_objFile(brushArray_planes, inp_map_skipTextures.value.toLowerCase().split(' '), inp_map_scaleFactor.value, inp_map_rounding.value, inp_map_flipYZ.checked);
            targetField.appendChild(CreateEntry(output_objFile));
            SetDownload_Map2Obj(output_objFile);
            break;
        case ".bsp":
            let worldspawn = mapFile_contents.substring(mapFile_contents.indexOf("\"classname\""));
            let end = worldspawn.indexOf('}', worldspawn.lastIndexOf("classname"))+1;
            worldspawn = worldspawn.substring(0, end);
            targetField.appendChild(CreateEntry("{\r\n"+worldspawn));
        }
    return;
}

function SetDownload_Map2Obj(_output_objFile) {
    btn_map_downloadFile.setAttribute('style', "display: inline-block;");
    btn_map_downloadFile.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(_output_objFile));
    btn_map_downloadFile.setAttribute('download', `output_${mapFile_name}.obj`);
}