#version 150
layout(triangles) in;
layout(triangle_strip, max_vertices=3) out;

uniform float normal_length;
uniform float time;

// GLSL Hacker automatic uniform
uniform mat4 gxl3d_ModelViewProjectionMatrix;

in vec3 normal[3];
in vec4 color[3];

out vec4 vertex_color;

void main()
{
  //------ Face normal
  //
  vec3 P0 = gl_in[0].gl_Position.xyz;
  vec3 P1 = gl_in[1].gl_Position.xyz;
  vec3 P2 = gl_in[2].gl_Position.xyz;
  
  vec3 V0 = P0 - P1;
  vec3 V1 = P2 - P1;
  
  // If the diff between V0 and V1 is too small, 
  // the normal will be incorrect as well as the deformation.
  //
  vec3 diff = V1 - V0;
  float diff_len = length(diff);
  
  vec3 N = normalize(cross(V1, V0));

  //------ Generate a new face along the direction of the face normal
  // only if diff_len is not too small.
  //
  if (length(diff_len) > 0.001)
  {
    int i;
    for(i=0; i<gl_in.length(); i++)
    {
      vec4 P = gl_in[i].gl_Position;
      vec3 N = normalize(cross(V1, V0));
      float len = sqrt(P.x*P.x + P.z*P.z);
      float scale = 2.0 + 1.0 * cos(time*2.0 + len);
      P = vec4(P.xyz + (N * normal_length * scale) + \
          (N * vec3(0.05, 0.05, 0.05)), 1.0);
      gl_Position = gxl3d_ModelViewProjectionMatrix * P;
      vertex_color = color[i];
      EmitVertex();
    }
    EndPrimitive();
  }
}