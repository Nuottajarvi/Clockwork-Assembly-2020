#version 130

in vec2 uv;
in vec3 pos;
in vec3 nor;
in vec3 tang;
in vec3 bitan;
in vec4 viewDir;
in float time;
uniform sampler2D metalTex;
uniform sampler2D metalNormalTex;
uniform sampler2D metalSpecTex;

out vec4 FragColor;

float near = 0.1; 
float far  = 1.0; 
  
vec3 normalMap() {
	
	vec3 tex = texture(metalNormalTex, uv).rgb;

	mat3 TBN = mat3(
		normalize(tang),
		normalize(bitan),
		normalize(-nor)
	);
	vec3 N = -normalize((tex - vec3(0.5)) * .05);
	return TBN * N;
}

void main()
{    // Output to screen
    vec3 n = normalMap();
    vec3 lightSource = vec3(3., 2.5, 0.);
    float diffuse = dot(normalize(lightSource), n);
    vec3 viewDirN = normalize(-viewDir).xyz;
    float spec = max(0., dot(-lightSource, reflect(viewDirN, n))) + texture(metalSpecTex, uv).r * .1 - .8;

    
    vec3 col;
    if(time > 34) {
        col = vec3(0.);
    } else if(time > 32 && time <= 34) {
        col = mix(vec3(0.5 + diffuse * .2 + spec * .5), vec3(0.), (time - 32) * .5);
    } else if(time < 10.9 || time >= 24.5) {
        col = vec3(0.5 + diffuse * .2 + spec * .5);
    } else if(time < 11.4) {
        col = mix(vec3(0.5 + diffuse * .2 + spec * .5), abs(nor), (time - 10.9) * 2);
    } else {
        col = abs(nor);
    }

    FragColor = vec4(col, 1.0);
}