#version 130

in vec2 uv;
in vec3 pos;
in float time;

const float ar = 1.8;
const float E = 0.001;
const float start = 0.01;
const float end = 100.0;
const float PI = 3.14159;
uniform sampler2D noiseTex;

out vec4 FragColor;

mat2 rot(float a) {
	float ca = cos(a);
    float sa = sin(a);
    return mat2(ca,sa,-sa,ca);
}

float circle(vec2 p, float r)
{
    return length(p) - r;
}

float escapement(vec2 p)
{ 
    float t = time * 2.;
    vec2 os = vec2(0., 0.45);
    vec2 np = p - os;
    np = rot(sin(t / PI * 5.) * .1) * np;
        
    if(abs(np.x) < 0.03 && np.y < -0.001) {
    	return -1.;   
    }
    
    if(atan(np.y / abs(np.x)) > -.23 + (.2 - length(np))) {
    	return 1.;   
    }
    if(atan(np.y / abs(np.x)) < -.4 && length(np) < .363 - abs(np.x) * .24 + abs(np.y) * .10) {
    	return 1.;   
    }

    return circle(p - os, .323);
}

float cross2d(vec2 v0, vec2 v1) {
	return v0.x * v1.y - v0.y * v1.x;   
}


float teeth(vec2 p, float edge)
{
    if(length(p) < edge || length(p) > edge + 0.1) {
    	return 1.;   
    }
    return mod(atan(p.y / p.x), .242) - (edge - length(p)) - 0.1;
}

float pins(vec2 p, float edge0, float edge1)
{
    if(length(p) < edge0 || length(p) > edge1) {
    	return 1.;   
    }
    return mod(atan(p.y / p.x), 1.) - length(p) - .1;
}

float escapementCog(vec2 uv)
{
    float t = (time - .3) * 2.06;
    if(mod(t, 2.) < .5) {
    	t = floor(t / 2.) + (t - floor(t)) * 2.;
    } else if(mod(t, 2.) > .5 && mod(t, 2.) < 1.) {
        t = floor(t + 1.5) / 2.;
    } else {
    	t = floor(t + 1.) / 2.;
    }
    
    uv = rot(t * .121 + 0.03) * uv;
    float edge0 = .05;
    float edge1 = .27;
    float pins = pins(uv, edge0, edge1);
    float outerRing = max(-circle(uv, edge1), circle(uv, .3));
    float innerRing = max(-circle(uv, .04), circle(uv, edge0));
    float teeth = teeth(uv, edge1);
    return min(teeth, min(pins, min(outerRing, innerRing)));
}

vec3 noise(vec2 uv) {
    uv*=.4;
    vec3 col;
    const float r = 5.;
    for(float f = 1.; f <= r; f+=1.) {
        uv*=f;
    	col += texture(noiseTex, mod(uv, vec2(1.))).rrr;
    }
    col /= r;
    return col;
}

vec3 bgNoise(vec2 uv) {
    float t = time + 10.;
    float nx = noise((uv + vec2(t * .1)) * .1 + vec2(0.2, 0.1)).r;
    float ny = noise((uv + vec2(t * .1)) * .1 + vec2(0.3, 0.6)).r;
    vec2 os = vec2(nx, ny);
    vec3 turqoise = vec3(0.8, 1.2, 1.2);
    float diff = .4 * smoothstep(0., 1., max(0., (time - 1.) * .25));
    return noise(uv*.07 + os*.03) * .2 * vec3(1. - diff, 1. + diff, 1. + diff); 
}


void main()
{
    // Time varying pixel color
    float distCog = escapementCog(uv);
    float distEsc = escapement(uv);
    vec2 flippedUV = vec2(uv.x, -uv.y);
    vec3 col = bgNoise(flippedUV);
    if(distCog < 0.) {
    	col += vec3(0.6 * smoothstep(0., 1., time * .25));
    } else if(distEsc < 0.) {
        col += vec3(0.2 * smoothstep(0., 1., time * .25));
    }

    col -= smoothstep(0., 1., max(0., (time - 10.) * .5));

    // Output to screen
    FragColor = vec4(col,1.0);
}