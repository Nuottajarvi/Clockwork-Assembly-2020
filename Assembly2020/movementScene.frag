#version 130

in vec2 uv;
in vec3 pos;
in vec3 nor;
in float time;

out vec4 FragColor;

void main()
{    // Output to screen
    vec3 n = nor;
    FragColor = vec4(abs(n), 1.0);
}