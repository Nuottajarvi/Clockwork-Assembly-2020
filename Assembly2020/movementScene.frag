#version 130

in vec2 uv;
in vec3 pos;
in vec3 nor;
in float time;

out vec4 FragColor;

float near = 0.1; 
float far  = 1.0; 
  


void main()
{    // Output to screen
    vec3 n = nor;
    vec3 lightSource = vec3(1., 3., 0.);

    float diffuse = dot(lightSource, n);

    vec3 col = vec3(0.15 + diffuse * .15);
    FragColor = vec4(col, 1.0);
    //FragColor = vec4(vec3(depth * .5), 1.0);
}