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
	textures.push_back(loadTexture("media/title.png", "titleTex", program));
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
	objReader("media/pendulum.obj", vertices, indices, 2);
	objReader("media/hourhand.obj", vertices, indices, 3);
	objReader("media/minutehand.obj", vertices, indices, 4);

	return { 47., vertices, indices, vertexShader.source, fragmentShader.source, getTextures, post_vert.source, post_frag.source, 8 };
}