﻿#include <vector>
#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <GLFW/linmath.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <iostream>
#include <string>
#include <mmsystem.h>
#include "structs.h"
#include "graphicsController.h"
#include "camera.h"
#include "shaderReader.h"
#include "introScene.h"
#include "weightsScene.h"
#include "escapementScene.h"
#include "raymarchedCogsScene.h"
#include "trippyCogsScene.h"
#include "movementScene.h"
#include "cuckooScene.h"
#include "treeScene.h"
#include "clockfaceScene.h"
#include "outroScene.h"
#include "textureLoader.h"

const Window fullscreen = { 1920, 1080, true };
const Window test_screen = { 640 * 2, 360 * 2, false };

const float songStartDelay = 0.5;

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

void setVertexAttribArray(GLint location, int size, Scene scene, bool reset = false) {

	static int pos = 0;

	if (reset)
		pos = 0;

	glEnableVertexAttribArray(location);
	glVertexAttribPointer(location, size, GL_FLOAT, GL_FALSE, 
		sizeof(scene.vertices[0]), (void*)(sizeof(float) * pos));

	pos += size;
}

bool readBool(char trueVal, char falseVal)
{
	char c = '0';
	while (c != trueVal && c != falseVal)
	{
		std::cin >> c;
		c = tolower(c);
		if (c == trueVal)
			return true;
		else if (c == falseVal)
			return false;
		else
			std::cout << "Write either " << trueVal << " or " << falseVal << std::endl;
	}
}

int readInt()
{
	std::string input;	
	while(true)
	{
		getline(std::cin, input);
		try {
			return std::stoi(input);
		}
		catch (std::invalid_argument) {
			if(input != "")
				std::cout << "Invalid number" << std::endl;
		}
	}
}

Window getWindowSettings()
{
	std::cout << "Do you want to play the demo Fullscreen? (y/n)" << std::endl;
	bool fullscreen = readBool('y', 'n');

	int width = 1920;
	int height = 1080;
	std::cout << "Default resolution is 1920x1080. Accept (a) or change (c)" << std::endl;
	bool customResolution = readBool('c', 'a');
	
	if (customResolution) {
		std::cout << "Give width in pixels:" << std::endl;
		width = readInt();
		std::cout << "Give height in pixels:" << std::endl;
		height = readInt();
	}

	return { width, height, fullscreen };
}

