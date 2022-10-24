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
    const imagePath = "../input/texture/2016_09_texture.png";

    // テクスチャーを描きます
    glF.drawTexture(shaderScriptPaths, imagePath);
}

// EOF
