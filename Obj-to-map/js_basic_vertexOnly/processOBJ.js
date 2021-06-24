function ProcessOBJ(_file_contents, _scaleFactor, _rounding) {

    let allTheData = _file_contents.split("\r\n");                      //<==Splits the file contents up line-by-line
    let coordArray = [];
    //console.log (allTheData);
    for(let i = 0; i < allTheData.length; i++) {
        if(allTheData[i].includes("v ")){
            let thisEntry = allTheData[i].split(" ");
            coordArray.push(
                ScaleAndRound(
                    parseFloat(thisEntry[1]), _scaleFactor, _rounding
                )
            );
            coordArray.push(
                ScaleAndRound(
                    parseFloat(thisEntry[2]), _scaleFactor, _rounding
                )
            );
            coordArray.push(
                ScaleAndRound(
                    parseFloat(thisEntry[3]), _scaleFactor, _rounding
                )
            );
        }
    }
    console.log (coordArray);
    return SortV3Array(CreateV3Array(coordArray));
}