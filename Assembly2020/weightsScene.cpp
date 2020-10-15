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
	shaderReader vertexShader = shaderReader("shaders/weights.vert");
	shaderReader fragmentShader = shaderReader("shaders/weights.frag");

	shaderReader post_vert = shaderReader("shaders/post.vert");
	shaderReader post_frag = shaderReader("shaders/antialias-post.frag");

	VertexArray vertices;
	IndiceArray indices;
	SceneHelpers::createBg(vertices, indices);

	return { 10., vertices, indices, vertexShader.source, fragmentShader.source, getTextures, post_vert.source, post_frag.source, 8 };
}