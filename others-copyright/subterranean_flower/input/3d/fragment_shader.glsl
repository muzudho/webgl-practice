#version 300 es
// ↑ 一行目に必ず書きます。
// OpenGL ES 3.0（WebGL2）の機能を使うことを明示しています。

// float（単制度浮動小数点）の精度を指定します。
// これは必須です。
// lowp, midiump, highpなどありますが、
// 特別な理由がない限りhighpでいいでしょう。
precision highp float;

// バーテックスシェーダから受け取る変数を
// inで宣言します。
in vec4 vColor;

// 画面に出力する色の変数を宣言しておく。
// r,g,b,alphaのvec4。
out vec4 fragmentColor;

void main() {
  // 特に何も処理せずそのまま色を出力する。
  fragmentColor = vColor;
}