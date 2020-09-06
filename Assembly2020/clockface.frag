#version 130
uniform sampler2D noiseTex;
in vec2 uv;
in float time;
flat in int objId;

out vec4 FragColor;

float E = 0.001;

mat2 rot(float a) {
	float ca = cos(a);
    float sa = sin(a);
    return mat2(ca,sa,-sa,ca);
}

vec2 SDF(vec3 p) {
    p.xy *= rot(p.z * .2 + time*.2);
    vec3 op = p;
    p = mod(p, vec3(1.));
    p -= vec3(0.5);
    
    p.xy *= rot(p.x * .1 + p.z * .2 + time*.4);
    
    p = abs(p);
    float f = fract(sin(dot(floor(op.xy), vec2(56.125, 34.124))));
    return vec2(max(p.x, max(p.y, p.z)) - .2, f);
}

vec3 rayMarch(vec3 eye, vec3 ray) {
    float depth = 0.;
    
    for(int i = 0; i < 250 && depth < 20.; i++) {
    	vec3 p = eye + ray * depth;
        
        vec2 data = SDF(p);
        float dist = data.x;
        
        if(dist < E) {
            vec3 col = mix(
                vec3(0., 0.25, 0.3) + data.y * .1,
                vec3(1.,1.,0.),
                pow(fract(1. - (data.y * 25. + time * .2 + depth / 50.)), 8.));

            //return vec3(data.y);
        	return vec3(1. - depth*.05) * col;   
        }
        
        depth+=dist;
    }
    
    return vec3(0.);
}

void main() {
    vec3 col;
    if(uv.x < 0.55) {
        vec2 nuv = uv * 2. + vec2(-0.5, 0.5);
        nuv *= 2.;
        //nuv -= vec2(sin(time)*.1, sin(time * .3)*.1);

        nuv *= smoothstep(0.01, 1., min(time - 1., 1.));
    
        // Time varying pixel color

        vec3 eye = vec3(0., 0.3, -time);
        vec3 ray = normalize(vec3(nuv, 2.));
    
        col = rayMarch(eye, ray);
        //col = vec3(, 0.);
    } else {
        col = vec3(1., 0., 0.);
    }
    //col = vec3(uv, 0.);
    // Output to screen
    FragColor = vec4(col,1.0);
}