#version 130
in float time;
uniform sampler2D titleTex;
in vec2 uv;
out vec4 gl_FragColor;

const vec2 titleAspect = vec2(9., 16.) * .1;
const float E = 0.001;


void main() {
	vec2 uv = gl_FragCoord.xy / vec2(600.);
	
	
	//title
	vec2 texUv = uv - vec2(1.2, 1.1);

	//texUv.y -= .3;
	//texUv.x -= .05;
	//texUv.y = min(texUv.y, -.3);
	
	texUv.y = max(texUv.y, -.3);
	//shakes
	texUv.x += sin(texUv.y * 1000. + time * 100.) * .005;

	texUv.y *= -1.;
	vec3 col = vec3(1.);
	vec3 tex;
	if(time < 5.)
		tex = texture(titleTex, texUv * titleAspect).rgb;

	if(col.b < E && col.r > 1. - E && col.g > 1. - E) {
		col = vec3(0.8);
	}

	if(texUv.x > 0. && texUv.y > 0. && texUv.x < 1. && texUv.y < 1.) {
		if(length(tex) > 0.5)
			col = vec3(0.6);
	}

	col = mix(vec3(1.), col, sin(time));

	col = mix(col, vec3(0.), max(0., time - 5.));

	gl_FragColor = vec4(col, 1.);
}