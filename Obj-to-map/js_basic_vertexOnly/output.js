//Take an array of vertices and create a .MAP file, writing directly to the target field on the page
    function WriteOutput_ToField_VertexOnly(_v3array) {
        const targetField = document.querySelector('#outputField');
        const worldspawn = '// entity 0 \r\n \
            { \r\n \
            "classname" "worldspawn" \r\n \
            } \r\n \
            ';
        targetField.appendChild(CreateEntry(worldspawn));

        for (let i = 0; i < _v3array.length; i++) {
            const info_null = `// entity ${i+1} \r\n \
                { \r\n \
                "origin" "${_v3array[i][0]} ${_v3array[i][1]} ${_v3array[i][2]}" \r\n \
                "classname" "info_null" \r\n \
                } \r\n \
                `;
            targetField.appendChild(CreateEntry(info_null));
        }
        return;
    }

    function Output_FieldToText () {
        let output_text = "";
        document.querySelector('#outputField').querySelectorAll('p').forEach((p)=> {
            output_text = output_text.concat(p.textContent);
        });
        return output_text;
    }

//
//Take an array of vertices and create a .MAP file, storing outputted text as a string.
    function WriteOutput_ToText_VertexOnly(_v3array) {
        let output_text = "";
        const targetField = document.querySelector('#outputField');
        const worldspawn = '// entity 0 \r\n \
            { \r\n \
            "classname" "worldspawn" \r\n \
            } \r\n \
            ';
            output_text = output_text.concat(worldspawn);
        targetField.appendChild(CreateEntry(worldspawn));

        for (let i = 0; i < _v3array.length; i++) {
            const info_null = `// entity ${i+1} \r\n \
                { \r\n \
                "origin" "${_v3array[i][0]} ${_v3array[i][1]} ${_v3array[i][2]}" \r\n \
                "classname" "info_null" \r\n \
                } \r\n \
                `;
            output_text = output_text.concat(info_null);
            targetField.appendChild(CreateEntry(info_null));
        }
        return output_text;
    }



    function CreateEntry(_string) {
        let newElem = document.createElement("p");
        newElem.textContent = _string;
        newElem.style.whiteSpace = 'pre-line';
        return newElem;
    }