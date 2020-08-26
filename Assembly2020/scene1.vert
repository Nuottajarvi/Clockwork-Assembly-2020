#version 130
uniform mat4 MVP;

attribute vec3 vWorldPos;
in vec3 vCol;
in vec3 vPos;
in vec2 vTex;
out vec2 uv;

void main()
{
    
    gl_Position = vec4(vPos, 1.0);
    uv = vTex;
}