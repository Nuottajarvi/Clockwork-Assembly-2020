#version 130

in vec2 uv;
in vec3 pos;
in float time;

out vec4 FragColor;

const float PI = 3.14159;

float rand(float r) {
    return fract(cos(fract(sin(r * 1035.2134)) * 31.15132));
}

mat2 rot(float a) {
	float ca = cos(a);
    float sa = sin(a);
    return mat2(ca,sa,-sa,ca);
}


float circle(vec2 p, float r) {
	return length(p) - r;
}

vec3 cog(vec2 p) {
    
    p = rot(time) * p;
    vec2 rp = vec2(atan(p.x, p.y) + PI, length(p) * 10.);
    
    //teeth circle
    
    float r = 0.22 + max(-0.015, min(0.015, cos(rp.x * 10.) * 0.02));
	float tc = circle(p, r);
    
    //inner circles
    float ic = 9.;
    for(float i = 0.; i < 5.; i+=1.) {
    	ic = min(
            ic,
            circle(rp - vec2(PI/5.+PI/5.*2.*i,1.2), .4)
        );
    }
    
    //center circle
    float cc = circle(p, 0.02);
    
    if(tc < 0. && ic > 0. && cc > 0.) {
        return vec3(1.);
    }
    
    return vec3(0.);
}

vec3 bgCogs(vec2 uv, float timeOS) {
    uv*=2.;
    float s = 0.5;
    vec2 ouv = uv;
    uv = mod(uv, vec2(0.5)) - s*.5;
    if(abs(mod(floor(ouv.x / s), 2.) - mod(floor(ouv.y / s), 2.)) < 0.5) {
    	timeOS += PI / 2.;   
    }
    float brightness = sin(time * .3 + timeOS) * .01;
    if(cog(uv).r > .5) {
    	return vec3(brightness + 0.01);   
    }
    return vec3(0.01);
}

vec3 shakeCogs(vec2 uv) {
    vec3 col = vec3(0.);
    uv.x+=0.5;
    uv.x -= .8;
    for(float i = 0.; i < 5.; i+=1.) {
        uv.x*=-1.;
        uv /= time * .2;
        uv.x += i * .1;
        float os = rand(floor(time * 20.)) * .03 - .01;

        col.r += cog(uv).r * .33;
        uv.x+=os;
        col.g += cog(uv).g * .33;
        uv.x+=os;
        col.b += cog(uv).b * .33;
        
        col /= time * .15;
    }
    
    return col;
}

vec3 lightCogs(vec2 uv, float st ) { //st = start time
    
    vec3 col = vec3(0.);
    vec3 hue = vec3(.5, .5, .1);
    for(float i = 0.; i < 7.; i++) {
        uv.x -= time * .02 * i;
        uv.x += i * .3;
        uv *= -1.;
        uv /= (time - 10.)*.2;
        col += cog(uv) * min(1., max(0., time - st - i)) * hue;
        col -= cog(uv) * min(1., max(0., time - st - 10. - i)) * hue;
        
        hue.rgb = hue.gbr;
    }
    return col;
}

vec3 cogs(vec2 uv) {
    vec3 col = vec3(0.);
    
    col += mix(vec3(0.), bgCogs(uv, 0.), min(1., time));
    
    col += mix(vec3(0.), bgCogs(uv + vec2(0.125), PI / 4.), min(1., time));
    
    //psychedelic color cogs
    if(time < 15.){
    	col += shakeCogs(uv);
    }
    //light cogs
    float t0 = 10.;
    if(time > t0) {
    	col += lightCogs(uv, t0);   
    }
    
    if(time > 19.7) {
    	return vec3(1.);   
    }
    
    return col;
}

void main()
{
    // Time varying pixel color
    vec3 col = cogs(uv);

    // Output to screen
    FragColor = vec4(col,1.0);
}