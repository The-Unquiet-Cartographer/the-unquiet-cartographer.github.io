class Vector3 {
    constructor (x, y, z) {
        this.x = Vector3.#positiveZero(x);
        this.y = Vector3.#positiveZero(y);
        this.z = Vector3.#positiveZero(z);
    }

//SUM OF COMPONENTS
    Sum () {
        return this.x + this.y + this.z;
    }

//DOT PRODUCT WITH ANOTHER VECTOR
    static Dot (vector_1, vector_2) {
        return (vector_1.x * vector_2.x) + (vector_1.y * vector_2.y) + (vector_1.z * vector_2.z);    
    }

//GET MAGNITUDE
    Magnitude () {
        return Math.sqrt(
            Vector3.#f_Sq(this.x)
            +Vector3.#f_Sq(this.y)
            +Vector3.#f_Sq(this.z)
        );
    }

//NORMALIZE VECTOR (RETURN WITH A MAGNITUDE OF 1)
    Normalize () {
        let magnitude = this.Magnitude();
        return new Vector3 (
            this.x/magnitude,
            this.y/magnitude,
            this.z/magnitude
        );
    }

//DIRECTION FROM ORIGIN TO DESTINATION
/*(= Destination - Origin)*/    
    static GetDirection (origin, destination) {
        return new Vector3 (
            destination.x - origin.x,
            destination.y - origin.y,
            destination.z - origin.z
        );
    }

//DIRECTION FROM ANOTHER COORDINATE
    GetDirectionFrom (otherVector) {
        return new Vector3 (
            this.x - otherVector.x,
            this.y - otherVector.y,
            this.z - otherVector.z
        );    
    }

//DIRECTION TO ANOTHER COORDINATE
    GetDirectionTo (otherVector) {
        return new Vector3 (
            otherVector.x - this.x,
            otherVector.y - this.y,
            otherVector.z - this.z
        );    
    }

//CROSS PRODUCT WITH ANOTHER VECTOR
    static CrossProduct (vector_1, vector_2) {
        return new Vector3 (
            (vector_1.y * vector_2.z) - (vector_1.z * vector_2.y),
            (vector_1.z * vector_2.x) - (vector_1.x * vector_2.z),
            (vector_1.x * vector_2.y) - (vector_1.y * vector_2.x)
        );
    }

//SIGNED VECTOR
    Sign (fidelity) {
        //FIDELITY 3: Sign all components.
        if (fidelity >= 3) return new Vector3 (
            Math.sign(this.x), Math.sign(this.y), Math.sign(this.z)
        );
        else {
        //FIDELITY 1: Only sign the biggest component.
            let signedVector = new Vector3 (0,0,0);
            if (Math.abs(this.y) > Math.abs(this.x)) {
                if (Math.abs(this.z) > Math.abs(this.y)) {
                    signedVector.z = Math.sign(this.z);
                }
                else signedVector.y = Math.sign(this.y);
            }
            else if (Math.abs(this.z) > Math.abs(this.x)) {
                signedVector.z = Math.sign(this.z);
            }
            else signedVector.x = Math.sign(this.x);
            if (fidelity < 2) return signedVector;
        //FIDELITY 2: Get half the size of the biggest component. If the other components are > this value, sign them as well.
            let halfBig = Math.abs(this.Dot(signedVector))/2;
            if (Math.abs(this.x) > halfBig) signedVector.x = Math.sign(this.x);
            if (Math.abs(this.y) > halfBig) signedVector.y = Math.sign(this.y);
            if (Math.abs(this.z) > halfBig) signedVector.z = Math.sign(this.z);
            return v;
        }
    }

//INVERT DIRECTION
    Invert () {
        return new Vector3 (
            -this.x,
            -this.y,
            -this.z
        );
    }

//ADD ANOTHER VECTOR
    static Add (vector_1, vector_2) {
        return new Vector3 (
            vector_1.x + vector_2.x,
            vector_1.y + vector_2.y,
            vector_1.z + vector_2.z
        );
    }

//SCALE (MULTIPLY) WITH ANOTHER VECTOR
    static Scale3 (vector_1, vector_2) {
        return new Vector3 (
            vector_1.x * vector_2.x,
            vector_1.y * vector_2.y,
            vector_1.z * vector_2.z
        );
    }

//SCALE BY A FLAT VALUE
    static Scale1 (vector, scalar) {
        return new Vector3 (
            vector.x * scalar,
            vector.y * scalar,
            vector.z * scalar
        );
    }
    Scale1 (scalar) {
        return new Vector3 (
            this.x * scalar,
            this.y * scalar,
            this.z * scalar
        );
    }

//ROUND
    Round (rounding) {
        return new Vector3 (
            Vector3.#round(this.x, rounding),
            Vector3.#round(this.y, rounding),
            Vector3.#round(this.z, rounding)
        );
    }

//VALIDATE COMPONENT VALUES
    IsValid () {
        if (!isFinite(this.x) || !isFinite(this.y) || !isFinite(this.z)) return false;
        return true;
    }

//STRINGIFY
    ToString () {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }


//
//UTILITY FUNCTIONS
//
    static #positiveZero(num) {
        if (num === -0) return 0;
        return num;
    }
    static #f_Sq (num) {
        return num * num;
    }
    static #round(i, rounding) {
        return Math.round(i/rounding) * rounding;
    }
