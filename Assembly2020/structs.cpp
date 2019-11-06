#include <iostream>
#include <string>
#include "structs.h"

std::ostream& operator<<(std::ostream& os, const Vec2& v)
{
	os << "{ " << v.x << ", " << v.y << " }";
	return os;
}

std::ostream& operator<<(std::ostream& os, const Vec3& v)
{
	os << "{ " << v.x << ", " << v.y << ", " << v.z << " }";
	return os;
}
