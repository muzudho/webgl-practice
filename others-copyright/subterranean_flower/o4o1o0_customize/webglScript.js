function init() {
    // Canvasを作成してbodyに追加します
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    document.body.appendChild(canvas);

    const gl = canvas.getContext("webgl2");
    const glF = WebglFacade.NewInstance(gl);

    // シェーダー・スクリプトのファイルパスの配列
    const shaderScriptPaths = ["../input/texture/vertex_shader.glsl", "../input/texture/fragment_shader.glsl"];

    // シェーダとテクスチャを読み込み終わったら開始します。
    Promise.all([loadShaderScripts(shaderScriptPaths), loadTextureImage("../input/texture/2016_09_texture.png")]).then((assets) => {
        // ロードが終わったら取り出す
        const shaderScripts = assets[0];
        const imageForTexture = assets[1];
        const vertexShaderScript = shaderScripts[0];
        const fragmentShaderScript = shaderScripts[1];

        // WebGLに登録したプログラム
        const program = glF.createShaderProgram(vertexShaderScript, fragmentShaderScript);

        //
        // テクスチャの転送
        //
        const texture = gl.createTexture(); // テクスチャの作成
        gl.bindTexture(gl.TEXTURE_2D, texture); // テクスチャのバインド
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageForTexture); // テクスチャデータの転送
        gl.generateMipmap(gl.TEXTURE_2D); // ミップマップの作成

        const vertices = new Float32Array([
            -1.0,
            1.0,
            0.0, // 頂点座標
            0.0,
            0.0, // テクスチャ座標
            -1.0,
            -1.0,
            0.0,
            0.0,
            1.0,
            1.0,
            1.0,
            0.0,
            1.0,
            0.0,
            1.0,
            -1.0,
            0.0,
            1.0,
            1.0,
        ]);

        const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);

        const vertexBuffer = glF.createBuffer(gl.ARRAY_BUFFER, vertices);
        const indexBuffer = glF.createBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);

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

        // 描画します。
        const indexSize = indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indexSize, gl.UNSIGNED_SHORT, 0);
        gl.flush();
    });
}

/**
 * シェーダーの外部スクリプトを読み込む Promise を返します
 * @param {*} paths ファイルパスの配列。シェーダーの外部スクリプト
 * @returns
 */
function loadShaderScripts(paths) {
    const arrayOfGetsText = paths.map((path) => fetch(path).then((res) => res.text()));

    return Promise.all(arrayOfGetsText);
}

// テクスチャー（画像）を読み込む Promise を返します。
function loadTextureImage(srcUrl) {
    const texture = new Image();
    return new Promise((resolve, reject) => {
        texture.addEventListener("load", (e) => {
            resolve(texture);
        });

        texture.src = srcUrl;
    });
}

// EOF
