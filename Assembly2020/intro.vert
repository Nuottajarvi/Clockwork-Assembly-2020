#version 130
uniform mat4 MVP;
uniform float iTime;
in int vObjId;
in vec3 vCol;
in vec3 vPos;
in vec2 vTex;
out vec2 uv;
out vec3 hitPos;
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
	if(/*isPendulum*/vObjId == 1) {
		isBg = 0;
		vec3 os = vec3(0., -8., 5.);
		float swing = sin((iTime * PI * .5) - PI / 2.);
		//swing = -PI / 2.;
		mat3 rot = rotZ(swing * .75);
		vec3 pos = rot * vPos - os;
		gl_Position = MVP * vec4(pos, 1.0);
	} else if(/*isBase*/vObjId == 2) {
		isBg = 0;
		vec3 os = vec3(0., -3., 2.);
		vec3 pos = vPos * 4. - os;
		hitPos = pos;
		gl_Position = MVP * vec4(pos, 1.0);
	} else {
		isBg = 1;
		gl_Position = vec4(vPos, 1.);
	}
    uv = vTex;
	uv.y = -uv.y;
}