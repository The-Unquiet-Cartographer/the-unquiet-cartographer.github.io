class Face {
    constructor (vertexArray = [], texture = undefined) {
        this.vertexArray = vertexArray;
        this.texture = texture;
    }
}
class Material {
    constructor (_newmtl) {
        let _startFrom;
        function GetValue () {
            return _newmtl.slice(_startFrom, _newmtl.indexOf("\r\n", _startFrom));
        }
        _startFrom = _newmtl.indexOf("newmtl ")+7;
        this.name = GetValue();
        _startFrom = _newmtl.indexOf("map_Kd ")+7;
        this.texture = GetValue();
    }
}