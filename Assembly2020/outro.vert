#version 130
uniform mat4 MVP;
uniform float iTime;
in int vObjId;
in vec3 vCol;
in vec3 vPos;
in vec2 vTex;
out vec2 uv;
out float time;

void main()
{
	gl_Position = vec4(vPos, 1.);
	time = iTime;
	uv = vTex;
}