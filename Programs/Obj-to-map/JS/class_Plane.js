class Plane {
    constructor (p1, p2, p3, texture = "") {
        const dir1 = p1.GetDirectionTo(p2);
        const dir2 = p1.GetDirectionTo(p3);
        const xProduct = Vector3.CrossProduct(dir1, dir2).Normalize();
        const aX_bY_cZ = Vector3.Scale3(xProduct, p1);
        //const aX_bY_cZ = Vector3.Scale(xProduct, p2);
        //const aX_bY_cZ = Vector3.Scale(xProduct, p3);
        this.a = xProduct.x;
        this.b = xProduct.y;
        this.c = xProduct.z;
        this.d = aX_bY_cZ.Sum() * -1;                                   //<== We do f(*= -1) because (a+b+c)+d needs to equal zero. 
        this.normal = xProduct.Normalize();
        this.texture = texture;
    }

    static Intersection (plane_1, plane_2, plane_3) {
        const planes = [plane_1, plane_2, plane_3];
        let order = this.#SortPlanes(planes);
        let augmentedMatrix = [
            [planes[order[0]].a, planes[order[0]].b, planes[order[0]].c, planes[order[0]].d],
            [planes[order[1]].a, planes[order[1]].b, planes[order[1]].c, planes[order[1]].d],
            [planes[order[2]].a, planes[order[2]].b, planes[order[2]].c, planes[order[2]].d]
        ];
        augmentedMatrix[1] = this.#GaussianElimination(augmentedMatrix[1], 0, augmentedMatrix[0]);
        augmentedMatrix[2] = this.#GaussianElimination(augmentedMatrix[2], 0, augmentedMatrix[0]);
        augmentedMatrix[2] = this.#GaussianElimination(augmentedMatrix[2], 1, augmentedMatrix[1]);
        const z = augmentedMatrix[2][3] / augmentedMatrix[2][2];
        const y = (augmentedMatrix[1][3] - augmentedMatrix[1][2] * z) / augmentedMatrix[1][1];
        const x = (augmentedMatrix[0][3] - augmentedMatrix[0][2] * z - augmentedMatrix[0][1] * y) / augmentedMatrix[0][0];
        return new Vector3(-x, -y, -z);                                                                                     //<== The function previously returned negative co-ordinates, so I flipped the sign. This meant that ContainsPt() acted differently as well.
    }

//Returns 1 if the pt is inside the half-space, -1 if the pt is outside, and 0 if the pt lies on the plane.
    ContainsPt (pt) {
        return Math.sign(this.a * pt.x + this.b * pt.y + this.c * pt.z + this.d);
    }

    ToString () {
        return `${this.a}x + ${this.b}y + ${this.c}z = ${this.d}`;
    }



//////////////////////////
//  INTERNAL FUNCTIONS  //
//////////////////////////

//Sort planes by how many non-zero properties they have, starting with a. Our resultant matrix might look something like this:
/*  a   b   c   d
    32  8   16  N/A
    0   12  16  N/A
    0   0   8   N/A
*/
//Required so that we can progmatically carry out our Gaussian Elimination when we look for an intersection.
    static #SortPlanes (_planes = []) {
    //Count the zeros
        let ctrs = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            if (_planes[i].a == 0) {
                ctrs[i]++;
                if (_planes[i].b == 0) {
                    ctrs[i]++;
                    if (_planes[i].c == 0) {
                        ctrs[i]++;
                    }
                }
            }
        }
    //Sort the counters
        let order = [];
        for (let i = 0; i < 3; i++) {
            let j_smallest = -1;
            let value = 3;
        //Get the counter with the smallest value, and push it to the array.
            for (let j = 0; j < ctrs.length; j++) {
                if (order.includes(j)) continue;
                if (ctrs[j] <= value) {
                    value = ctrs[j];
                    j_smallest = j;
                }
            }
            order.push(j_smallest);
        }
        return order;
    }

//Refactor the matrix by zeroing value c of row rx, using row0 as a basis.
//Look, it helps to calculate the intersection point of a trio of planes, okay?
    static #GaussianElimination (rx = [], c, r0 = []) {
        let r = [];
        if (rx[c] != 0) {
        //Multiplication method
            if (r0[c] != 0) {
                const mult_r0 = rx[c]/r0[c];
                for (let i = 0; i < 4; i++) {
                    r.push(r0[i] * mult_r0 - rx[i]);
                }
                return r;
            }
        //Addition method
            else {
                const add_r0 = rx[c]-r0[c];
                for (let i = 0; i < 4; i++) {
                    r.push(r0[i] + add_r0 - rx[i]);
                }
                return r;
            }
        }
        else {
            for (let i = 0; i < 4; i++) {
                r.push(rx[i]);
            }
            return r;
        }
    }

//end class
}