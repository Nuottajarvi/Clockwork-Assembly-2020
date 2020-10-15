#version 130

uniform mat4 MVP;
uniform float iTime;
in vec3 vPos;
in vec2 vTex;

out vec2 uv;
out float time;

void main()
{
    gl_Position = vec4(vPos, 1.0);
    uv = vTex - vec2(0.9, 0.5);
    time = iTime;
}