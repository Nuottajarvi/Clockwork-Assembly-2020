#version 130
uniform mat4 MVP;
uniform float iTime;
attribute vec3 vWorldPos;
in vec3 vCol;
in vec3 vPos;
in vec2 vTex;
out vec2 uv;
flat out int isBg;

const float PI = 3.14159;

mat3 rotZ(float r) {
	float cr = cos(r);
	float sr = sin(r);
    return mat3(
        vec3(cr, -sr, 0.0),
        vec3(sr, cr, 0.0),
        vec3(0.0, 0.0, 1.0)
    );
}
void main()
{
	const float t3 = 12.;
	if(vWorldPos.x > 0.5) {
		isBg = 0;
		vec3 os = vec3(0., -8., 3.);
		float swing = sin(iTime - PI / 2.);
		//swing = -PI / 2.;
		mat3 rot = rotZ(swing);
		vec3 pos = rot * vPos - os;
		gl_Position = MVP * vec4(pos, 1.0);
	} else {
		isBg = 1;
		gl_Position = vec4(vPos, 1.);
	}
    uv = vTex;
}