int main(void)
{
	//Window screen = test_screen;
	Window screen = getWindowSettings();
	glfwWindowHint(GLFW_SAMPLES, 4);
	GLFWwindow* window = graphics::initWindow(screen, "Clockwork");

	int sceneId = 0;
	Scene(*scenes[])() = {IntroScene::init, Weights::init,* Escapement::init, RaymarchedCogs::init, TrippyCogs::init, MovementScene::init, Cuckoo::init, Trees::init, Clockface::init, Outro::init };

	ShowCursor(0);
	PlaySound("./media/clockwork.wav", NULL, SND_ASYNC);
	while (!glfwWindowShouldClose(window) && sceneId < sizeof(scenes) / sizeof(*(scenes))) {
		glEnable(GL_MULTISAMPLE);
		Scene scene = scenes[sceneId]();
		sceneId++;

		GLuint vertex_buffer = graphics::genBuffer(GL_ARRAY_BUFFER, scene.vertices);
		GLuint index_buffer = graphics::genBuffer(GL_ELEMENT_ARRAY_BUFFER, scene.indices);

		GLuint vertex_shader = glCreateShader(GL_VERTEX_SHADER);
		const char* vertex_shader_text = scene.vertexShader.c_str();
		glShaderSource(vertex_shader, 1, &vertex_shader_text, NULL);
		glCompileShader(vertex_shader);
		GLuint fragment_shader = glCreateShader(GL_FRAGMENT_SHADER);
		const char* fragment_shader_text = scene.fragmentShader.c_str();
		glShaderSource(fragment_shader, 1, &fragment_shader_text, NULL);
		glCompileShader(fragment_shader);

		GLuint program = glCreateProgram();
		glAttachShader(program, vertex_shader);
		glAttachShader(program, fragment_shader);
		glLinkProgram(program);
		GLint mvp_location = glGetUniformLocation(program, "MVP");
		GLint vpos_location = glGetAttribLocation(program, "vPos");
		GLint vtex_location = glGetAttribLocation(program, "vTex");
		GLint vworldpos_location = glGetAttribLocation(program, "vWorldPos");
		GLint vnor_location = glGetAttribLocation(program, "vNor");
		GLint vtan_location = glGetAttribLocation(program, "vTan");
		GLint vbitan_location = glGetAttribLocation(program, "vBitan");
		GLint objId_location = glGetAttribLocation(program, "vObjId");

		GLint itime_location = glGetUniformLocation(program, "iTime");

		//TEXTURE STUFF
		TextureArray textures;
		if (scene.getTextures != 0)
			textures = scene.getTextures(program);

		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_BORDER);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_BORDER);
		float borderColor[] = { 1.0f, 1.0f, 0.0f, 1.0f }; //for GL_CLAMP_TO_BORDER
		glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);

		//ERROR CHECKING
		checkErrors(program);
		
		//POST PROCESSING
		graphics::Post post = graphics::setupPost(screen, scene);

		float startTime = (float)glfwGetTime();

		float testTime = 0.;
		float lastTime = 0.;

		while (!glfwWindowShouldClose(window)) {
			float time = (float)glfwGetTime() - startTime + testTime;
			//std::cout << 1.f / (time - lastTime) << std::endl;

			if (time > scene.length) {
				break;
			}

			lastTime = time;
			int width, height;
			glfwGetFramebufferSize(window, &width, &height);
			float ratio = width / (float)height;

			glBindFramebuffer(GL_FRAMEBUFFER, post.framebuffer[0]);
			glBindTexture(GL_TEXTURE_2D, post.textureColorbuffer[0]);

			glViewport(0, 0, width, height);
			glClearColor(1.0, 1.0, 1.0, 1.0);
			glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

			mat4x4 mvp;
			Camera::set(mvp, time, sceneId);
			glUseProgram(program);
			glUniformMatrix4fv(mvp_location, 1, GL_FALSE, (const GLfloat*)mvp);

			glUniform1f(itime_location, time);
			
			for (int i = 0; i < textures.size(); i++) {
				glActiveTexture(GL_TEXTURE2 + i);
				glBindTexture(GL_TEXTURE_2D, textures[i]);
				glUniform1i(textures[i], i + 2);
			}
			
			glBindBuffer(GL_ARRAY_BUFFER, vertex_buffer);
			
			setVertexAttribArray(vpos_location, 3, scene, true);
			setVertexAttribArray(vtex_location, 2, scene);
			setVertexAttribArray(vworldpos_location, 3, scene);
			setVertexAttribArray(vnor_location, 3, scene);
			setVertexAttribArray(vtan_location, 3, scene);
			setVertexAttribArray(vbitan_location, 3, scene);
			setVertexAttribArray(objId_location, 1, scene);

			glDrawElements(GL_TRIANGLES, scene.indices.size(), GL_UNSIGNED_INT, (void*)0);

			glUseProgram(post.program);

			glEnableVertexAttribArray(post.v_coord_location);

			glBindBuffer(GL_ARRAY_BUFFER, post.vbo_fbo_vertices);
			glVertexAttribPointer(
				post.v_coord_location,	// attribute
				2,                  // number of elements per vertex, here (x,y)
				GL_FLOAT,           // the type of each element
				GL_FALSE,           // take our values as-is
				0,                  // no extra data between each position
				0                   // offset of first element
			);

			glUniform1i(post.fbo_texture_location, GL_TEXTURE0);
			glUniform1f(post.itime_location, time);

			for (int i = 0; i < scene.postRuns; i++) {
				int pingpong = i % 2;
				glBindFramebuffer(GL_FRAMEBUFFER, post.framebuffer[(i + 1) % 2]);
				glActiveTexture(GL_TEXTURE0 + i % 2);
				glBindTexture(GL_TEXTURE_2D, post.textureColorbuffer[i % 2]);
				glUniform1i(post.pass_location, i);
				glDrawArrays(GL_TRIANGLE_STRIP, 0, 6);
			}

			glBindFramebuffer(GL_FRAMEBUFFER, 0);
			glClearColor(0.0, 0.0, 0.0, 1.0);
			glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
			glDrawArrays(GL_TRIANGLE_STRIP, 0, 6);

			glfwSwapBuffers(window);
			glfwPollEvents();
		}

		resetTextures();
		if(textures.size() > 0)
			glDeleteTextures(textures.size(), (const GLuint*) &textures[0]);

		glDeleteProgram(program);
		GLuint buffers[] = { 
			vertex_buffer, index_buffer, vertex_shader, fragment_shader, program
		};

		GLuint postbuffers[] = {
			post.fragment_shader, post.vertex_shader, post.program
		};
		memcpy(buffers + sizeof(buffers), postbuffers, sizeof(postbuffers));
		glDeleteBuffers(sizeof(buffers) / sizeof(*(buffers)), buffers);
	}
	glfwDestroyWindow(window);
	glfwTerminate();
	exit(EXIT_SUCCESS);
}