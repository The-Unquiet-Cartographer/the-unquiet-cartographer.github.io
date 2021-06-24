//Return coordinate value, scaled by scaleFactor and rounded to nearest multiple of rounding integer.
    function ScaleAndRound(input, scaleFactor, rounding) {
        return (Math.round((input * scaleFactor)/rounding) * rounding);
    }

//Take an array of coordinate values and arrange them into sets of three.
    function CreateV3Array (_coordArray) {
        let v3Array = [];
        for (let i = 0; i < _coordArray.length; i+=3) {
            let x = _coordArray[i];
            let y = _coordArray[i+1];
            let z = _coordArray[i+2];
            v3Array.push([x,y,z]);
        }
        return v3Array;
    }

//SORT ARRAY BY Z,X,Y
    function SortV3Array(_v3Array) {
        let sortedArray = [];
        sortedArray[0] = _v3Array[0];
    //Iterate through old array and new array concurrently...
        for (let i = 1; i < _v3Array.length; i++) {
            for (let j = 0; j < sortedArray.length; j++) {
            //Sort Z
                if (_v3Array[i][2] < sortedArray[j][2]) {
                    sortedArray.splice(j, 0, _v3Array[i]);
                    break;
                }
                if (_v3Array[i][2] == sortedArray[j][2]) {
                //Sort X
                    if (_v3Array[i][0] < sortedArray[j][0]) {
                        sortedArray.splice(j, 0, _v3Array[i]);
                        break;
                    }
                    if (_v3Array[i][0] == sortedArray[j][0]) {
                    //Sort Y
                        if (_v3Array[i][1] < sortedArray[j][1]) {
                            sortedArray.splice(j, 0, _v3Array[i]);
                            break;
                        }
                    }
                }
            //If we get to the end and we still haven't sorted the entry, then put it on the end.
                if (j == sortedArray.length-1) {
                    sortedArray.push(_v3Array[i]);
                    break;
                }
            }
        }
        return sortedArray;
    }