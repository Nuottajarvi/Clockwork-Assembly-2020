#include <algorithm>
#include <iostream>
#include "camera.h"

void Camera::set(mat4x4 &mvp, float time, int sceneId) {
	mat4x4 m, p;
	mat4x4_identity(m);
	updateM(m, time, sceneId);
	mat4x4_perspective(p, .7f, 1.8f, 0.01f, 50.f);
	mat4x4_mul(mvp, p, m);
}

float clamp(float x, float min, float max) {
	return std::min(max, std::max(min, x));
}

float Camera::smoothStep(float x) {
	float t = clamp(x, 0.0, 1.0);
	return t * t * (3.0 - 2.0 * t);
}

void Camera::updateM(mat4x4 &m, float time, int sceneId) {
	/*
	if(sceneId == 1) {
		//intro scene
		const float t0 = 10.; //starting zoom out
		const float t1 = 15.;  //zoom in
		
		if (time > t0 && time < t1 ) {
			mat4x4_translate(m, 0., -5. * smoothStep((time - t0) * .2), -25. * smoothStep((time - t0) * .2));
		} else if (time > t1) {
			mat4x4_translate(m, 0., -5. - 5. * smoothStep(time - t1), -25 + 50. * smoothStep((time - t1)));
		}

	}

	if(sceneId == 6) {
		//movement scene
		vec3 loc = { 0. + sin(time / 3.) * 6., -2.5 + cos(time / 3.) * 5., 7. - sin(time / 10.) * 4. };
		vec3 eye = { 0.5, std::max(0., 8. - time * 2.5), 0. };
		vec3 up = { 0., 0., 1. };
		mat4x4_translate(m, loc[0], loc[1], loc[2]);
		mat4x4_look_at(m, loc, eye, up);
	}*/

	mat4x4_translate(m, 0., 0., 0. - time);
}