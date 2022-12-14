// ð [WebGL2å¥é ãã¯ã¹ãã£ç·¨](https://sbfl.net/blog/2016/09/08/webgl2-tutorial-texture/)

function init() {
    // Canvasãä½æãã¦bodyã«è¿½å ãã¾ãã
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    document.body.appendChild(canvas);

    const gl = canvas.getContext("webgl2");

    // ã·ã§ã¼ããèª­ã¿è¾¼ã¿Promiseãè¿ãã¾ãã
    function loadShaders() {
        const loadVertexShader = fetch("../input/texture/vertex_shader.glsl").then((res) => res.text());
        const loadFragmentShader = fetch("../input/texture/fragment_shader.glsl").then((res) => res.text());
        return Promise.all([loadVertexShader, loadFragmentShader]);
    }

    // ãã¯ã¹ãã£ãèª­ã¿è¾¼ã¿Promiseãè¿ãã¾ãã
    function loadTextureImage(srcUrl) {
        const texture = new Image();
        return new Promise((resolve, reject) => {
            texture.addEventListener("load", (e) => {
                resolve(texture);
            });

            texture.src = srcUrl;
        });
    }

    // ã·ã§ã¼ãã®ã½ã¼ã¹ããã·ã§ã¼ããã­ã°ã©ã ãä½æãã
    // Programãè¿ãã¾ãã
    function createShaderProgram(vsSource, fsSource) {
        // ãã¼ããã¯ã¹ã·ã§ã¼ããã³ã³ãã¤ã«ãã¾ãã
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vsSource);
        gl.compileShader(vertexShader);

        const vShaderCompileStatus = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
        if (!vShaderCompileStatus) {
            const info = gl.getShaderInfoLog(vertexShader);
            console.log(info);
        }

        // ãã©ã°ã¡ã³ãã·ã§ã¼ãã«ã¤ãã¦ãåæ§ã«ãã¾ãã
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fsSource);
        gl.compileShader(fragmentShader);

        const fShaderCompileStatus = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
        if (!fShaderCompileStatus) {
            const info = gl.getShaderInfoLog(fragmentShader);
            console.log(info);
        }

        // ã·ã§ã¼ããã­ã°ã©ã ãä½æãã¾ãã
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linkStatus) {
            const info = gl.getProgramInfoLog(program);
            console.log(info);
        }

        // ãã­ã°ã©ã ãä½¿ç¨ãã¾ãã
        gl.useProgram(program);

        return program;
    }

    // ãããã¡ãä½æãè¿ãã¾ãã
    function createBuffer(type, typedDataArray) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, typedDataArray, gl.STATIC_DRAW);
        gl.bindBuffer(type, null); // ãã¤ã³ãè§£é¤

        return buffer;
    }

    // ã·ã§ã¼ãã¨ãã¯ã¹ãã£ãèª­ã¿è¾¼ã¿çµãã£ããéå§ãã¾ãã
    Promise.all([loadShaders(), loadTextureImage("../input/texture/2016_09_texture.png")]).then((assets) => {
        const shaderSources = assets[0];
        const imageForTexture = assets[1];

        const vertexShaderSource = shaderSources[0];
        const fragmentShaderSource = shaderSources[1];

        const program = createShaderProgram(vertexShaderSource, fragmentShaderSource);

        //
        // ãã¯ã¹ãã£ã®è»¢é
        //
        const texture = gl.createTexture(); // ãã¯ã¹ãã£ã®ä½æ
        gl.bindTexture(gl.TEXTURE_2D, texture); // ãã¯ã¹ãã£ã®ãã¤ã³ã
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageForTexture); // ãã¯ã¹ãã£ãã¼ã¿ã®è»¢é
        gl.generateMipmap(gl.TEXTURE_2D); // ããããããã®ä½æ

        //    Y
        //  0.0 +----+----+
        //      |    |    |
        //  0.0 +----+----+
        //      |    |    |
        // -1.0 +----+----+
        //   -1.0  0.0  1.0 X
        //
        // ç»åã¯ä¸ä¸éãã«ãªã
        const vertices = new Float32Array([
            // (1) ç»åã®å·¦ä¸ãããã¯ã¹ãã£ã¼ã®å·¦ä¸ã«åããããï¼
            -1.0,
            1.0,
            0.0, // é ç¹åº§æ¨ x,y,z ã
            0.0,
            0.0, // ãã¯ã¹ãã£ã¼ç»åã® x,y
            // (2) ç»åã®å·¦ä¸ã
            -1.0,
            -1.0,
            0.0,
            0.0,
            1.0,
            // (3) ç»åã®å³ä¸ã
            1.0,
            1.0,
            0.0,
            1.0,
            0.0,
            // (4) ç»åã®å³ä¸ã
            1.0,
            -1.0,
            0.0,
            1.0,
            1.0,
        ]);

        // ãããï¼
        // 0    2
        // +----+
        // |  ï¼|
        // |ï¼  |
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

        // æç»ãã¾ã
        gl.drawElements(gl.TRIANGLES, indexSize, gl.UNSIGNED_SHORT, 0);
        gl.flush();
    });
}

// EOF
