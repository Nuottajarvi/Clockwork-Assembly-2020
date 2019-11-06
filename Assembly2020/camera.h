#include <GLFW/linmath.h>

namespace Camera {
	void set(mat4x4 &mvp, float time);
	void updateM(mat4x4 &m, float time);
}