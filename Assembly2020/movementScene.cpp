#include <vector>
#include <iostream>
#include "shaderReader.h"
#include "structs.h"
#include "textureLoader.h"
#include "movementScene.h"
#include "objReader.h"

TextureArray MovementScene::getTextures(GLuint program) {
	TextureArray textures;
	textures.push_back(loadTexture("media/Metal/Metal_scratched_003_COLOR.png", "metalTex", program));
	textures.push_back(loadTexture("media/Metal/Metal_scratched_003_NRM.png", "metalNormalTex", program));
	textures.push_back(loadTexture("media/Metal/Metal_scratched_003_SPEC.png", "metalSpecTex", program));
	return textures;
}

Scene MovementScene::init() {
	//escapement

	shaderReader vertexShader = shaderReader("shaders/movementScene.vert");
	shaderReader fragmentShader = shaderReader("shaders/movementScene.frag");

	shaderReader post_vert = shaderReader("shaders/post.vert");
	shaderReader post_frag = shaderReader("shaders/movementScene.post.frag");

	VertexArray vertices;
	IndiceArray indices;
	objReader("./media/movement.obj", vertices, indices);

	glEnable(GL_DEPTH_TEST);

	return { 63., vertices, indices, vertexShader.source, fragmentShader.source, getTextures, post_vert.source, post_frag.source, 1 };
}