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
	col.r += texture(fbo_tex, uv).r * buzzR;
	vec2 newUV = uv * 0.8 + vec2(0.4, 0.);

	if(iTime > 18 && iTime < 23) {
		float buzzG = buzz(-15. + PI);
	
		col.g += texture(fbo_tex, newUV).r * buzzG;
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

vec3 blackEffect() {
	if(length(texture(fbo_tex, uv).rgb) < 1.44) {
		return vec3(0.);
	} else {
		return vec3(1.);
	}
}

float E = 0.001;

float SDF(vec3 p){
	return length(p) - .05;
}

float rayMarch(vec3 eye, vec3 rayDir) {
	float depth = 0.;

    for(int i = 0; i < 32; i++) {
    	vec3 p = eye + rayDir * depth;
        float dist = SDF(p);
        if(dist < E) {
        	return dist;
        }
           
        depth += dist;
    }

	return 100.;
}


vec3 raymarchEffect() {
	//if(length(texture(fbo_tex, uv).rgb) < 1.4) {
   
		vec3 eye = vec3(0., 0., -2.);
		vec3 rayDir = normalize(vec3(uv.x - .5, uv.y / 1.777 - .5, 2.));
    
		vec3 color = vec3(0.);
		
		float dist = rayMarch(eye, rayDir);

		if(dist < E) {
			color = vec3(1.);
		}

		return color;
	//} else {
	//	return vec3(1.);
	//}
}

void main(void) {

	vec3 col;
	if(iTime < 10 || (iTime >= 26 && iTime < 28)) {
		col = texture(fbo_tex, uv).rgb;
	} else if(iTime >= 10 && iTime < 11) {
		col = mix(texture(fbo_tex, uv).rgb, edgeDetect(), iTime - 10.);
	} else if(iTime >= 11 && iTime < 15) {
		col = edgeDetect();
	} else if(iTime >= 15 && iTime < 16) {
		col = mix(edgeDetect(), redGreenEffect(), iTime - 15);
	} else if(iTime >= 16 && iTime < 24) {
		col = redGreenEffect();
	} else if(iTime >= 25 && iTime < 26) {
		col = mix(redGreenEffect(), texture(fbo_tex, uv).rgb, iTime - 25);
	} else if(iTime >= 28 && iTime < 28 + PI) {
		col = distortEffect();
	} else if(iTime >= 28 + PI && iTime < 33) {
		col = mix(texture(fbo_tex, uv).rgb, blackEffect(), (iTime - 28 + PI) * 0.53);
	} else if(iTime >= 33 && iTime < 34) {
		col = mix(blackEffect(), raymarchEffect(), iTime - 33);
	} else {
		col = raymarchEffect();
	}

	col = raymarchEffect();

	gl_FragColor = vec4(col, 1.);
}