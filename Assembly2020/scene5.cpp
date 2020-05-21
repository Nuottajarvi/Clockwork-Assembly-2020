#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include <iostream>
#include "textureLoader.h"
#include "scene5.h"
#include "sceneHelpers.h"

Scene Scene5::init() {
	//escapement

	shaderReader vertexShader = shaderReader("scene5.vert");
	shaderReader fragmentShader = shaderReader("scene5.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("antialias-post.frag");

	VertexArray vertices;
	IndiceArray indices;
	SceneHelpers::createBg(vertices, indices);

	return { 22.5, vertices, indices, vertexShader.source, fragmentShader.source, 0, post_vert.source, post_frag.source, 1 };
}