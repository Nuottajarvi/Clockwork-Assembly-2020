#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include <iostream>
#include "textureLoader.h"
#include "objReader.h"
#include "outroScene.h"
#include "sceneHelpers.h"

TextureArray Outro::getTextures(GLuint program) {
	TextureArray textures;
	textures.push_back(loadTexture("media/title.png", "titleTex", program));
	return textures;
}

Scene Outro::init() {
	shaderReader vertexShader = shaderReader("outro.vert");
	shaderReader fragmentShader = shaderReader("outro.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("intro.post.frag");

	VertexArray vertices;
	IndiceArray indices;

	SceneHelpers::createBg(vertices, indices);

	return { 8., vertices, indices, vertexShader.source, fragmentShader.source, getTextures, post_vert.source, post_frag.source, 1 };
}