#version 130

in vec2 uv;
in vec3 pos;
in float time;

const float ar = 1.8;
const float E = 0.001;
const float start = 0.01;
const float end = 100.0;
const float PI = 3.14159;

out vec4 FragColor;

mat3 rotationMatrixY(float rad) {
    return mat3(
        vec3(cos(rad), 0.0, sin(rad)),
        vec3(0.0, 1.0, 0.0),
        vec3(-sin(rad), 0.0, cos(rad))
    );
}

mat3 rotationMatrixX(float rad) {
    return mat3(
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, cos(rad), -sin(rad)),
        vec3(0.0, sin(rad), cos(rad))
    ); 
}

mat3 rotationMatrixZ(float rad) {
    return mat3(
        vec3(cos(rad), -sin(rad), 0.0),
        vec3(sin(rad), cos(rad), 0.0),
        vec3(0.0, 0.0, 1.0)
    );
}

mat2 rot(float a) {
	float ca = cos(a);
    float sa = sin(a);
    return mat2(ca,sa,-sa,ca);
}

float cylinder(vec3 p, float r, float h) {
	return max(length(p.xz) - r, abs(p.y) - h ); 
}

float ball(vec3 p) {
	return length(p) - .1;
}

float os0(float r) {
	return sin(r * 10.)*.05;
}

float cog(vec3 p, float dir) {
    p.xz = rot(dir * time) * p.xz;
    float os = os0(atan(p.x, p.z));
    return max(
        cylinder(p, 0.5 + os, 0.2),
    	-cylinder(p, 0.2 + sin(time - 1.)*.05, 0.3)    
    );
}

float SDF(vec3 p) {
    float s = 1.;
    
    float dir = floor(mod(p.x, s * 2.) / s) * 2. - 1.;
    dir *= floor(mod(p.z, s * 2.) / s) * 2. - 1.;
    
    p.xz = mod(p.xz, s) - s*.5;   
    
	return cog(p, dir);   
}

float reflectionRayMarch(vec3 orig, vec3 ray) {
    float depth = 0.;
	for(int i = 0; i < 128 && depth < 15.; i++) {
		vec3 p = orig + ray * depth;
		float dist = SDF(p);

		if(dist < E) {
			return 1.;
		}
        depth += dist;
	}
    
    return 0.;
}

vec3 rayMarch(vec3 eye, vec3 ray, float t0) {

	float depth = 0.;
	for(int i = 0; i < 128 && depth < 15.; i++) {
		vec3 p = eye + ray * depth;
		float dist = SDF(p);

		if(dist < E) {
			return vec3(depth - 5.5 + t0) * .2;
		}
        depth += dist;
	}
    
    return vec3(0.);
}

void main()
{
    float t = time + 2.;
    float t0 = max(0., t - 20.)*(t - 20.)*.5;
    mat3 rot = rotationMatrixX(3.8 + t * .01) * rotationMatrixZ(12.8 + sin(time * .1)*.7);
	vec3 eye = rot * vec3(t0 * -.035, 3. - t * .2 + t0 * -.03, -6. + t0);
	vec3 ray = rot * normalize(vec3(uv, 2.));
	vec3 col = rayMarch(eye, ray, t0);
	FragColor = vec4(col, 1.0);
}