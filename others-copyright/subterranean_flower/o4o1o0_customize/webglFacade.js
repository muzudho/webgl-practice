class WebglFacade {
    #gl;

    static NewInstance(gl) {
        return new WebglFacade(gl);
    }

    constructor(gl) {
        this.#gl = gl;
    }

    /**
     * WebGLにプログラムを登録する Promise を返す。
     * 引数として、シェーダーのスクリプト（ソース）を与える。
     *
     * @param {*} vertexShaderScript
     * @param {*} fragmentShaderScript
     * @returns
     */
    createShaderProgram(vertexShaderScript, fragmentShaderScript) {
        // バーテックスシェーダをコンパイルします
        const vertexShader = this.#gl.createShader(this.#gl.VERTEX_SHADER);
        this.#gl.shaderSource(vertexShader, vertexShaderScript);
        this.#gl.compileShader(vertexShader);

        const vShaderCompileStatus = this.#gl.getShaderParameter(vertexShader, this.#gl.COMPILE_STATUS);
        if (!vShaderCompileStatus) {
            const info = this.#gl.getShaderInfoLog(vertexShader);
            console.log(info);
        }

        // フラグメントシェーダについても同様にします
        const fragmentShader = this.#gl.createShader(this.#gl.FRAGMENT_SHADER);
        this.#gl.shaderSource(fragmentShader, fragmentShaderScript);
        this.#gl.compileShader(fragmentShader);

        const fShaderCompileStatus = this.#gl.getShaderParameter(fragmentShader, this.#gl.COMPILE_STATUS);
        if (!fShaderCompileStatus) {
            const info = this.#gl.getShaderInfoLog(fragmentShader);
            console.log(info);
        }

        // WebGLに渡すプログラムを作成します
        const program = this.#gl.createProgram();
        this.#gl.attachShader(program, vertexShader);
        this.#gl.attachShader(program, fragmentShader);
        this.#gl.linkProgram(program);

        const linkStatus = this.#gl.getProgramParameter(program, this.#gl.LINK_STATUS);
        if (!linkStatus) {
            const info = this.#gl.getProgramInfoLog(program);
            console.log(info);
        }

        // WebGLにプログラムを使用させます
        this.#gl.useProgram(program);

        return program;
    }

    /**
     * バッファを作成し返します
     * @param {*} type
     * @param {*} typedDataArray
     * @returns
     */
    createBuffer(type, typedDataArray) {
        const buffer = this.#gl.createBuffer();
        this.#gl.bindBuffer(type, buffer);
        this.#gl.bufferData(type, typedDataArray, this.#gl.STATIC_DRAW);
        this.#gl.bindBuffer(type, null); // バインド解除

        return buffer;
    }

    /**
     * シェーダーの外部スクリプトを読み込む Promise を返します
     * @param {*} paths ファイルパスの配列。シェーダーの外部スクリプト
     * @returns
     */
    loadShaderScripts(paths) {
        const arrayOfGetsText = paths.map((path) => fetch(path).then((res) => res.text()));

        return Promise.all(arrayOfGetsText);
    }

    /**
     * テクスチャー（画像）を読み込む Promise を返します
     * @param {*} srcUrl
     * @returns
     */
    loadTextureImage(srcUrl) {
        const texture = new Image();
        return new Promise((resolve, reject) => {
            texture.addEventListener("load", (e) => {
                resolve(texture);
            });

            texture.src = srcUrl;
        });
    }

    /**
     * テクスチャーを描きます
     * @param {*} shaderScriptPaths
     */
    drawTexture(shaderScriptPaths, imagePath) {
        // シェーダとテクスチャを読み込み終わったら開始します。
        Promise.all([this.loadShaderScripts(shaderScriptPaths), this.loadTextureImage(imagePath)]).then((assets) => {
            // ロードが終わったら取り出す
            const shaderScripts = assets[0];
            const imageForTexture = assets[1];
            const vertexShaderScript = shaderScripts[0];
            const fragmentShaderScript = shaderScripts[1];

            // WebGLに登録したプログラム
            const program = this.createShaderProgram(vertexShaderScript, fragmentShaderScript);

            //
            // テクスチャの転送
            //
            const texture = this.#gl.createTexture(); // テクスチャの作成
            this.#gl.bindTexture(this.#gl.TEXTURE_2D, texture); // テクスチャのバインド
            this.#gl.texImage2D(this.#gl.TEXTURE_2D, 0, this.#gl.RGBA, this.#gl.RGBA, this.#gl.UNSIGNED_BYTE, imageForTexture); // テクスチャデータの転送
            this.#gl.generateMipmap(this.#gl.TEXTURE_2D); // ミップマップの作成

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

            const vertexBuffer = this.createBuffer(this.#gl.ARRAY_BUFFER, vertices);
            const indexBuffer = this.createBuffer(this.#gl.ELEMENT_ARRAY_BUFFER, indices);

            const vertexAttribLocation = this.#gl.getAttribLocation(program, "vertexPosition");
            const textureAttribLocation = this.#gl.getAttribLocation(program, "texCoord");

            const VERTEX_SIZE = 3;
            const TEXTURE_SIZE = 2;
            const STRIDE = (VERTEX_SIZE + TEXTURE_SIZE) * Float32Array.BYTES_PER_ELEMENT;
            const VERTEX_OFFSET = 0;
            const TEXTURE_OFFSET = 3 * Float32Array.BYTES_PER_ELEMENT;

            this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, vertexBuffer);

            this.#gl.enableVertexAttribArray(vertexAttribLocation);
            this.#gl.enableVertexAttribArray(textureAttribLocation);

            this.#gl.vertexAttribPointer(vertexAttribLocation, VERTEX_SIZE, this.#gl.FLOAT, false, STRIDE, VERTEX_OFFSET);
            this.#gl.vertexAttribPointer(textureAttribLocation, TEXTURE_SIZE, this.#gl.FLOAT, false, STRIDE, TEXTURE_OFFSET);

            const indexSize = indices.length;
            this.#gl.bindBuffer(this.#gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

            // 描画します。
            this.#gl.drawElements(this.#gl.TRIANGLES, indexSize, this.#gl.UNSIGNED_SHORT, 0);
            this.#gl.flush();
        });
    }
}
