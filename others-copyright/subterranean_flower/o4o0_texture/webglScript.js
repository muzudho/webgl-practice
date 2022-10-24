// 📖 [WebGL2入門 テクスチャ編](https://sbfl.net/blog/2016/09/08/webgl2-tutorial-texture/)

function init() {
    // Canvasを作成してbodyに追加します。
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    document.body.appendChild(canvas);

    const gl = canvas.getContext("webgl2");

    // シェーダを読み込みPromiseを返します。
    function loadShaders() {
        const loadVertexShader = fetch("../input/texture/vertex_shader.glsl").then((res) => res.text());
        const loadFragmentShader = fetch("../input/texture/fragment_shader.glsl").then((res) => res.text());
        return Promise.all([loadVertexShader, loadFragmentShader]);
    }

    // テクスチャを読み込みPromiseを返します。
    function loadTextureImage(srcUrl) {
        const texture = new Image();
        return new Promise((resolve, reject) => {
            texture.addEventListener("load", (e) => {
                resolve(texture);
            });

            texture.src = srcUrl;
        });
    }

    // シェーダのソースからシェーダプログラムを作成し、
    // Programを返します。
    function createShaderProgram(vsSource, fsSource) {
        // バーテックスシェーダをコンパイルします。
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vsSource);
        gl.compileShader(vertexShader);

        const vShaderCompileStatus = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
        if (!vShaderCompileStatus) {
            const info = gl.getShaderInfoLog(vertexShader);
            console.log(info);
        }

        // フラグメントシェーダについても同様にします。
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fsSource);
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

        const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linkStatus) {
            const info = gl.getProgramInfoLog(program);
            console.log(info);
        }

        // プログラムを使用します。
        gl.useProgram(program);

        return program;
    }

    // バッファを作成し返します。
    function createBuffer(type, typedDataArray) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, typedDataArray, gl.STATIC_DRAW);
        gl.bindBuffer(type, null); // バインド解除

        return buffer;
    }

    // シェーダとテクスチャを読み込み終わったら開始します。
    Promise.all([loadShaders(), loadTextureImage("../input/texture/2016_09_texture.png")]).then((assets) => {
        const shaderSources = assets[0];
        const imageForTexture = assets[1];

        const vertexShaderSource = shaderSources[0];
        const fragmentShaderSource = shaderSources[1];

        const program = createShaderProgram(vertexShaderSource, fragmentShaderSource);

        //
        // テクスチャの転送
        //
        const texture = gl.createTexture(); // テクスチャの作成
        gl.bindTexture(gl.TEXTURE_2D, texture); // テクスチャのバインド
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageForTexture); // テクスチャデータの転送
        gl.generateMipmap(gl.TEXTURE_2D); // ミップマップの作成

        //    Y
        //  0.0 +----+----+
        //      |    |    |
        //  0.0 +----+----+
        //      |    |    |
        // -1.0 +----+----+
        //   -1.0  0.0  1.0 X
        //
        // 画像は上下逆さになる
        const vertices = new Float32Array([
            // (1) 画像の左上を　テクスチャーの左下に合わせるか？
            -1.0,
            1.0,
            0.0, // 頂点座標 x,y,z か
            0.0,
            0.0, // テクスチャー画像の x,y
            // (2) 画像の左下か
            -1.0,
            -1.0,
            0.0,
            0.0,
            1.0,
            // (3) 画像の右上か
            1.0,
            1.0,
            0.0,
            1.0,
            0.0,
            // (4) 画像の右下か
            1.0,
            -1.0,
            0.0,
            1.0,
            1.0,
        ]);

        // こうか？
        // 0    2
        // +----+
        // |  ／|
        // |／  |
        // +----+
        // 1    3
        const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);

        const vertexBuffer = createBuffer(gl.ARRAY_BUFFER, vertices);
        const indexBuffer = createBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);

        const vertexAttribLocation = gl.getAttribLocation(program, "vertexPosition");
        const textureAttribLocation = gl.getAttribLocation(program, "texCoord");

        const VERTEX_SIZE = 3;
        const TEXTURE_SIZE = 2;
        const STRIDE = (VERTEX_SIZE + TEXTURE_SIZE) * Float32Array.BYTES_PER_ELEMENT;
        const VERTEX_OFFSET = 0;
        const TEXTURE_OFFSET = 3 * Float32Array.BYTES_PER_ELEMENT;

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        gl.enableVertexAttribArray(vertexAttribLocation);
        gl.enableVertexAttribArray(textureAttribLocation);

        gl.vertexAttribPointer(vertexAttribLocation, VERTEX_SIZE, gl.FLOAT, false, STRIDE, VERTEX_OFFSET);
        gl.vertexAttribPointer(textureAttribLocation, TEXTURE_SIZE, gl.FLOAT, false, STRIDE, TEXTURE_OFFSET);

        const indexSize = indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // 描画します
        gl.drawElements(gl.TRIANGLES, indexSize, gl.UNSIGNED_SHORT, 0);
        gl.flush();
    });
}

// EOF
