#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include <iostream>
#include "textureLoader.h"
#include "scene6.h"
#include "sceneHelpers.h"

Scene Scene6::init() {
	//escapement

	shaderReader vertexShader = shaderReader("scene6.vert");
	shaderReader fragmentShader = shaderReader("scene6.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("antialias-post.frag");

	VertexArray vertices;
	IndiceArray indices;
	SceneHelpers::createBg(vertices, indices);

	return { 142000., vertices, indices, vertexShader.source, fragmentShader.source, 0, 0, post_vert.source, post_frag.source, 1 };
}