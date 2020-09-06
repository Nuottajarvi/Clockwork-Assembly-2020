#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include <iostream>
#include "textureLoader.h"
#include "clockfaceScene.h"
#include "sceneHelpers.h"
#include "objReader.h"

TextureArray Clockface::getTextures(GLuint program) {
	TextureArray textures;
	//textures.push_back(loadTexture("media/noise.png", "noiseTex", program));
	return textures;
}

Scene Clockface::init() {

	shaderReader vertexShader = shaderReader("clockface.vert");
	shaderReader fragmentShader = shaderReader("clockface.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("antialias-post.frag");

	VertexArray vertices;
	IndiceArray indices;
	//SceneHelpers::createBg(vertices, indices);
	objReader("media/clock.obj", vertices, indices, 1);

	return { 40., vertices, indices, vertexShader.source, fragmentShader.source, getTextures, post_vert.source, post_frag.source, 1 };
}