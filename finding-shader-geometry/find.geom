#version 330 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable

layout( triangles ) in;
layout( points, max_vertices=200 ) out;

in vec2 vST[3];
out vec2 gST;


void main()
{
	gST = vST[1];
	EmitVertex();
}