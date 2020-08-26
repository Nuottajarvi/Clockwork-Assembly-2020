#version 330 core
uniform sampler2D fbo_tex;
uniform sampler2D perlinTex;
in vec2 uv;
uniform float iTime;
uniform int iPass;

out vec4 gl_FragColor;

float os = 0.0005;

mat3 edgeDetectionMatrix = mat3(
	vec3(-1., -1., -1.),
	vec3(-1., 8., -1.),
	vec3(-1., -1., -1.)
);

float applyMatrix(mat3 mat) {

	float total = 0.;
	for(int x = -1; x <= 1; x++) {
		for(int y = -1; y <= 1; y++) {
			vec3 col = texture2D(fbo_tex, uv + vec2(x * os, y * os)).rgb;
			float avg = (col.r + col.g + col.b) / 3.;
			total += avg * mat[x + 1][y + 1];
		}
	}
	return total;
}

void main(void) {
	float light = applyMatrix(edgeDetectionMatrix);

	//vec3 col = vec3(1. - light) - texture(perlinTex, uv).rgb;

	vec3 col = vec3(
		texture(perlinTex, uv * 3).r,
		texture(fbo_tex, uv * 2).b,
		0.
	);

	//vec3 col = vec3(1., 0., 0.) + texture(perlinTex, uv / vec2(1., 1.7777)).rgb + vec3(light);

	gl_FragColor = vec4(col, 1.);
}