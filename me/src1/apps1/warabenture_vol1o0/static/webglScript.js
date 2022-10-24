function webgl_setup(shaderScriptPaths, imagePath) {
    // Canvasを作成してbodyに追加します
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    document.body.appendChild(canvas);

    const gl = canvas.getContext("webgl2");
    const glF = WebglFacade.NewInstance(gl);

    // テクスチャーを描きます
    glF.drawTexture(shaderScriptPaths, imagePath);
}

// EOF
