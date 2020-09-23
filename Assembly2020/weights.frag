#version 130

in vec2 uv;
in vec3 pos;
in float time;

const float ar = 1.8;
const float E = 0.001;
const float start = 0.01;
const float end = 100.0;
const float PI = 3.14159;
uniform sampler2D metalTex;
uniform sampler2D noiseTex;

out vec4 FragColor;

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

float SDFcylinder(vec3 p, out float y) {
	y = p.y;
	return max(length(p.xz) - .3, abs(p.y) - .8);
}

float SDFlink(vec3 p, bool twist)
{
	p = p.yxz;
	float le = 0.1;
	float r1 = 0.08;
	float r2 = 0.03;
	if(twist) {
		p = p.zyx;
	}
	vec3 q = vec3( p.x, max(abs(p.y)-le,0.0), p.z );
	return length(vec2(length(q.xy)-r1,q.z)) - r2;
}

float SDFchain(vec3 p)
{
	float smallest = 99.;
	for(int i = 0; i < 10; i++) {
		bool twist = false;
		if(i % 2 == 0) {
			twist = true;
		}
		float dist = SDFlink(p + vec3(0.31 * i, 0., 0.), twist);
		if(dist < smallest) {
			smallest = dist;
		}
	}

	return smallest;
}

float SDFweight(vec3 p, out float y) {
	vec3 rotp = rotY(time * .4) * p;
	return min(SDFchain(rotp.yxz + vec3(.85, 0., 0.)), SDFcylinder(p, y));
}

float SDF(vec3 p, out float y) {
	vec3 cylinder0pos = vec3(-1., -2. + time * .33, 0.);
	vec3 cylinder1pos = vec3(1., 2. - time * .33, 0.);

	float y0, y1;
	float weight0 = SDFweight(p - cylinder0pos, y0);
	float weight1 = SDFweight(p - cylinder1pos, y1);

	if(weight0 < weight1) {
		y = y0;
		return weight0;
	} else {
		y = y1;
		return weight1;
	}
}

float rayMarch(vec3 eye, vec3 ray, out float y) {
	float depth = 0.;
	for(int i = 0; i < 255; i++) {
		vec3 p = eye + ray * depth;

		float dist = SDF(p, y);

		if(dist < E) {
			return depth;
		} else if(dist > end) {
			return end;
		}
		depth += dist;
	}
	return end;
}

vec3 estimateNormal(vec3 p) {
    float E = 0.1;
	float y;
    return normalize(vec3(
        SDF(vec3(p.x + E, p.y, p.z), y) - SDF(vec3(p.x - E, p.y, p.z), y),
        SDF(vec3(p.x, p.y + E, p.z), y) - SDF(vec3(p.x, p.y - E, p.z), y),
        SDF(vec3(p.x, p.y, p.z + E), y) - SDF(vec3(p.x, p.y, p.z - E), y)
    ));
}

//mod but every other round is to other direction
float wrap(float t) {
	float modulo = mod(t, 1.);
	float multiplier = floor(t);
	if(mod(multiplier, 2.) != 0) {
		return 1 - modulo;
	} else {
		return modulo;
	}
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
    float nx = noise((uv + vec2(time * .1)) * .1 + vec2(0.2, 0.1)).r;
    float ny = noise((uv + vec2(time * .1)) * .1 + vec2(0.3, 0.6)).r;
    vec2 os = vec2(nx, ny);
    return noise(uv*.07 + os*.03) * .2; 
}

void main() {
    // Output to screen
	vec3 lightDir = vec3(-4., 0., -3.);
	vec3 eye = vec3(0., 0., -8. + pow(max(0., (time - 8.) * 3.), 2.));
	vec3 ray = normalize(vec3(uv, 2.));

	float y;
	float dist = rayMarch(eye, ray, y);

	vec3 col = vec3(0.);
	//weights
	if(dist < end - E) {
		vec3 p = eye + ray * dist;
		vec3 n = estimateNormal(p);
		float diffuse = max(0., dot(n, normalize(lightDir)));
		vec3 viewDir = normalize(-ray);
		vec3 reflectDir = normalize(reflect(-lightDir, n));  
        float specular = pow(max(dot(viewDir, reflectDir), 0.), 7.);

		float light = 0.4 + diffuse * 2. + specular * 3.;

		vec2 mov;
		if(uv.x > 0.)
			mov = vec2(time * .04, time * .065);
		else
			mov = vec2(time * .04, time * -.065);

		vec2 texUV;
		if(y < -.81)
			texUV = (uv + vec2(0.9, 0.5)) / vec2(1.8, 1.) + mov;
		else
			texUV = (vec2(uv.x + 0.9 / 1.8, y)) + vec2(time * .04, 0.);

		texUV.x = wrap(texUV.x);
		texUV.y = wrap(texUV.y);

		vec3 tex = texture(metalTex, texUV).rgb;

		tex = vec3(p.y * .3 + .2, .2, 0.2) * tex;

		col = tex * vec3(light);
	//bg
	} else {
		col = bgNoise(uv);
	}

	col = mix(vec3(.2), col, min(1., time));
	
	FragColor = vec4(col, 1.0);
}