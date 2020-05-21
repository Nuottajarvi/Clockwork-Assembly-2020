#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include <iostream>
#include "textureLoader.h"
#include "scene4.h"
#include "sceneHelpers.h"

TextureArray Scene4::getTextures(GLuint program) {
	TextureArray textures;
	textures.push_back(loadTexture("media/noise.png", "noiseTex", program));
	return textures;
}


Scene Scene4::init() {
	//escapement

	shaderReader vertexShader = shaderReader("scene4.vert");
	shaderReader fragmentShader = shaderReader("scene4.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("antialias-post.frag");

	VertexArray vertices;
	IndiceArray indices;
	SceneHelpers::createBg(vertices, indices);

	return { 12., vertices, indices, vertexShader.source, fragmentShader.source, getTextures, post_vert.source, post_frag.source, 1 };
}