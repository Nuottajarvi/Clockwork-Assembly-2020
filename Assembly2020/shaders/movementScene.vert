#version 130
uniform mat4 MVP;
uniform float iTime;

in vec3 vWorldPos;
in vec3 vPos;
in vec3 vNor;
in vec3 vTan;
in vec3 vBitan;
in vec2 vTex;
in int vObjId;

out vec2 uv;
out float time;
out vec3 nor;
out vec3 tang;
out vec3 bitan;
out vec4 viewDir;

mat3 rotX(float r) {
	float cr = cos(r);
	float sr = sin(r);
    return mat3(
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, cr, -sr),
        vec3(0.0, sr, cr)
    );
}

mat3 rotY(float r) {
	float cr = cos(r);
	float sr = sin(r);
    return mat3(
        vec3(cr, 0.0, sr),
        vec3(0.0, 1.0, 0.0),
        vec3(-sr, 0.0, cr)
    );
}

mat3 rotZ(float r) {
	float cr = cos(r);
	float sr = sin(r);
    return mat3(
        vec3(cr, -sr, 0.0),
        vec3(sr, cr, 0.0),
        vec3(0.0, 0.0, 1.0)
    );
}

vec3 cog1pos = vec3(2.0646, 2.91054, -0.13979);
vec3 cog3pos = vec3(2.6985, -0.10824, 0.013319);
vec3 cog4pos = vec3(1.0742, -2.8914, 0.032694);

void main()
{
    vec3 pos = vPos;
    float t = iTime * .5;
    if(vObjId == 1) {
        pos = rotY(t * 1.5 - 0.17) * (pos - cog1pos.xzy) + cog1pos.xzy + vec3(.055, 0., 0.);
        nor = rotY(t * 1.5 - 0.17) * vNor;
    }
    else if(vObjId == 2) {
        pos = rotY(t / 4. + 0.01) * pos;
        nor = rotY(t / 4. + 0.01) * vNor;
    }
    else if(vObjId == 3) {
        pos = rotY(-t - 0.15) * (pos - cog3pos.xzy) + cog3pos.xzy;
        nor = rotY(-t - 0.15) * vNor;
    }
    else if(vObjId == 4) {
        pos = rotY(-t * 2.66667 / 4. + 0.01) * (pos - cog4pos.xzy) + cog4pos.xzy;
        nor = rotY(-t * 2.66667 / 4. + 0.01) * vNor;
    }
    pos = pos.xzy;
    gl_Position = MVP * vec4(pos, 1.0);
    viewDir = MVP * vec4(pos, 1.0);
    time = iTime;
    uv = vTex;
    tang = vTan;
    bitan = vBitan;
    //MVPnor.xyz;
}