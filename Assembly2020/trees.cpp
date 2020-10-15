#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include <iostream>
#include "textureLoader.h"
#include "treeScene.h"
#include "sceneHelpers.h"

TextureArray Trees::getTextures(GLuint program) {
	TextureArray textures;
	textures.push_back(loadTexture("media/noise.png", "noiseTex", program));
	return textures;
}

Scene Trees::init() {

	shaderReader vertexShader = shaderReader("shaders/trees.vert");
	shaderReader fragmentShader = shaderReader("shaders/trees.frag");

	shaderReader post_vert = shaderReader("shaders/post.vert");
	shaderReader post_frag = shaderReader("shaders/antialias-post.frag");

	VertexArray vertices;
	IndiceArray indices;
	SceneHelpers::createBg(vertices, indices);

	return { 31.5, vertices, indices, vertexShader.source, fragmentShader.source, getTextures, post_vert.source, post_frag.source, 8 };
}