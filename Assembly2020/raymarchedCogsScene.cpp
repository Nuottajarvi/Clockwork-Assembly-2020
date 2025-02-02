#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include <iostream>
#include "textureLoader.h"
#include "raymarchedCogsScene.h"
#include "sceneHelpers.h"

Scene RaymarchedCogs::init() {
	shaderReader vertexShader = shaderReader("shaders/raymarchedCogs.vert");
	shaderReader fragmentShader = shaderReader("shaders/raymarchedCogs.frag");

	shaderReader post_vert = shaderReader("shaders/post.vert");
	shaderReader post_frag = shaderReader("shaders/antialias-post.frag");

	VertexArray vertices;
	IndiceArray indices;
	SceneHelpers::createBg(vertices, indices);

	return { 22.5, vertices, indices, vertexShader.source, fragmentShader.source, 0, post_vert.source, post_frag.source, 8 };
}