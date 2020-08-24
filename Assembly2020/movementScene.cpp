#include <vector>
#include <iostream>
#include "shaderReader.h"
#include "structs.h"
#include "textureLoader.h"
#include "movementScene.h"
#include "objReader.h"

Scene MovementScene::init() {
	//escapement

	shaderReader vertexShader = shaderReader("movementScene.vert");
	shaderReader fragmentShader = shaderReader("movementScene.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("antialias-post.frag");

	VertexArray vertices;
	IndiceArray indices;
	objReader("./media/movement.obj", vertices, indices);

	return { 142000., vertices, indices, vertexShader.source, fragmentShader.source, 0, post_vert.source, post_frag.source, 1 };
}