function Process3DO(_file_contents, _scaleFactor, _rounding) {

//Pull vertex data from file
    let vertexData = _file_contents.slice(_file_contents.indexOf("VERTICES"), _file_contents.indexOf("TEXTURE VERTICES"));
    vertexData = vertexData.slice(vertexData.indexOf("0:"), vertexData.length);
    vertexData.trim();
    //console.log(vertexData);

//Split vertex data into coordinates and remove superflous data. 
    coordArray = vertexData.split(" ");
    for (let i = coordArray.length-1; i >=0; i-=4) {
        coordArray.splice(i,1);
    }
    //console.log(coordArray);

//Make numbers readable and parse them as (float) numbers
    for (let i = 0; i < coordArray.length; i++) {
    //Check if first character is a decimal place and replace it.
        if (coordArray[i][0] === ".") {
            coordArray[i] = coordArray[i].replace(".", "0.");
        }
    //Else check if the second character is a decimal place and the first is a negative sign.
        else if (coordArray[i][1] === "." && coordArray[i][0] == "-") {
            coordArray[i] = coordArray[i].replace(".", "0.");
        }
//Parse the string to a float
    coordArray[i] = ScaleAndRound(parseFloat(coordArray[i]), _scaleFactor, _rounding);
    }

    return SortV3Array(CreateV3Array(coordArray));
}