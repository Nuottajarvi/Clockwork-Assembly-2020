#include "sceneHelpers.h"

void SceneHelpers::createBg(VertexArray& vertices, IndiceArray& indices) {
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