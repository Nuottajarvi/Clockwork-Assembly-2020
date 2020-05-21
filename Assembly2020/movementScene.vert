#version 130
uniform mat4 MVP;
uniform float iTime;
in vec3 vPos;
in vec3 vNor;
in vec2 vTex;

out vec2 uv;
out float time;
out vec3 nor;

void main()
{
    vec3 pos = vPos.xzy;
    gl_Position = MVP * vec4(pos, 1.0);
    time = iTime;
    nor = vNor;
}