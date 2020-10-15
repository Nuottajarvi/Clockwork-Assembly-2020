#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include <iostream>
#include "textureLoader.h"
#include "objReader.h"
#include "introScene.h"
#include "sceneHelpers.h"

TextureArray IntroScene::getTextures(GLuint program) {
	TextureArray textures;
	textures.push_back(loadTexture("media/title.png", "titleTex", program));
	return textures;
}

Scene IntroScene::init() {
	shaderReader vertexShader = shaderReader("shaders/intro.vert");
	shaderReader fragmentShader = shaderReader("shaders/intro.frag");

	shaderReader post_vert = shaderReader("shaders/post.vert");
	shaderReader post_frag = shaderReader("shaders/intro.post.frag");

	VertexArray vertices;
	IndiceArray indices;

	SceneHelpers::createBg(vertices, indices);
	objReader("media/pendulum.obj", vertices, indices, 1);
	objReader("media/clock.obj", vertices, indices, 2);

	glDisable(GL_DEPTH_TEST);

	return { 15.6, vertices, indices, vertexShader.source, fragmentShader.source, getTextures, post_vert.source, post_frag.source, 1 };
}