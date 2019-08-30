#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include <iostream>
#include "textureLoader.h"
#include "objReader.h"
#include "scene2.h"

TextureArray Scene2::getTextures(GLuint program) {
	TextureArray textures;
	textures.push_back(loadTexture("media/title.png", "titleTex", program));
	return textures;
}

void Scene2::createBg(VertexArray &vertices, IndiceArray &indices) {
	VertexArray bgVertices{
		{ -1.f, -1.f, 0.f,		 0.f,  1.f,		0.f, 0.f, 0.f,		0.f, 0.f, 0.f  },
		{ -1.f,  1.f, 0.f,		 0.f,  0.f,		0.f, 0.f, 0.f,		0.f, 0.f, 0.f  },
		{  1.f,  1.f, 0.f,		 1.8f, 0.f,		0.f, 0.f, 0.f,		0.f, 0.f, 0.f  },
		{  1.f, -1.f, 0.f,		 1.8f, 1.f,		0.f, 0.f, 0.f,		0.f, 0.f, 0.f  }
	};
	vertices.insert(vertices.end(), bgVertices.begin(), bgVertices.end());

	IndiceArray bgIndices = { 0,1,2,2,3,0 };
	indices.insert(indices.end(), bgIndices.begin(), bgIndices.end());
}

Scene Scene2::init() {

	shaderReader vertexShader = shaderReader("scene2.vert");
	shaderReader fragmentShader = shaderReader("scene2.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("post2.frag");

	VertexArray vertices;
	IndiceArray indices;

	createBg(vertices, indices);
	objReader("media/pendulum.obj", vertices, indices, { 1, 0, 0 });

	return { 42.159, vertices, indices, vertexShader.source, fragmentShader.source, getTextures, post_vert.source, post_frag.source, 1 };
}