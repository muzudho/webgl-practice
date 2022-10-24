class WebglFacade {
    #gl;

    static NewInstance(gl) {
        return new WebglFacade(gl);
    }

    constructor(gl) {
        this.#gl = gl;
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
