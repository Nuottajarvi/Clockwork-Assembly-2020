#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include "objReader.h"
#include "textureLoader.h"
#include <iostream>
#include "normalmap.h"

TextureArray Normalmap::getTextures(GLuint program) {
	TextureArray textures;
	textures.push_back(loadTexture("media/cube.png", "cubeTex", program));
	textures.push_back(loadTexture("media/testnormal.png", "normalTex", program));
	return textures;
}

Scene Normalmap::init() {

	shaderReader vertexShader = shaderReader("scene3.vert");
	shaderReader fragmentShader = shaderReader("scene3.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("antialias-post.frag");


	VertexArray vertices;
	IndiceArray indices;
	objReader("media/cube.obj", vertices, indices, { 1, 0, 0 });

	return { 142000., vertices, indices, vertexShader.source, fragmentShader.source, getTextures, 0, post_vert.source, post_frag.source, 1 };
}