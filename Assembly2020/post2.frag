#version 330 core
uniform sampler2D fbo_tex;
in vec2 uv;
uniform float iTime;
uniform int iPass;

out vec4 gl_FragColor;

void main(void) {
	vec3 col = texture2D(fbo_tex, uv).rgb;
	gl_FragColor = vec4(col, 1.);
}