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
	//intro, pendulum

	shaderReader vertexShader = shaderReader("intro.vert");
	shaderReader fragmentShader = shaderReader("intro.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("intro.post.frag");

	VertexArray vertices;
	IndiceArray indices;

	SceneHelpers::createBg(vertices, indices);
	objReader("media/pendulum.obj", vertices, indices, 1);
	objReader("media/automatabottom.obj", vertices, indices, 2);

	glDisable(GL_DEPTH_TEST);

	return { 19., vertices, indices, vertexShader.source, fragmentShader.source, getTextures, post_vert.source, post_frag.source, 1 };
}