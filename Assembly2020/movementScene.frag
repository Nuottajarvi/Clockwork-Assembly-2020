#version 130

in vec2 uv;
in vec3 pos;
in vec3 nor;
in float time;

out vec4 FragColor;

float near = 0.1; 
float far  = 1.0; 
  
float LinearizeDepth(float depth) 
{
    float z = depth * 2.0 - 1.0; // back to NDC 
    return (2.0 * near * far) / (far + near - z * (far - near));	
}

void main()
{    // Output to screen
    vec3 n = nor;
    float depth = LinearizeDepth(gl_FragCoord.z);
    depth = gl_FragCoord.z;
    FragColor = vec4(abs(n), 1.0);
    //FragColor = vec4(vec3(depth * .5), 1.0);
}