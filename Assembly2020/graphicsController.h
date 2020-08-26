#pragma once
#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <string>
#include <array>
#include <vector>
#include "structs.h"

namespace graphics {
	GLFWwindow* initWindow(Window window, std::string title);

	template <typename T>
	GLuint genBuffer(GLuint bufferType, std::vector<T> data) {
		GLuint buffer;
		glGenBuffers(1, &buffer);
		glBindBuffer(bufferType, buffer);
		glBufferData(bufferType, data.size() * sizeof(T), &data.at(0), GL_STATIC_DRAW);

		return buffer;
	}

	struct Post {
		GLuint fragment_shader;
		GLuint vertex_shader;
		GLuint program;
		GLuint vbo_fbo_vertices;
		std::array<GLuint, 2> textureColorbuffer = std::array<GLuint, 2>();
		std::array<GLuint, 2> framebuffer = std::array<GLuint, 2>();

		GLuint fbo_texture_location;
		GLuint v_coord_location;
		GLuint itime_location;
		GLuint pass_location;
	};

	std::unique_ptr<Post> setupPost(Window window, Scene scene);
}