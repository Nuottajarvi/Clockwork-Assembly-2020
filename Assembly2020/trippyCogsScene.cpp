#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include <iostream>
#include "textureLoader.h"
#include "trippyCogsScene.h"
#include "sceneHelpers.h"

Scene TrippyCogs::init() {
	shaderReader vertexShader = shaderReader("trippyCogs.vert");
	shaderReader fragmentShader = shaderReader("trippyCogs.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("antialias-post.frag");

	VertexArray vertices;
	IndiceArray indices;
	SceneHelpers::createBg(vertices, indices);

	return { 20., vertices, indices, vertexShader.source, fragmentShader.source, 0, post_vert.source, post_frag.source, 8 };
}