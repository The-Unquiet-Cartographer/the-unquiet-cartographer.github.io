function Output_objFile (_brushArray_planes = [], _skippedTextures = [], _scaleFactor, _rounding, _flipYZ) {

    let output_text = "";
    let totalVertices_ = 0;             //<== Used at the end when recording face vertices in the output .obj

    for (let a = 0; a < _brushArray_planes.length; a++) {
    //Get the planes that make up a brush...
        const thisBrush_planes = _brushArray_planes[a];
    //For every brush face, create a vertex array...
        let faceVertices_byBrush = new Array (thisBrush_planes.length);
        for (let i = 0; i < faceVertices_byBrush.length; i++) faceVertices_byBrush[i] = [];
    //For every possible triad of planes, try to calculate an intersection point...
        for (let i = 0; i < thisBrush_planes.length-2; i++) {
            for (let j = i+1; j < thisBrush_planes.length-1; j++) {
                for (let k = j+1; k < thisBrush_planes.length; k++) {
                    let pt = Plane.Intersection(thisBrush_planes[i], thisBrush_planes[j], thisBrush_planes[k]);
                //If the point is valid, i.e. made up of three finite values...
                    if (pt.IsValid()) {
                    //For all remaining planes, check that the vertex is not outside the half-space defined by any of the other planes, i.e. as when the planes of a frustrum angle together and intersect...
                        let isContained = true;
                        console.log (`Intersection ${i} ${j} ${k}\r\nPt: ${pt.ToString()}`);
                        for (let l = 0; l < thisBrush_planes.length; l++) {
                            if (l == i || l == j || l == k) continue;
                            console.log(`Plane ${l} (${thisBrush_planes[l].a.toFixed(3)}, ${thisBrush_planes[l].b.toFixed(3)}, ${thisBrush_planes[l].c.toFixed(3)}, ${thisBrush_planes[l].d.toFixed(3)}) with normal (${thisBrush_planes[l].normal.x.toFixed(3)}, ${thisBrush_planes[l].normal.y.toFixed(3)}, ${thisBrush_planes[l].normal.z.toFixed(3)}) contains? = ${thisBrush_planes[l].ContainsPt(pt)}.`);
                            if (thisBrush_planes[l].ContainsPt(pt) < 0) {
                                isContained = false;
                                break;
                            }
                        }
                        if (isContained) {
                            faceVertices_byBrush[i].push(pt);
                            faceVertices_byBrush[j].push(pt);
                            faceVertices_byBrush[k].push(pt);
                        }
                    }
                }
            }
        }
        console.log (faceVertices_byBrush);

    //For each face, get the vertices in clockwise order.
        for (let i = 0; i < faceVertices_byBrush.length; i++) {
            if (_skippedTextures.includes(thisBrush_planes[i].texture)) continue;
            let thisFace_vertices = faceVertices_byBrush[i];
            const normal = thisBrush_planes[i].normal;
            const axis = thisFace_vertices.pop();
            const dir1 = Vector3.GetDirection(axis, thisFace_vertices[0]);
            let angles = [0];
            let thisFace_vertices_inOrder = [thisFace_vertices[0]];
        //Measure the angle to all remaining face vertices...
            for (let j = 1; j < thisFace_vertices.length; j++) {
                let dir2 = Vector3.GetDirection(axis, thisFace_vertices[j]);
                let ang = SignedAngle_l(normal, dir1, dir2);
            //If the angle is less than zero, insert it in the first half of the list...
                if (ang < 0) {
                    for (let k = 0; k < angles.length; k++) {
                        if (angles[k] > ang) {
                            angles.splice(k,0,ang);
                            thisFace_vertices_inOrder.splice(k,0,thisFace_vertices[j]);
                            break;
                        }
                    }
                }
            //If the angle is greater than zero, insert it in the second half of the list...
                else {
                    for (let k = angles.length-1; k > -1; k--) {
                        if (angles[k] < ang) {
                            angles.splice(k+1,0,ang);
                            thisFace_vertices_inOrder.splice(k+1,0,thisFace_vertices[j]);
                            break;
                        }
                    }
                }
            //end for thisFace_vertices
            }
        //Add the axis. The vertices should now be in order.
            thisFace_vertices_inOrder.push(axis);
            faceVertices_byBrush[i] = thisFace_vertices_inOrder;
        //end for faceVertices_byBrush
        }

    //Add the vertices (in order) and the face data to the output text 
        for (let i = 0; i < faceVertices_byBrush.length; i++) {
            if (_skippedTextures.includes(thisBrush_planes[i].texture)) continue;
            let thisFace_vertices = faceVertices_byBrush[i];
            let str_vertices = "";
            let str_face = "f";
            for (let j = 0; j < thisFace_vertices.length; j++) {
                let vert = Vector3.Scale1(thisFace_vertices[j], _scaleFactor).Round(_rounding);
                if (_flipYZ) {
                    vert = new Vector3(-vert.x, vert.z, vert.y);
                }
                str_vertices = str_vertices.concat(`v ${vert.x} ${vert.y} ${vert.z}\r\n`);
                str_face = str_face.concat(` ${totalVertices_ + (j+1)}`);                //<== .OBJ file uses a 1-based index.
            }
            str_face = str_face.concat("\r\n\r\n");
            totalVertices_ += thisFace_vertices.length;
            output_text = output_text.concat(str_vertices);
            output_text = output_text.concat(str_face);
        //end for faceVertices_byBrush
        }
    
    //end for brushArray_planes
    }

    return output_text;

//end function
}