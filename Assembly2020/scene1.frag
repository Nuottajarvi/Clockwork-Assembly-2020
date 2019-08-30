#version 130
uniform float iTime;

uniform sampler2D unoTex;
uniform sampler2D dosTex;

in vec2 uv;

const float ar = 1.8;
const float EPSILON = 0.001;
const float start = 0.01;
const float end = 100.0;
const float PI = 3.14159;

out vec4 FragColor;

void main() {
    // Output to screen
	vec3 col = texture(unoTex, uv).rgb;
	col += texture(dosTex, uv).rgb;
    FragColor = vec4(col,1.0);
}