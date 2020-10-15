#version 330 core
uniform sampler2D fbo_tex;
in vec2 uv;
uniform float iTime;
uniform int iPass;

out vec4 gl_FragColor;

float os = 0.0005;
float PI = 3.14159;

mat3 edgeDetectionMatrix = mat3(
	vec3(-1., -1., -1.),
	vec3(-1., 8., -1.),
	vec3(-1., -1., -1.)
);

float applyMatrix(mat3 mat, vec2 nuv) {

	float total = 0.;
	for(int x = -1; x <= 1; x++) {
		for(int y = -1; y <= 1; y++) {
			vec3 col = texture2D(fbo_tex, nuv + vec2(x * os, y * os)).rgb;
			float avg = (col.r + col.g + col.b) / 3.;
			total += avg * mat[x + 1][y + 1];
		}
	}
	return total;
}

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float buzz(float os) {
	return sin(iTime + os) + random2(vec2(iTime)).x;
}

vec3 redGreenEffect() {
	if(/*white bg*/length(texture(fbo_tex, uv)) > 1.44) {
		return vec3(0.);
	}
	vec3 col = vec3(0.);

	float buzzR = buzz(-15.);
	float red = texture(fbo_tex, uv).r * buzzR;
	col += vec3(red, red * 1/4, red * 1/4);
	vec2 newUV = uv * 0.8 + vec2(0., 0.);

	if(iTime > 18 && iTime < 23) {
		float buzzG = buzz(-15. + PI);
	
		col.g += texture(fbo_tex, newUV).r * buzzG * .5;
		col.b += texture(fbo_tex, newUV).r * buzzG * .5;
	}
	return col;
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

vec3 edgeDetect() {
	float light = applyMatrix(edgeDetectionMatrix, uv);
	return vec3(1. - light);
}

vec3 distortEffect() {
	float total = 0;
	vec2 currUV = uv;

	for(int i = 0; i < 8; i++) {
		total += noise(currUV);
		currUV *= 1.7;
		currUV.x += 35.;
		currUV.y += 25.;
	}
	float amt = total * 0.01;
	float fadein = mix(0., amt, sin(iTime - 28));
	vec3 col = texture(fbo_tex, uv + fadein).rgb;
	return col;
}

/* RAYMARCH */

float E = 0.001;
float maxd = 100.;

/* return normal and dist */
vec4 SDF(vec3 p){
    p.xyz = mod(p.xyz, vec3(.25, .25, .5));
    
    
    p -= vec3(.125, .125, .25);
    
	return vec4(normalize(p), length(p) - .05);
}

vec4 rayMarch(vec3 eye, vec3 rayDir) {
	float depth = 0.;

    for(int i = 0; i < 255; i++) {
    	vec3 p = eye + rayDir * depth;
        vec4 data = SDF(p);
        if(data.w < E) {
        	return vec4(data.xyz, depth);
        }
           
        depth += data.w;
        
        if(depth > maxd)
            return vec4(vec3(0.), maxd);
    }

	return vec4(vec3(0.), maxd);
}

vec3 raymarchEffect()
{  
	if(length(texture(fbo_tex, uv).rgb) < 1.4) {
    
		vec3 eye = vec3(iTime * .25, 0., -2. + iTime);
		vec3 rayDir = normalize(vec3(uv.x - .5, uv.y / 1.777 - .5, 2.));

		vec3 color = vec3(0.);

		// Time varying pixel color
		vec4 data = rayMarch(eye, rayDir);
		vec3 col = vec3(data.w * .1);

		vec3 n = data.rgb;
    
		vec3 lightSource = normalize(vec3(4., 0., -8.));
		float diffuse = dot(normalize(-lightSource), n);
		vec3 viewDir = normalize(-rayDir);
		vec3 reflectDir = reflect(lightSource, n); 
		float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.);
    
		col += vec3(max(0., diffuse * .5 + spec * .5));
    
		return col;
	} else {
		return vec3(1.);
	}
}

void main(void) {

	vec3 col;
	if(iTime < 10 || (iTime >= 25 && iTime < 28) || (iTime >= 28 + PI && iTime < 32)) {
		col = texture(fbo_tex, uv).rgb;
	} else if(iTime >= 10 && iTime < 11) {
		col = mix(texture(fbo_tex, uv).rgb, edgeDetect(), iTime - 10.);
	} else if(iTime >= 11 && iTime < 15) {
		col = edgeDetect();
	} else if(iTime >= 15 && iTime < 16) {
		col = mix(edgeDetect(), redGreenEffect(), iTime - 15);
	} else if(iTime >= 16 && iTime < 24.5) {
		col = redGreenEffect();
	} else if(iTime >= 24.5 && iTime < 25.5) {
		col = mix(redGreenEffect(), texture(fbo_tex, uv).rgb, iTime - 24);
	} else if(iTime >= 28 && iTime < 28 + PI) {
		col = distortEffect();
	} else if(iTime >= 32 && iTime < 34) {
		col = texture(fbo_tex, uv).rgb;
	} else if(iTime >= 34 && iTime < 38) {
		col = texture(fbo_tex, uv).rgb;
	} else if(iTime >= 38 && iTime < 41) {
		col = mix(texture(fbo_tex, uv).rgb, raymarchEffect(), (iTime - 38) * .33);
	} else if(iTime >= 41 && iTime < 60) {
		col = raymarchEffect();
	} else if(iTime >= 60 && iTime < 63) {
		col = mix(raymarchEffect(), vec3(1.), (iTime - 60) * .33);
	} else {
		col = vec3(1.);
	}

	gl_FragColor = vec4(col, 1.);
}