#include <vector>
#include "shaderReader.h"
#include "structs.h"
#include <iostream>
#include "textureLoader.h"
#include "scene1.h"

TextureArray Scene1::getTextures(GLuint program) {
	TextureArray textures;
	textures.push_back(loadTexture("media/unoTex.png", "unoTex", program));
	textures.push_back(loadTexture("media/dosTex.png", "dosTex", program));
	return textures;
}

Scene Scene1::init() {

	shaderReader vertexShader = shaderReader("scene1.vert");
	shaderReader fragmentShader = shaderReader("scene1.frag");

	shaderReader post_vert = shaderReader("post.vert");
	shaderReader post_frag = shaderReader("antialias-post.frag");

	VertexArray vertices{
		{ -1.f, -1.f, 0.f,		 0.f,  1.f,		0.f, 0.f, 0.f,		0.f, 0.f, 0.f  },
		{ -1.f,  1.f, 0.f,		 0.f,  0.f,		0.f, 0.f, 0.f,		0.f, 0.f, 0.f  },
		{  1.f,  1.f, 0.f,		 1.8f, 0.f,		0.f, 0.f, 0.f,		0.f, 0.f, 0.f  },
		{  1.f, -1.f, 0.f,		 1.8f, 1.f,		0.f, 0.f, 0.f,		0.f, 0.f, 0.f  }
	};

	IndiceArray indices{ 0, 1, 2, 2, 3, 0 };

	return { 142000., vertices, indices, vertexShader.source, fragmentShader.source, getTextures, 0, post_vert.source, post_frag.source, 1 };
}