class WebglFacade {
    #gl;

    static NewInstance(gl) {
        return new WebglFacade(gl);
    }

    constructor(gl) {
        this.#gl = gl;
    }

    /**
     * シェーダーのスクリプト（ソース）からシェーダプログラムを作成する Program を返します
     * @param {*} vsSource
     * @param {*} fsSource
     * @returns
     */
    createShaderProgram(vsSource, fsSource) {
        // バーテックスシェーダをコンパイルします。
        const vertexShader = this.#gl.createShader(this.#gl.VERTEX_SHADER);
        this.#gl.shaderSource(vertexShader, vsSource);
        this.#gl.compileShader(vertexShader);

        const vShaderCompileStatus = this.#gl.getShaderParameter(vertexShader, this.#gl.COMPILE_STATUS);
        if (!vShaderCompileStatus) {
            const info = this.#gl.getShaderInfoLog(vertexShader);
            console.log(info);
        }

        // フラグメントシェーダについても同様にします。
        const fragmentShader = this.#gl.createShader(this.#gl.FRAGMENT_SHADER);
        this.#gl.shaderSource(fragmentShader, fsSource);
        this.#gl.compileShader(fragmentShader);

        const fShaderCompileStatus = this.#gl.getShaderParameter(fragmentShader, this.#gl.COMPILE_STATUS);
        if (!fShaderCompileStatus) {
            const info = this.#gl.getShaderInfoLog(fragmentShader);
            console.log(info);
        }

        // シェーダプログラムを作成します。
        const program = this.#gl.createProgram();
        this.#gl.attachShader(program, vertexShader);
        this.#gl.attachShader(program, fragmentShader);
        this.#gl.linkProgram(program);

        const linkStatus = this.#gl.getProgramParameter(program, this.#gl.LINK_STATUS);
        if (!linkStatus) {
            const info = this.#gl.getProgramInfoLog(program);
            console.log(info);
        }

        // プログラムを使用します。
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
}
