#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include <iostream>
#include "textureLoader.h"
#include "objReader.h"
#include "scene2.h"
#include "sceneHelpers.h"

TextureArray Scene2::getTextures(GLuint program) {
	TextureArray textures;
	textures.push_back(loadTexture("media/title.png", "titleTex", program));
	return textures;
}

Scene Scene2::init() {
	//intro, pendulum

	shaderReader vertexShader = shaderReader("scene2.vert");
	shaderReader fragmentShader = shaderReader("scene2.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("post2.frag");

	VertexArray vertices;
	IndiceArray indices;

	SceneHelpers::createBg(vertices, indices);
	objReader("media/pendulum.obj", vertices, indices, { 1, 0, 0 });
	objReader("media/automatabottom.obj", vertices, indices, { -1, 0, 0 });

	return { 21.5, vertices, indices, vertexShader.source, fragmentShader.source, getTextures, post_vert.source, post_frag.source, 1 };
}