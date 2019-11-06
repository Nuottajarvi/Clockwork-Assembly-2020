#pragma once
#include "structs.h";

void objReader(std::string name, VertexArray &vertices, IndiceArray &indices);
void objReader(std::string name, VertexArray &vertices, IndiceArray &indices, Vec3 worldPos);