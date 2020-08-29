#pragma once
#include "structs.h";

void objReader(std::string name, VertexArray &vertices, IndiceArray &indices, int objIdOverride = -1);
void objReader(std::string name, VertexArray &vertices, IndiceArray &indices, Vec3 worldPos, int objIdOverride = -1);