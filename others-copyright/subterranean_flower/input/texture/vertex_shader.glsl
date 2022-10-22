#version 300 es
// ↑ 一行目に必ず書きます。
// OpenGL ES 3.0（WebGL2）の機能を使うことを明示しています。

// JavaScriptから入力される値を、inで宣言します。
// 今回は「頂点座標」と「頂点色」のふたつを用います。
// 頂点座標：x,y,zの3要素のベクトル
// 頂点色：r,g,b,alphaの4要素のベクトル
in vec3 vertexPosition;

// テクスチャーの座標
in vec2 texCoord;

out vec2 textureCoord;

void main() {
  // そのまま処理します
  textureCoord = texCoord;

  gl_Position = vec4(vertexPosition, 1.0);
}
