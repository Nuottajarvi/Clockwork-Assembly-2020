#version 130
uniform sampler2D noiseTex;
in vec2 uv;
in float time;

out vec4 FragColor;

float E = 0.001;
float maxd = 100.;

mat3 rotY(float a) {
	float ca = cos(a);
    float sa = sin(a);
    return mat3(
    	vec3(ca, 0., sa),
        vec3(0., 1., 0.),
        vec3(-sa, 0., ca)
    );
}

mat3 rotZ(float a) {
	float ca = cos(a);
    float sa = sin(a);
    return mat3(
    	vec3(ca, -sa, 0.),
        vec3(sa, ca, 0.),
        vec3(0., 0., 1.)
    );
}

float SDFball(vec3 p, float diameter) {
    return length(p) + E - diameter;
}


float SDFcyl(vec3 p, float diameter, float growth) {
    if(growth < E) {
    	return 1.;   
    }
   	return max(-p.y, max(p.y - growth, length(p.xz) - diameter));
}

float rand(float n) {
	return fract(sin(n * 126.123 + 231.238));   
}

vec4 SDFtree(vec3 p, float t, float seed) {
    float dist = maxd;
    vec3 np = p;
    vec3 col = vec3(0.);
    for(int i = 0; i < 6; i++) {
        float fi = float(i);
        float branches = pow(2., fi);
        int branchCount = int(floor(branches));

        float maxGrowth = 0.05;
        float growth = 0.;
        float leafGrowth = 0.;
        if(t > fi) {
            if(t < fi + 1.)
        		growth = maxGrowth * (t - fi);
            else
                growth = maxGrowth;
        }
        
        float fall = min(1., max(0., (t - fi - 1.)));
        float death = min(1., max(0., (t - 6. - 2.)));
        
        if(i == 5) {
            np.y -= growth - death * .1;
            float distCheck = SDFball(np, growth * 1.5 - death * .1);
        	dist = min(dist, distCheck);
            if(dist == distCheck) {
            	vec3 summerfall = mix(vec3(0., .3, 0.), vec3(.3, .1, 0.), fall);
            	col = mix(summerfall, vec3(0.), death);
            }
            
        } else {
        	float distCheck = SDFcyl(np, .005, growth);
        	dist = min(dist, distCheck);
            if(dist == distCheck) {
            	col = mix(vec3(0.2, 0.1, 0.05), vec3(0.1, 0.1, 0.1), death);
            }
        }
        np.x = abs(np.x);
        np.y -= maxGrowth;
		np = rotY(48. - sin(time) * .1 + fract(sin(seed * 43.2315))) * rotZ(-0.5 + fract(sin(seed * 43.2315)) * .2 + (fi + 1.) * .05 - death * .3) * np;
    }
    
    return vec4(col, dist);    
    
}

vec4 SDF(vec3 p) {
    float timing = 13.;
    p.z -= floor(time / timing) * 3.25;
  	return SDFtree(p, mod(time, timing), floor(time / timing)); 
}

vec4 rayMarch(vec3 eye, vec3 rayDir) {
	float depth = 0.;

    for(int i = 0; i < 255; i++) {
    	vec3 p = eye + rayDir * depth;
        vec4 data = SDF(p);
        if(data.w < E) {
        	return vec4(data.xyz, depth);
        }
           
        depth += data.w * .5;
        
        if(depth > maxd)
            return vec4(vec3(0.), maxd);
    }

	return vec4(vec3(0.), maxd);
}

vec3 estimateNormal(vec3 p) {
    float E = 0.01;
    return normalize(vec3(
        SDF(vec3(p.x + E, p.y, p.z)).w - SDF(vec3(p.x - E, p.y, p.z)).w,
        SDF(vec3(p.x, p.y + E, p.z)).w - SDF(vec3(p.x, p.y - E, p.z)).w,
        SDF(vec3(p.x, p.y, p.z + E)).w - SDF(vec3(p.x, p.y, p.z - E)).w
    ));
}

float PI = 3.14159;

float circle(vec2 p, float r) {
	return length(p) - r;
}

mat2 rot(float a) {
	float ca = cos(a);
    float sa = sin(a);
    return mat2(ca,sa,-sa,ca);
}

vec3 cog(vec2 p) {
    p = rot(sin(time)) * p;
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

    uv /= 3.;

    if(cog(uv).r > .5) {
    	return mix(vec3(0.), vec3(0.05), min(time, 1.) - max(0, time - 39.));
    }

    return vec3(0.);
}

void main() {
    vec3 eye = vec3(sin(time * .33 + PI + 1.) * -.6 + 0.5, .45, -4. + time * .28);
    vec3 rayDir = rotY(sin(time * .33 + PI + 1.) * -.3) * normalize(vec3(uv.x - .5, uv.y - .5, 2.));

    vec3 color = vec3(0.);

    // Time varying pixel color
    vec4 data = rayMarch(eye, rayDir);

    vec3 col = data.xyz;
    float depth = data.w;
    vec3 n = estimateNormal(eye + rayDir * depth);
    vec3 lightSource = normalize(vec3(4., -3., 0.));
    float diffuse = dot(normalize(-lightSource), n);
    
    float light = .3 + diffuse;
    col = light * col;
    
    if(depth == maxd || time > 38.) {
    	col = bgCogs(uv, 0.);   
    }

    // Output to screen
    FragColor = vec4(col,1.0);
}