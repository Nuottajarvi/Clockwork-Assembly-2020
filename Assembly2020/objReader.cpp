#include <fstream>
#include <iostream>
#include <string>
#include <vector>
#include <array>
#include <algorithm>
#include "structs.h"
#include "objReader.h"

void objReader(std::string name, VertexArray &vertices, IndiceArray &indices) {
	objReader(name, vertices, indices, { 0, 0, 0 });
}

struct Tangents {
	Vec3 tangent;
	Vec3 bitangent;
};

Tangents calculateTangents(std::vector<Vec3>& vertices, std::array<unsigned int, 3>& vertexIndices, std::vector<Vec2>& uvs, std::array<unsigned int, 3>& uvIndices);

std::string shiftWord(std::string& str) {
	int index = str.find(" ");
	std::string word = str.substr(0, index);
	str = str.substr(index + 1);
	return word;
}

float getFloat(std::string& str) {
	std::string num = shiftWord(str);

	try {
		float f = std::stof(num);
		return f;
	}
	catch (std::invalid_argument err) {
		std::cerr << "Invalid OBJ file. Parsing to float failed: " << str << "\n";
		return 0;
	}
}

float getInt(std::string& str) {
	std::string num = shiftWord(str);

	try {
		int n = std::stoi(num);
		return n;
	}
	catch (std::invalid_argument err) {
		std::cerr << "Invalid OBJ file. Parsing to int failed: " << str << "\n";
		return 0;
	}
}

void objReader(std::string filename, VertexArray &vertices, IndiceArray &indices, Vec3 worldPos) {
	
	std::fstream input_stream;
	input_stream.open(filename, input_stream.in);

	if (!input_stream.is_open()) {
		std::cerr << "cannot open " << filename << "\n";
		return;
	}

	/*
	FILE * file = fopen(name.c_str(), "r");
	if (file == NULL) {
		printf("Impossible to open the file !\n");
		return;
	}*/

	std::vector<Vec3> temp_vertices;
	std::vector<Vec2> temp_uvs;
	std::vector<Vec3> temp_normals;

	while (!input_stream.eof()) {

		//char lineHeader[128];
		// read the first word of the line

		std::string line;
		std::getline(input_stream, line);

		std::string header = shiftWord(line);
		
		if (header == "v") {
			Vec3 vertex = { getFloat(line), getFloat(line), getFloat(line)};
			temp_vertices.emplace_back(vertex);
		}
		else if (header == "vt") {
			Vec2 uv = { getFloat(line), getFloat(line) };
			temp_uvs.emplace_back(uv);
		}
		else if (header == "vn") {
			Vec3 normal = { getFloat(line), getFloat(line), getFloat(line) };
			temp_normals.emplace_back(normal);
		}
		else if (header == "f") {
			std::replace(line.begin(), line.end(), '/', ' ');
			std::array<unsigned int, 3> vertexIndex, uvIndex, normalIndex;

			for (int i = 0; i < 3; ++i) {
				vertexIndex[i] = getInt(line);
				uvIndex[i] = getInt(line);
				normalIndex[i] = getInt(line);
			}

			int startIndice = vertices.size();

			Tangents tangents = calculateTangents(temp_vertices, vertexIndex, temp_uvs, uvIndex);
			Vec3 tan = tangents.tangent;
			Vec3 bitan = tangents.bitangent;

			for (int i = 0; i < 3; i++) {
				Vec3 v = temp_vertices.at(vertexIndex[i] - 1);
				Vec2 uv = temp_uvs.at(uvIndex[i] - 1);
				Vec3 n = temp_normals.at(normalIndex[i] - 1);
				vertices.push_back({
					v.x, v.y, v.z,
					uv.x, 1.f - uv.y,
					worldPos.x, worldPos.y, worldPos.z,
					n.x, n.y, n.z,
					tan.x, tan.y, tan.z,
					bitan.x, bitan.y, bitan.z
				});
			}

			indices.push_back(startIndice);
			indices.push_back(startIndice + 1);
			indices.push_back(startIndice + 2);
		}
	}

	//fclose(file);
}

Tangents calculateTangents(std::vector<Vec3>& vertices, std::array<unsigned int, 3>& vertexIndices, std::vector<Vec2>& uvs, std::array<unsigned int, 3>& uvIndices) {
	Vec3& v0 = vertices.at(vertexIndices[0] - 1);
	Vec3& v1 = vertices.at(vertexIndices[1] - 1);
	Vec3& v2 = vertices.at(vertexIndices[2] - 1);

	Vec2& uv0 = uvs.at(uvIndices[0] - 1);
	Vec2& uv1 = uvs.at(uvIndices[1] - 1);
	Vec2& uv2 = uvs.at(uvIndices[2] - 1);

	//Edges of the vertex triangle
	Vec3 deltaPos1 = v1 - v0;
	Vec3 deltaPos2 = v2 - v0;

	//Edges of the uv triangle
	Vec2 deltaUv1 = uv1 - uv0;
	Vec2 deltaUv2 = uv2 - uv0;

	float r = 1.0f / (deltaUv1.x * deltaUv2.y - deltaUv1.y * deltaUv2.x);

	Vec3 tangent = (deltaPos1 * deltaUv2.y - deltaPos2 * deltaUv1.y) * r;
	Vec3 bitangent = (deltaPos2 * deltaUv1.x - deltaPos1 * deltaUv2.x) * r;

	return { tangent, bitangent };
}