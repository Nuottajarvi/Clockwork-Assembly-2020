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
	if(sceneId ==  1) {
		//intro scene
		const float t0 = 10.; //starting zoom out
		const float t1 = 15.;  //zoom in

		float tm = std::min(time, 15.45f);
		
		if (time > t0 && time < t1 ) {
			mat4x4_translate(m, 0., -5. * smoothStep((time - t0) * .2), -25. * smoothStep((time - t0) * .2));
		} else if (time > t1) {
			mat4x4_translate(m, 0., -5. - 5. * smoothStep(tm - t1), -25 + 50. * smoothStep((tm - t1)));
		}

	}

	if(sceneId == 6) {
		//movement scene
		vec3 up = { 0., 0., 1. };
		vec3 loc = { 0. + sin(time / 3.) * 6., -2.5 + cos(time / 3.) * 5., 7. - sin(time / 10.) * 4. };
		vec3 eye = { 0.5, std::max(0., 7.5 - time * 2.5), 0. };
		
		mat4x4_translate(m, loc[0], loc[1], loc[2]);
		mat4x4_look_at(m, loc, eye, up);
	}

	if(sceneId == 9) {
		//clock scene
		float t = std::max(time - 15., 0.);
		float t0 = std::max(time - 30., 0.);
		float t1 = std::max(time - 39., 0.);

		if (t1 > 0.) {
			vec3 up = { 0., 1., 0. };
			vec3 loc = { 0. + sin((t1 + 3.14) / 3.) * 1., 0. - sin(t / 3.) * 7., 7. - sin(t1 / 10.) * 2. };
			vec3 eye = { 0., 0., -5. };
			mat4x4_translate(m, loc[0], loc[1], loc[2]);
			mat4x4_look_at(m, loc, eye, up);
		} else if (t0 > 0.) {
			vec3 up = { 0., 1., 0. };
			vec3 loc = { 0. + sin((t0 + 3.14) / 3.) * 6., 0. - sin(t0 / 6.) * 2, 7. - sin(t0 / 10.) * 4. };
			vec3 eye = { 0., 0., -5. };
			mat4x4_translate(m, loc[0], loc[1], loc[2]);
			mat4x4_look_at(m, loc, eye, up);
		} else {
			mat4x4_translate(m, .33 - std::min(.33, std::sqrt(t) * .33 * .2), 0., 0. - 1. - (t * t) * .05);
		}
	}
}