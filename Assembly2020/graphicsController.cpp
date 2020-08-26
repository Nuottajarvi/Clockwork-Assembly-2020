#include <iostream>
#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <vector>
#include "graphicsController.h"
#include "structs.h"

namespace graphics {
	static void error_callback(int error, const char* description)
	{
		std::cerr << "Error: " << description << "\n";
	}

	static void key_callback(GLFWwindow* window, int key, int scancode, int action, int mods)
	{
		if (key == GLFW_KEY_ESCAPE && action == GLFW_PRESS)
			glfwSetWindowShouldClose(window, GLFW_TRUE);
	}

	GLFWwindow* initWindow(Window screen, std::string title) {
		GLFWwindow* window;
		glfwSetErrorCallback(error_callback);
		if (!glfwInit())
			exit(EXIT_FAILURE);
		glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 2);
		glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 0);
		GLFWmonitor* monitor = NULL;
		if (screen.fullscreen) {
			monitor = glfwGetPrimaryMonitor();
		}
		window = glfwCreateWindow(screen.width, screen.height, title.c_str(), monitor, NULL);

		if (!window)
		{
			glfwTerminate();
			exit(EXIT_FAILURE);
		}
		glfwSetKeyCallback(window, key_callback);
		glfwMakeContextCurrent(window);
		gladLoadGL();
		glfwSwapInterval(1);

		glEnable(GL_CULL_FACE);
		glCullFace(GL_FRONT);

		glEnable(GL_DEPTH_TEST);
		glDepthFunc(GL_LESS);

		//transparency
		glEnable(GL_BLEND);
		glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

		return window;
	}

	int checkErrors(GLuint program) {
		GLint isLinked = 0;
		glGetProgramiv(program, GL_LINK_STATUS, &isLinked);
		if (isLinked == GL_FALSE)
		{
			GLint maxLength = 0;
			glGetProgramiv(program, GL_INFO_LOG_LENGTH, &maxLength);

			// The maxLength includes the NULL character
			std::vector<GLchar> infoLog(maxLength);
			glGetProgramInfoLog(program, maxLength, &maxLength, &infoLog[0]);

			// The program is useless now. So delete it.
			glDeleteProgram(program);

			for (auto i = infoLog.begin(); i != infoLog.end(); ++i)
				std::cout << *i << ' ';

			return 0;
		}
		return 1;
	}

	std::unique_ptr<Post> setupPost(Window window, Scene scene) {
		std::unique_ptr<Post> post = std::make_unique<Post>();
		glGenFramebuffers(2, post->framebuffer.data());

		glGenTextures(2, post->textureColorbuffer.data());
		for (int i = 0; i < 2; i++) {
			glBindFramebuffer(GL_FRAMEBUFFER, post->framebuffer[i]);
			glActiveTexture(GL_TEXTURE0 + i);
			glBindTexture(GL_TEXTURE_2D, post->textureColorbuffer[i]);
			glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, window.width, window.height, 0, GL_RGBA, GL_UNSIGNED_BYTE, NULL);
			glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
			glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
			glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
			glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
			glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, post->textureColorbuffer[i], 0);

			GLuint depthrenderbuffer;
			glGenRenderbuffers(1, &depthrenderbuffer);
			glBindRenderbuffer(GL_RENDERBUFFER, depthrenderbuffer);
			glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT, window.width, window.height);
			glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, depthrenderbuffer);
		}

		if (glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE)
			std::cout << "ERROR::FRAMEBUFFER:: Framebuffer is not complete!" << std::endl;
		glBindFramebuffer(GL_FRAMEBUFFER, 0);

		const char* vert_text = scene.postVertexShader.c_str();
		const char* frag_text = scene.postFragmentShader.c_str();
		glCreateShader(GL_FRAGMENT_SHADER);

		post->fragment_shader = glCreateShader(GL_FRAGMENT_SHADER);
		glShaderSource(post->fragment_shader, 1, &frag_text, NULL);
		glCompileShader(post->fragment_shader);

		post->vertex_shader = glCreateShader(GL_VERTEX_SHADER);
		glShaderSource(post->vertex_shader, 1, &vert_text, NULL);
		glCompileShader(post->vertex_shader);

		post->program = glCreateProgram();
		glAttachShader(post->program, post->vertex_shader);
		glAttachShader(post->program, post->fragment_shader);
		glLinkProgram(post->program);

		GLfloat fbo_vertices[] = {
			-1,   1,
			 1,   1,
			-1,  -1,
			 1,  -1
		};

		glGenBuffers(1, &(post->vbo_fbo_vertices));
		glBindBuffer(GL_ARRAY_BUFFER, post->vbo_fbo_vertices);
		glBufferData(GL_ARRAY_BUFFER, sizeof(fbo_vertices), fbo_vertices, GL_STATIC_DRAW);
		glBindBuffer(GL_ARRAY_BUFFER, 0);

		post->fbo_texture_location = glGetUniformLocation(post->program, "fbo_tex");
		post->v_coord_location = glGetAttribLocation(post->program, "v_coord");
		post->itime_location = glGetUniformLocation(post->program, "iTime");
		post->pass_location = glGetUniformLocation(post->program, "iPass");

		//ERROR CHECKING FOR POST
		checkErrors(post->program);

		return post;
	}
}