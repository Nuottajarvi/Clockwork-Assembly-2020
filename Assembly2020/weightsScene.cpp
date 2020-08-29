#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include "objReader.h"
#include "textureLoader.h"
#include <iostream>
#include "weightsScene.h"
#include "sceneHelpers.h"

TextureArray Weights::getTextures(GLuint program) {
	TextureArray textures;
	textures.push_back(loadTexture("media/metal.png", "metalTex", program));
	textures.push_back(loadTexture("media/noise.png", "noiseTex", program));
	return textures;
}

Scene Weights::init() {
	//weights

	shaderReader vertexShader = shaderReader("weights.vert");
	shaderReader fragmentShader = shaderReader("weights.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("antialias-post.frag");

	VertexArray vertices;
	IndiceArray indices;
	SceneHelpers::createBg(vertices, indices);

	return { 8., vertices, indices, vertexShader.source, fragmentShader.source, getTextures, post_vert.source, post_frag.source, 1 };
}