#include "camera.h"

void Camera::set(mat4x4 &mvp, float time) {
	mat4x4 m, p;
	mat4x4_identity(m);
	updateM(m, time);
	mat4x4_perspective(p, 1.f, 1.8f, 0.01f, 50.f);
	mat4x4_mul(mvp, p, m);
}

void Camera::updateM(mat4x4 &m, float time) {
	const float t0 = 14.; //starting lift up
	const float t1 = 19.;  //flying up
	if (time > t0 && time < t1) {
		//mat4x4_translate(m, 0., 0., (time - t0)*-0.5);
		mat4x4_rotate_X(m, m, (time - t0)*-0.1);
	} else if (time > t1) {
		//mat4x4_translate(m, 0., (time - t1) * .5, (t1 - t0)*-0.5 + (time - t1) * 1.);
		mat4x4_translate(m, 0., (time - t1) * (time - t1) * -1., (time - t1) * (time - t1));// );
		mat4x4_rotate_X(m, m, (time - t0)*-0.1);
	}
}