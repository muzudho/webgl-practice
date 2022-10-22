function init() {
    var canvas = document.getElementById("canvas");
    canvas.width = 500;
    canvas.height = 500;
    var gl = canvas.getContext("webgl");
    gl.clearColor(1.0, 1.0, 1.0, 1.0); //Red,Green,Blue,Alpha
    gl.clear(gl.COLOR_BUFFER_BIT);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    var vSource = ["precision mediump float;", "attribute vec2 vertex;", "void main(void) {", "gl_Position = vec4(vertex, 0.0, 1.0);", "}"].join("\n");
    var vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vSource);
    gl.compileShader(vShader);
    gl.getShaderParameter(vShader, gl.COMPILE_STATUS);

    // 色
    var rgba = [0.0, 0.0, 0.0, 1.0]; // Red, Green, Blue, Alpha

    var fSource = ["precision mediump float;", "void main(void) {", "gl_FragColor = vec4(" + rgba.join(",") + ");", "}"].join("\n");
    var fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fSource);
    gl.compileShader(fShader);
    gl.getShaderParameter(fShader, gl.COMPILE_STATUS);

    var program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.getProgramParameter(program, gl.LINK_STATUS);
    gl.useProgram(program);

    var vertex = gl.getAttribLocation(program, "vertex");
    gl.enableVertexAttribArray(vertex);
    gl.vertexAttribPointer(vertex, 2, gl.FLOAT, false, 0, 0);

    // 直線
    var vertices = [
        -1,
        0, //x,y
        1,
        0, //x,y
    ];
    var verticesNum = vertices.length / 2;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // - `gl.LINE_LOOP` - 終点と始点をつなげる
    gl.drawArrays(gl.LINE_LOOP, 0, verticesNum);
}

// EOF