//
}



//////////////////////////////////////////////////
//
//  GET ANGLE BETWEEN VECTORS
//
//////////////////////////////////////////////////


/*Using the law of cosines*/
function UnsignedAngle (axis, pt1, pt2) {
    const mag_0_1 = Vector3.GetDirection(axis, pt1).Magnitude();
    const mag_0_2 = Vector3.GetDirection(axis, pt2).Magnitude();
    const mag_1_2 = Vector3.GetDirection(pt1, pt2).Magnitude();
    return Math.acos(
        (f_Sq(mag_0_1) + f_Sq(mag_0_2) - f_Sq(mag_1_2))
        / (2 * mag_0_1 * mag_0_2)
    );
}


//Return a signed angle
/*
*   Using atan2.
*   Returns value in radians.
*   Left-handed and right-handed variants.
*/
function SignedAngle_r (dir_normal, dir_1, dir_2) {
    return Math.atan2(Vector3.Dot(Vector3.CrossProduct(dir_1, dir_2), dir_normal), Vector3.Dot(dir_1, dir_2));
}
function SignedAngle_l (dir_normal, dir_1, dir_2) {
    return Math.atan2(Vector3.Dot(Vector3.CrossProduct(dir_2, dir_1), dir_normal), Vector3.Dot(dir_1, dir_2));
}




//////////////////////////////////////////////////
//
//  SORT ARRAY OF VECTOR3s
//
//////////////////////////////////////////////////


//SORT V3 ARRAY BY Z,X,Y
/*
*   CALLED BY: func_output_mapFile
*/
function SortV3Array(_v3Array) {
    let sortedArray = [];
    sortedArray[0] = _v3Array[0];
//Iterate through old array and new array concurrently...
    for (let i = 1; i < _v3Array.length; i++) {
        for (let j = 0; j < sortedArray.length; j++) {
        //Sort Z
            if (_v3Array[i].z < sortedArray[j].z) {
                sortedArray.splice(j, 0, _v3Array[i]);
                break;
            }
            if (_v3Array[i].z == sortedArray[j].z) {
            //Sort X
                if (_v3Array[i].x < sortedArray[j].x) {
                    sortedArray.splice(j, 0, _v3Array[i]);
                    break;
                }
                if (_v3Array[i].x == sortedArray[j].x) {
                //Sort Y
                    if (_v3Array[i].y < sortedArray[j].y) {
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