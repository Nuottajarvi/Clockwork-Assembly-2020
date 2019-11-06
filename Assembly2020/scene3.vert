#version 130
uniform mat4 MVP;
uniform float iTime;
in vec3 vPos;
in vec2 vTex;
in vec3 vNor;
in vec3 vTan;
in vec3 vBitan;

out vec2 uv;
out vec3 nor;
out vec3 pos;
out vec3 tang;
out vec3 bitan;

mat3 rotX(float r) {
	return mat3(
		vec3(1., 0., 0.),
		vec3(0., cos(r), -sin(r)),
		vec3(0., sin(r), cos(r))
	);
}

mat3 rotY(float r) {
	return mat3(
		vec3(cos(r), 0., sin(r)),
		vec3(0., 1., 0.),
		vec3(-sin(r), 0., cos(r))
	);
}

mat3 rotZ(float r) {
	return mat3(
		vec3(cos(r), -sin(r), 0.),
		vec3(sin(r), cos(r), 0.),
		vec3(0., 0., 1.)
		
	);
}

void main()
{
	mat3 rot = rotX(iTime * .3)/* * rotZ(iTime * 1.) * rotY(iTime * .5)*/;
	vec3 os = vec3(0., 0., -8.);
	vec4 finalPos = MVP * vec4(rot * vPos + os, 1.0);
    gl_Position = finalPos;
	pos = finalPos.xyz;
    uv = vTex;
	nor = (MVP * vec4(rot * vNor, 1.0)).xyz;
	tang = (MVP * vec4(rot * vTan, 1.0)).xyz;
	bitan = (MVP * vec4(rot * vBitan, 1.0)).xyz;


}