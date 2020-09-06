#include <GLFW/linmath.h>

namespace Camera {
	void set(mat4x4 &mvp, float time, int sceneId);
	void updateM(mat4x4 &m, float time, int sceneId);
	float smoothStep(float x);
}