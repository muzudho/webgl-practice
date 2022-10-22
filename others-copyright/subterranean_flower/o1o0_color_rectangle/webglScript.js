function init() {
    // * HTMLタグを書いているならこちら
    // var canvas = document.getElementById("canvas");
    //
    // * Canvasを作成してbodyに追加するならこちら
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    // * キャンバスサイズ設定
    canvas.width = 500;
    canvas.height = 500;

    // * WebGL2のコンテキストを取得
    const gl = canvas.getContext("webgl2");

    // * 外部ファイルのシェーダ読込
    const loadVertexShader = fetch("vertex_shader.glsl");
    const loadFragmentShader = fetch("fragment_shader.glsl");

    Promise.all([loadVertexShader, loadFragmentShader])
        .then((responses) => Promise.all([responses[0].text(), responses[1].text()]))
        .then((shaderSources) => {
            const vertexShaderSource = shaderSources[0];
            const fragmentShaderSource = shaderSources[1];

            // バーテックスシェーダをコンパイルします。
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, vertexShaderSource);
            gl.compileShader(vertexShader);

            // コンパイル成功したか否かをチェックします。
            const vShaderCompileStatus = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
            if (!vShaderCompileStatus) {
                const info = gl.getShaderInfoLog(vertexShader);
                console.log(info);
            }

            // フラグメントシェーダについても同様にします。
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fragmentShaderSource);
            gl.compileShader(fragmentShader);

            const fShaderCompileStatus = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
            if (!fShaderCompileStatus) {
                const info = gl.getShaderInfoLog(fragmentShader);
                console.log(info);
            }

            // シェーダプログラムを作成します。
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            // リンクできたかどうかを確認します。
            const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linkStatus) {
                const info = gl.getProgramInfoLog(program);
                console.log(info);
            }

            // プログラムを使用します。
            gl.useProgram(program);

            // データを転送するためのバッファを作成します。
            const vertexBuffer = gl.createBuffer();
            const colorBuffer = gl.createBuffer();

            // バーテックスシェーダのin変数の位置を取得します。
            const vertexAttribLocation = gl.getAttribLocation(program, "vertexPosition");
            const colorAttribLocation = gl.getAttribLocation(program, "color");

            const VERTEX_SIZE = 3; // vec3
            const COLOR_SIZE = 4; // vec4

            // バッファ操作前には必ずバインドします。
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            // in変数を有効化します
            gl.enableVertexAttribArray(vertexAttribLocation);
            // 現在バインドしているバッファと変数を結びつけます。
            // サイズはvec3を指定してるので3にします。型はFLOATを使用します。
            // うしろ3つの引数は今は気にしないでください。
            gl.vertexAttribPointer(vertexAttribLocation, VERTEX_SIZE, gl.FLOAT, false, 0, 0);

            // 頂点色についても同様にします。
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.enableVertexAttribArray(colorAttribLocation);
            gl.vertexAttribPointer(colorAttribLocation, COLOR_SIZE, gl.FLOAT, false, 0, 0);

            // 頂点情報。vec3で宣言しているので、xyzxyzxyz…と並べていきます。
            // WebGL2では基本的にfloat型を使うので、Float32Arrayを使用します。
            const vertices = new Float32Array([-0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0]);

            // 色情報。vec4で宣言してるのでrgbargbargba…と並べていきます。
            // すべて0.0〜1.0の範囲で指定します。
            // 頂点と同じ数だけ（今回は6つ）必要です。
            const colors = new Float32Array([1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0]);

            // バインドしてデータを転送します。
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

            // 四角形を描画します。
            const VERTEX_NUMS = 6;
            gl.drawArrays(gl.TRIANGLES, 0, VERTEX_NUMS);

            // WebGLに描画を促します。
            gl.flush();
        });

    /*
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
    */
}

// EOF
