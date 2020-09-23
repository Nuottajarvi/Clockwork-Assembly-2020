#version 130
uniform sampler2D titleTex;
in vec2 uv;
in vec3 n;
in float time;
flat in int objId;
in vec4 viewDir;

out vec4 FragColor;

float E = 0.001;
const float PI = 3.14159;

mat3 rotX(float r) {
	return mat3(
		vec3(1., 0., 0.),
		vec3(0., cos(r), -sin(r)),
		vec3(0., sin(r), cos(r))
	);
}

mat3 rotY(float r) {
	return mat3(
		vec3(cos(r), 0., sin(r)),
		vec3(0., 1., 0.),
		vec3(-sin(r), 0., cos(r))
	);
}

mat3 rotZ(float r) {
	return mat3(
		vec3(cos(r), -sin(r), 0.),
		vec3(sin(r), cos(r), 0.),
		vec3(0., 0., 1.)
		
	);
}

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
    if(uv.x < 0.53 && objId == 1) {
        vec2 nuv = uv * 2. + vec2(-0.5, 0.5);
        float t = max(0., time - 15.);

        float move = 1. - smoothstep(0., 1., min(1., t * .2));
        nuv -= vec2(move * .2, move * .15);
        nuv *= 5. - min(4., t);// smoothstep(0., 4., min(1., t));

        nuv *= 2.;
        nuv -= mix(vec2(sin(time)*.1, sin(time * .3)*.1), vec2(0.), min(1., time * .2));
        //start pos
        nuv *= smoothstep(0.01, 1., min(time - 1., 1.));
    
        // Time varying pixel color

        vec3 eye = vec3(0., 0.3, -time);
        //eye -= mix(
        //    vec3( 0. + sin(time / 3.) * .2, 0., 0. ),
        //    vec3( 0. ),
        //    min(1., max(0., t))
        //);
        
        float os1 = 0.;
        float phase1 = 0.;
        float os2 = 0.;
        float phase2 = 0.;
        if(time > 39.) {
            phase2 = 1.;
            os2 = 4.5;
        } else if(time > 30.) {
            os1 = 4.5;
            phase1 = 1.;
        }

        float t1 = max(0., time - 30. + os1);
        float t2 = max(0., time - 39. + os2);
        vec3 ray = rotY(-sin(t1 * PI / 11.) * phase1) * rotX(sin(t2 * PI / 8.) * phase2 * .5) * normalize(vec3(nuv, 2.));
            
        col = rayMarch(eye, ray);
        //col = vec3(, 0.);
    } else {
        vec3 lightSource = vec3(3., 2.5, 0.);
        float diffuse = dot(normalize(lightSource), n);
        vec3 viewDirN = normalize(-viewDir).xyz;
        float spec = max(0., dot(-lightSource, reflect(viewDirN, n)));
        col = vec3(diffuse * .2 + spec * .5);
    }
    //col = vec3(uv, 0.);
    // Output to screen
    col = mix(col, vec3(1.0), max(0., time - 45.));

    FragColor = vec4(col,1.0);
}