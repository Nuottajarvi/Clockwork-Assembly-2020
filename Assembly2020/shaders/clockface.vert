#version 130
uniform float iTime;
uniform mat4 MVP;
in vec3 vPos;
in vec3 vNor;
in vec2 vTex;
in int vObjId;

flat out int objId;
out vec2 uv;
out vec3 n;
out float time;
out vec4 viewDir;

const float PI = 3.14159;

mat3 rotZ(float r) {
	return mat3(
		vec3(cos(r), -sin(r), 0.),
		vec3(sin(r), cos(r), 0.),
		vec3(0., 0., 1.)
		
	);
}

void main()
{
    vec3 pos = vPos;
    if(vObjId == 1) {
        pos.y -= 2.;
        gl_Position = MVP * vec4(pos, 1.0);
    } else if(vObjId == 2) {
        pos *= .33;
		float swing = sin((iTime * PI * .5) - PI / 2.);
        mat3 rot = rotZ(swing * .5);
		pos = rot * pos;
        gl_Position = MVP * vec4(pos, 1.0);
    } else if(vObjId == 3) {
        vec3 os = vec3(-0.000168, -1.1693, 1.6943);
        pos -= os.xzy;
        if(iTime > 15.)
            pos *= rotZ(-iTime * .125);
        pos += os.xzy - vec3(0., 2., 0.);
        gl_Position = MVP * vec4(pos, 1.0);
    } else if(vObjId == 4) {
        vec3 os = vec3(-0.000168, -1.1693, 1.6943);
        pos -= os.xzy;
        if(iTime > 15.)
            pos *= rotZ(-iTime * 1.5);
        pos += os.xzy - vec3(0., 2., 0.);
        gl_Position = MVP * vec4(pos, 1.0);
    } else {
        pos.x *= 1.7777;
        pos.z -= .75;
        gl_Position = MVP * vec4(pos, 1.0);
    }
    uv = vTex;
    uv.y = -uv.y;
    time = iTime;
    objId = vObjId;
    n = vNor;   
    viewDir = MVP * vec4(pos, 1.0);
}