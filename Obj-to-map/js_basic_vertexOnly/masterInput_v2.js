//
// FILETYPE SELECTION
//
let swjk = "3DO - Star Wars Jedi Knight / Mysteries of the Sith";
const gepd = "OBJ - GoldenEye 007 / Perfect Dark";
const spyro = "OBJ - Spyro (PS1)";

    const dict_types = {
        /*"filetype": [
            * "Game",
            * "Description",
            * #(recommended) Scale Factor,
        ] */
        "3DO - Star Wars Jedi Knight / Mysteries of the Sith": [
            "Levels can be exported in .3DO format from the ZED level editor.",
            320,
        ],
        "OBJ - GoldenEye 007 / Perfect Dark": [
            "Levels can be exported using the GoldenEye setup editor. Go to: Visual edit mode -> room select mode -> right click in the window -> export full level to obj.",
            1.5,
        ],
        "OBJ - Spyro (PS1)": [
            "Levels can be convereted to .OBJ via scripts included with the Spyro World Viewer",
            1,
        ]
    };
    let filetype = Object.keys(dict_types)[0];
    const inp_filetype = document.querySelector('#inp_filetype');
//Set default values
    const desc_filetype = document.querySelector('#desc_filetype');
    const inp_scaleFactor = document.querySelector('#inp_sFactor');
    const inp_rounding = document.querySelector('#inp_rounding');
    desc_filetype.textContent = dict_types[Object.keys(dict_types)[0]][0];
    inp_scaleFactor.value = dict_types[Object.keys(dict_types)[0]][1];
    inp_rounding.value = 1;

//Create filetype options in HTML
    for (let key in dict_types) {
        let newOption = document.createElement('option');
        newOption.textContent = key;
        inp_filetype.appendChild(newOption);
    }
//Select filetype (listener) & set values
    inp_filetype.addEventListener('change', (e) => {
        filetype = e.target.value;
        desc_filetype.textContent = dict_types[filetype][0];
        inp_scaleFactor.value = dict_types[filetype][1];
    });



//
// CHOOSE INPUT FILE
//
    const inp_fileSelect = document.querySelector('#inp_fileSelect');
    const btn_processFile = document.querySelector('#btn_processFile');
    let file_contents;

//"Upload" file - listener
    inp_fileSelect.addEventListener('change', ()=>{
        const file = inp_fileSelect.files[0];
        return new Promise ((resolve, reject)=>{
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = ()=> {
            //Do stuff
                //console.log(reader.result);
                file_contents = reader.result;
                btn_processFile.setAttribute('style', "display: block;");
            //Resolve
                resolve(reader.result);
            }
        });
    });



//
// PROCESS FILE
//

//Verify filetype and execute appropriate conversion method
/*
    3DO - JK/MotS - "MODEL [path].3DO created by JED 0.951 beta"
    OBJ - GE/PD - "# Created by SubDrag and the GoldenEye Setup Editor V3.0"
*/
    btn_processFile.addEventListener('click', ()=>{
        let output_vertArray = VerifyAndProcess();
        WriteOutput_ToField_VertexOnly(output_vertArray);
        let output_str = Output_FieldToText();
        btn_downloadFile.setAttribute('style', "display: inline-block;");
        btn_downloadFile.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output_str));
        btn_downloadFile.setAttribute('download', "output.map");
    });

    function VerifyAndProcess() {
        switch (filetype) {
            case "3DO - Star Wars Jedi Knight / Mysteries of the Sith":
                if (file_contents.includes(".3DO created by JED 0.951 beta")) {
                    return Process3DO(file_contents, inp_scaleFactor.value, inp_rounding.value);
                }
                break;
            case "OBJ - GoldenEye 007 / Perfect Dark":
                if (file_contents.includes("# Created by SubDrag and the GoldenEye Setup Editor V3.0")) {
                    return ProcessOBJ(file_contents, inp_scaleFactor.value, inp_rounding.value);
                }
                break;
            case "OBJ - Spyro (PS1)":
                return ProcessOBJ(file_contents, inp_scaleFactor.value, inp_rounding.value);
                break;
        }
        return "poo";
    }