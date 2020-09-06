#version 130
uniform float iTime;
uniform mat4 MVP;
in vec3 vPos;
in vec2 vTex;
in int vObjId;

flat out int objId;
out vec2 uv;
out float time;

void main()
{
    if(vObjId == 1) {
        vec3 pos = vPos;
        pos.y -= 2.;
        gl_Position = MVP * vec4(pos, 1.0);
    } else {
        vec3 pos = vPos;
        pos.x *= 1.7777;
        pos.z -= .75;
        gl_Position = MVP * vec4(pos, 1.0);
    }
    uv = vTex;
    uv.y = -uv.y;
    time = iTime;
    objId = vObjId;
}