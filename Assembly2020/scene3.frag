#version 130

in vec2 uv;
in vec3 nor;
in vec3 pos;
in vec3 tang;
in vec3 bitan;


const float ar = 1.8;
const float E = 0.001;
const float start = 0.01;
const float end = 100.0;
const float PI = 3.14159;
uniform sampler2D cubeTex;
uniform sampler2D normalTex;

out vec4 FragColor;

vec3 normalMap() {
	
	vec3 tex = texture(normalTex, uv).rgb;

	mat3 TBN = transpose(mat3(
		tang,
		bitan,
		nor
	));
	vec3 N = normalize((tex - vec3(0.5)) * 2.);
	return TBN * N;
}

void main() {
    // Output to screen

	vec3 lightDir = vec3(0., -6., 0.);

	vec3 n = normalMap();
	//n = nor;

	float diff = max(0., dot(n, lightDir));

	vec3 tex = texture(cubeTex, uv).rgb;

	vec3 viewDir = normalize(pos);
    vec3 specularDir = reflect(normalize(lightDir), n);
    float specular = pow(max(dot(viewDir, specularDir), 0.0), 13.);
	float light = .4 + diff * .1;
	vec3 col =  tex * light;

	FragColor = vec4(col, 1.0);
}