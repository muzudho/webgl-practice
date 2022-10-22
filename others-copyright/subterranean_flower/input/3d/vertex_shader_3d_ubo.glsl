#version 300 es
// ↑ 一行目に必ず書きます。
// OpenGL ES 3.0（WebGL2）の機能を使うことを明示しています。

// JavaScriptから入力される値を、inで宣言します。
// 今回は「頂点座標」と「頂点色」のふたつを用います。
// 頂点座標：x,y,zの3要素のベクトル
// 頂点色：r,g,b,alphaの4要素のベクトル
in vec3 vertexPosition;
in vec4 color;

layout(std140) uniform Matrices {
    mat4 model;
    mat4 view;
    mat4 projection;
};

// このシェーダからフラグメントシェーダに対して出力する変数を
// outで宣言します。
out vec4 vColor;

void main() {
  // 頂点色を何も処理せずにそのままフラグメントシェーダへ出力します。
  vColor = color;

  gl_Position = projection * view * model * vec4(vertexPosition, 1.0);
}