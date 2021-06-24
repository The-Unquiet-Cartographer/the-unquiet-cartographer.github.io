.OBJ files

Specifically those exported from the Spyro World Viewer.

So first comes a list of VTs - texture vertices. Unlike the other data, these are defined together in one big block.

Then for each g tex_#, there is defined a new list of Vs (vertices) and/or a list of Fs (faces). These are defined piecemeal under the heading for (presumably) each texture that is used.

Then the Fs come in. These are faces. Each coordinate is defined by a (1-based, not 0-based) index reference to
a) a previously defined V on the left of the '/'
b) a previously defined VT on the right of the '/' 

The fact that the Vs are defined piecemeal has no effect on the indexing. It seems as though they are all part of one big list.

Faces are defined with their vertices ordered clockwise. These allows normals to be implicit. This means that you can work out the face normals from the coordinates given.



https://en.wikipedia.org/wiki/Wavefront_.obj_file
https://quakewiki.org/wiki/Quake_Map_Format