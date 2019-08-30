#pragma once

namespace Scene2 {
	void createBg(VertexArray &vertices, IndiceArray &indices);
	TextureArray getTextures(GLuint program);
	Scene init();
}