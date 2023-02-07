//////////////////////////////////////////////////
//
//  FLOAT/INT FUNCTIONS
//
//////////////////////////////////////////////////


//Ensure that a string is parsable by parseFloat()
/*
*   CALLED BY: func_process_3do
*/
function f_MakeParsable(string) {
//Check if first character is a decimal place and replace it.
    if (string[0] === ".") {
        string = string.replace(".", "0.");
    }
//Else check if the second character is a decimal place and the first is a negative sign.
    else if (string[1] === "." && string[0] === "-") {
        string = string.replace(".", "0.");
    }
    return string;
}


//Return coordinate value, scaled by scaleFactor and rounded to nearest multiple of rounding integer.
/*
*   CALLED BY: func_process_3do, func_process_obj
*/
function i_ScaleAndRound(input, scaleFactor, rounding) {
    return (Math.round((input * scaleFactor)/rounding) * rounding);
}


////////////////////////////////////////////////////////////////////////////////////////////////////

//  INPUT / OUPUT UTILITIES

////////////////////////////////////////////////////////////////////////////////////////////////////


//Create a paragraph element that can be appended to the document
/*
*   CALLED BY: masterInput_v5
*/
function CreateEntry(_string) {
    let newElem = document.createElement("p");
    newElem.textContent = _string;
    newElem.style.whiteSpace = 'pre-line';
    return newElem;
}


//Return the contents of the output field as a string
/*
*   UNUSED
*/
function Output_FieldToText () {
    let output_text = "";
    document.querySelector('#outputField').querySelectorAll('p').forEach((p)=> {
        output_text = output_text.concat(p.textContent);
    });
    return output_text;
}