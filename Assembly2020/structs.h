#pragma once

#include <iostream>
#include <string>
#include <GLFW/glfw3.h>
#include <vector>

const struct Vec2
{
	float x, y;

	Vec2 operator+(Vec2 rhs) {
		return { x + rhs.x, y + rhs.y };
	}

	Vec2 operator-(Vec2 rhs) {
		return { x - rhs.x, y - rhs.y };
	}

	Vec2 operator*(float rhs) {
		return { x * rhs, y * rhs };
	}

	Vec2 operator/(float rhs) {
		return { x / rhs, y / rhs };
	}

	friend std::ostream& operator<<(std::ostream& os, const Vec2& v);
};

const struct Vec3
{
	float x, y, z;

	Vec3 operator+(Vec3 rhs) {
		return { x + rhs.x, y + rhs.y, z + rhs.z };
	}

	Vec3 operator-(Vec3 rhs) {
		return { x - rhs.x, y - rhs.y, z - rhs.z };
	}

	Vec3 operator*(float rhs) {
		return { x * rhs, y * rhs, z * rhs };
	}

	Vec3 operator/(float rhs) {
		return { x / rhs, y / rhs, z / rhs };
	}

	friend std::ostream& operator<<(std::ostream& os, const Vec3& v);
};

const struct Vertex
{
	float x, y, z; //local coordinates
	float s, t; //texture coordinates
	float wx, wy, wz; //world object coordinates
	float nx, ny, nz; //normals
	float tx, ty, tz; //tangents
	float btx, bty, btz; //bitangents
	int objId;
};

using VertexArray = std::vector<Vertex>;
using IndiceArray = std::vector<unsigned int>;
using TextureArray = std::vector<GLint>;

const struct Scene
{
	float length;
	VertexArray vertices;
	IndiceArray indices;
	std::string vertexShader;
	std::string fragmentShader;
	TextureArray (*getTextures)(GLuint);
	std::string postVertexShader;
	std::string postFragmentShader;
	int postRuns;
};

const struct Window
{
	int width;
	int height;
	bool fullscreen;
};