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

    //フラグメントシェーダの設定で設定したカラーを以下に変更
    var rgba = [1.0, 0.0, 0.0, 1.0]; // Red, Green, Blue, Alpha

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

    // 頂点3つで1つの三角形に対応
    var vertices = [-0.75, 0.4, 0.75, 0.4, -0.5, -0.7, 0.0, 0.8, 0.5, -0.7, -0.75, 0.4];
    var verticesNum = vertices.length / 2;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    // - `gl.LINE_STRIP` - 頂点3つで1つの三角形にする
    gl.drawArrays(gl.TRIANGLES, 0, verticesNum);
}

// EOF
