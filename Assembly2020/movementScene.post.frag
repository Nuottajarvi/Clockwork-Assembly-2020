#version 330 core
uniform sampler2D fbo_tex;
in vec2 uv;
uniform float iTime;
uniform int iPass;

out vec4 gl_FragColor;

float os = 0.0005;
float PI = 3.14159;

mat3 edgeDetectionMatrix = mat3(
	vec3(-1., -1., -1.),
	vec3(-1., 8., -1.),
	vec3(-1., -1., -1.)
);

float applyMatrix(mat3 mat, vec2 nuv) {

	float total = 0.;
	for(int x = -1; x <= 1; x++) {
		for(int y = -1; y <= 1; y++) {
			vec3 col = texture2D(fbo_tex, nuv + vec2(x * os, y * os)).rgb;
			float avg = (col.r + col.g + col.b) / 3.;
			total += avg * mat[x + 1][y + 1];
		}
	}
	return total;
}

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float buzz(float os) {
	return sin(iTime + os) + random2(vec2(iTime)).x;
}

vec3 redGreenEffect() {
	vec3 col = vec3(0.);

	float buzzR = buzz(PI);
	col.r += texture(fbo_tex, uv).r * buzzR;
	vec2 newUV = uv * 0.8 + vec2(0.4, 0.);

	float buzzG = buzz(0.);
	
	col.g += texture(fbo_tex, newUV).r * buzzG;

	return col;
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

vec3 edgeDetect() {
	float light = applyMatrix(edgeDetectionMatrix, uv);
	return vec3(1. - light);
}

vec3 distortEffect() {
	float total = 0;
	vec2 currUV = uv;

	for(int i = 0; i < 8; i++) {
		total += noise(currUV);
		currUV *= 1.7;
		currUV.x += 35.;
		currUV.y += 25.;
	}
	vec3 col = texture(fbo_tex, uv + total * 0.01).rgb;
	return col;
}

void main(void) {

	vec3 col = texture(fbo_tex, uv).rgb;
	//vec3 col = vec3(1. - light) - texture(perlinTex, uv).rgb;
	//vec3 col = drawnEffect();

	//vec3 col = vec3(1., 0., 0.) + texture(perlinTex, uv / vec2(1., 1.7777)).rgb + vec3(light);

	gl_FragColor = vec4(col, 1.);
}