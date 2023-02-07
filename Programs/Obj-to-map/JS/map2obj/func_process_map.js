function MAP_SplitFileContents (_file_contents) {
    return _file_contents.split("\r\n");
}

/*.MAP file is invalid unless strictly formatted with whitespace and line breaks, making it easier to process.*/

function MAP_GetBrushArray (_file_contents_split = []) {
    let worldspawn = _file_contents_split.findIndex(element => element.includes("worldspawn"));
    let brushArray = [];
    let brushFound = false;
    for (let i = worldspawn+1; i < _file_contents_split.length; i++) {
        let thisEntry = _file_contents_split[i].trim();
        if (thisEntry === "{") {
            brushFound = true;
            brushArray.push([]);
            continue;
        }
        if (brushFound) {
            if (thisEntry === "}") {
                brushFound = false;
                continue;
            }
            else brushArray[brushArray.length-1].push(thisEntry);
        }
    }
    return brushArray;
}

function MAP_GetBrushPlaneArray (_brushArray_raw = []) {
    let _brushArray_planes = [];
    for (let i = 0; i < _brushArray_raw.length; i++) {
        _brushArray_planes.push([]);
        for (let j = 0; j < _brushArray_raw[i].length; j++) {
            thisEntry = _brushArray_raw[i][j].split(" ");
            const p1 = new Vector3 (thisEntry[1], thisEntry[2], thisEntry[3]);
            const p2 = new Vector3 (thisEntry[6], thisEntry[7], thisEntry[8]);
            const p3 = new Vector3 (thisEntry[11], thisEntry[12], thisEntry[13]); 
            const texturePath = thisEntry[15].split("/");
            const plane = new Plane (p1, p2, p3, texturePath[texturePath.length-1]);
            _brushArray_planes[i].push(plane);
        }
    }
    return _brushArray_planes;
}