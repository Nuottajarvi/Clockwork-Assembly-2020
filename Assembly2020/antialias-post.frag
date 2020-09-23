#version 330 core
uniform sampler2D fbo_tex;
in vec2 uv;
uniform float iTime;
uniform int iPass;

out vec4 gl_FragColor;

float xoffset = 0.00025;
float yoffset = 0.00045;

void main(void) {
	//blur
	vec3 col = texture2D(fbo_tex, uv).rgb;
	for(int i = 1; i < 3; i++) {
	
		if(iPass % 2 == 0) {
			col += texture2D(fbo_tex, uv + vec2( i*xoffset, 0.)).rgb;
			col += texture2D(fbo_tex, uv + vec2(-i*xoffset, 0.)).rgb;
		} else {
			col += texture2D(fbo_tex, uv + vec2(0.,  i*yoffset)).rgb;
			col += texture2D(fbo_tex, uv + vec2(0., -i*yoffset)).rgb;
		}
	}
	gl_FragColor = vec4(col * .2, 1.);
}