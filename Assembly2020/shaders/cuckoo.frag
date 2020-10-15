#version 130
in vec2 uv;
in vec3 pos;
in float time;

out vec4 FragColor;

uniform sampler2D cuckooTex;

vec2 clamp(vec2 v) {
	float x = max(0., min(.99, v.x));
	float y = max(0., min(.99, v.y));

	return vec2(x, y);
}

mat2 rotate(float a) {
	return mat2(
		vec2(cos(a), -sin(a)),
		vec2(sin(a), cos(a))
	);
}

vec2 hash( vec2 x ) {
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    x = x*k + k.yx;
    return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );
}

float flakes(vec2 p){
	p.y-=1.;
	float col = 0.;
	for(float i = 0.; i < 20.; i++) {
		vec2 r = floor(vec2(i));
		p.xy += hash(r) * vec2(.5, 1.2);
		p.y += time * .01;
		p.x += sin(time * .2 + r.y) * .1;
		p.x +=.05;
		float n = max(0., 1. - length(p) * 30.);
		col += n;
	}

	return col;
}

vec3 bg() {
	vec3 col = vec3(1.);
	vec2 fuv = uv;
	vec2 bguv = uv;
	float flaketime = 13.;
	if(time > flaketime) {
		fuv /= 1. - (time - flaketime) * .3;
		bguv /= 1. - (time - flaketime) * .05;
	}
	col += max(vec3(0.), vec3(flakes(fuv))*.05 - vec3(max(0., (time - flaketime) * .03)));
	col -= length(bguv) * .2;

	return col;
}

void main() {
	vec3 col = mix(vec3(1.), bg(), min(time, 1.));

	vec2 nuv = uv - vec2(0.2 - max(0., (time - 6.5)), 0.);

	nuv /= max(1., (time - 4.) * 10.);
	
	float beakT = mod(min(time * 1.5, 6.5) * .75, 2.);
	if(beakT > 1.) {
		beakT = 2. - beakT;
	}
	float beakRot = max(0., beakT * .6);
	
	vec2 brdUv = nuv - vec2((1. - beakT) * 1.55 - 0.16, -0.08);
	vec2 buv = clamp(brdUv + vec2(0.5, 0.3));

	vec2 ubuv = brdUv;
	vec2 ubuvPivot = vec2(0.48, 0.15);
	ubuv = rotate(beakRot) * (ubuv + ubuvPivot) - ubuvPivot;
	ubuv += vec2(0.67, 0.85);
	ubuv = clamp(ubuv);

	vec2 lbuv = brdUv;
	vec2 lbuvPivot = vec2(0.48, 0.05);
	lbuv = rotate(-beakRot) * (lbuv + lbuvPivot) - lbuvPivot;
	lbuv.y = -lbuv.y;
	lbuv += vec2(0.67, 0.645);
	lbuv = clamp(lbuv);

	vec2 wuv = brdUv;
	vec2 wuvPivot = vec2(0., 0.);
	wuv = rotate(-beakRot * 1.25) * (wuv + wuvPivot) - wuvPivot;
	wuv += vec2(0.55, 0.8);
	wuv = clamp(wuv);

	vec3 body = texture(cuckooTex, vec2(buv.x, min(0.64, buv.y))).rgb;
	vec3 wing = texture(cuckooTex, vec2(max(0.33, wuv.x), max(0.64, wuv.y))).rgb;
	vec3 upperBeak = texture(cuckooTex, vec2(min(0.33, ubuv.x), max(0.64, ubuv.y))).rgb;
	vec3 lowerBeak = texture(cuckooTex, vec2(min(0.33, lbuv.x), max(0.64, lbuv.y))).rgb;

	vec3 bird = body + wing + upperBeak + lowerBeak;

	vec2 pumpUv = nuv - vec2(2., 0.);
	float dist = 100.;

	for(int i = 0; i < 8; i++) {
	
		vec2 overUv = rotate(0.3 * (1. + (1. - beakT) * 4.)) * pumpUv;
		vec2 lowerUv = rotate(-0.3 * (1. + (1. - beakT) * 4.)) * pumpUv;
		dist = min(dist, max(abs(overUv.x), abs(overUv.y * 10.)) - .15);
		dist = min(dist, max(abs(lowerUv.x), abs(lowerUv.y * 10.)) - .15);
		pumpUv.x += 0.25 - (1. - beakT) * .22;
	}

	if(dist < 0.) {
		col = vec3(0.);
	} else if(length(bird) > 1.0) {
		col = vec3(0.);
	}
	
	FragColor = vec4(col, 1.0);
}