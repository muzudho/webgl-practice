#version 300 es
// ↑ 一行目に必ず書きます。
// OpenGL ES 3.0（WebGL2）の機能を使うことを明示しています。

// float（単制度浮動小数点）の精度を指定します。
// これは必須です。
// lowp, midiump, highpなどありますが、
// 特別な理由がない限りhighpでいいでしょう。
precision highp float;

// テクスチャー
uniform sampler2D tex;
in vec2 textureCoord;
out vec4 fragmentColor;

void main() {
  fragmentColor = texture(tex, textureCoord);
}
