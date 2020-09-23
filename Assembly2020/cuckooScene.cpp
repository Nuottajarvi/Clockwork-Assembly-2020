#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include "objReader.h"
#include "textureLoader.h"
#include <iostream>
#include "cuckooScene.h"
#include "sceneHelpers.h"

TextureArray Cuckoo::getTextures(GLuint program) {
	TextureArray textures;
	textures.push_back(loadTexture("media/cuckoo.png", "cuckooTex", program));
	return textures;
}

Scene Cuckoo::init() {
	shaderReader vertexShader = shaderReader("cuckoo.vert");
	shaderReader fragmentShader = shaderReader("cuckoo.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("antialias-post.frag");

	VertexArray vertices;
	IndiceArray indices;
	SceneHelpers::createBg(vertices, indices);

	return { 5., vertices, indices, vertexShader.source, fragmentShader.source, getTextures, post_vert.source, post_frag.source, 8 };
}