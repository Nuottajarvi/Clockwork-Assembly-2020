#version 130

in vec2 uv;
in vec3 pos;
in float time;

const float ar = 1.8;
const float E = 0.001;
const float start = 0.01;
const float end = 10.0;
const float PI = 3.14159;
uniform sampler2D metalTex;

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

float SDFcylinder(vec3 p) {
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

float SDFweight(vec3 p) {
	vec3 rotp = rotY(time * .4) * p;
	return min(SDFchain(rotp.yxz + vec3(.85, 0., 0.)), SDFcylinder(p));
}

float SDF(vec3 p) {
	vec3 cylinder0pos = vec3(-1., -2. + time * .25, 0.);
	vec3 cylinder1pos = vec3(1., 2. - time * .25, 0.);

	return min(SDFweight(p - cylinder0pos), SDFweight(p - cylinder1pos));
}

float rayMarch(vec3 eye, vec3 ray) {
	float depth = 0.;
	for(int i = 0; i < 255; i++) {
		vec3 p = eye + ray * depth;

		float dist = SDF(p);

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
    return normalize(vec3(
        SDF(vec3(p.x + E, p.y, p.z)) - SDF(vec3(p.x - E, p.y, p.z)),
        SDF(vec3(p.x, p.y + E, p.z)) - SDF(vec3(p.x, p.y - E, p.z)),
        SDF(vec3(p.x, p.y, p.z + E)) - SDF(vec3(p.x, p.y, p.z - E))
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

void main() {
    // Output to screen
	vec3 lightDir = vec3(-4., 0., -3.);
	vec3 eye = vec3(0., 0., -8.);
	vec3 ray = normalize(vec3(uv, 2.));

	eye = eye;
	ray = ray;

	float dist = rayMarch(eye, ray);

	vec3 col = vec3(0.);
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
			mov = vec2(time * .04, time * .07);
		else
			mov = vec2(time * .04, time * -.07);

		vec2 texUV = (uv + vec2(0.9, 0.5)) / vec2(1.8, 1.) + mov;

		texUV.x = wrap(texUV.x);
		texUV.y = wrap(texUV.y);

		vec3 tex = texture(metalTex, texUV).rgb;

		tex = vec3(p.y * .3 + .2, .2, 0.2) * tex;

		col = tex * vec3(light);
	}
	
	FragColor = vec4(col, 1.0);
}