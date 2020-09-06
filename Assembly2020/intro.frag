#version 130
uniform float iTime;
uniform sampler2D titleTex;
in vec2 uv;
in vec3 hitPos;
flat in int isBg;

const float ar = 1.8;
const float E = 0.001;
const float start = 0.01;
const float end = 100.0;
const float PI = 3.14159;

out vec4 FragColor;

const vec2 titleAspect = vec2(9., 16.) * .1;

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
		p.y += iTime * .01;
		p.x += sin(iTime * .2 + r.y) * .1;
		p.x +=.05;
		float n = max(0., 1. - length(p) * 30.);
		col += n;
	}

	return col;
}

void main() {
	vec2 uv = gl_FragCoord.xy / vec2(600.);
	
	float t0 = 5.;
	float t1 = t0 + 2.05;
	float t2 = t1 + 1.9;

	//title
	vec2 texUv = uv - vec2(1., 0.8);

	if(iTime < t1 && iTime > t0) {
		texUv.y = max(texUv.y, -.3);
	} else if(iTime > t1){
		texUv.y -= .3;
		texUv.x -= .05;
		texUv.y = min(texUv.y, -.3);
	}

	//shakes
	texUv.x += sin(texUv.y * 1000. + iTime * 100.) * .005;

	texUv.y *= -1.;
	vec3 titleCol = texture(titleTex, texUv * titleAspect).rgb;
	if(titleCol.b < E && titleCol.r > 1. - E && titleCol.g > 1. - E) {
		titleCol = vec3(0.);
	}

	uv -= vec2(.7, .5);
	if(isBg == 1) {
		vec3 col = vec3(0.8);
		
		//after 12s pullup
		vec2 fuv = uv;
		vec2 bguv = uv;
		float flaketime = 13.;
		if(iTime > flaketime) {
			fuv /= 1. - (iTime - flaketime) * .3;
			bguv /= 1. - (iTime - flaketime) * .05;
		}
		col += max(vec3(0.), vec3(flakes(fuv))*.05 - vec3(max(0., (iTime - flaketime) * .03)));
		col -= length(bguv) * .3;

		if(iTime > t0 && iTime < t2) {
			col -= titleCol * .15;
		}

		gl_FragColor=vec4(col, 1.);
	} else {
		vec3 col = vec3(0.2);
		gl_FragColor = vec4(col, 1.);
	}
}