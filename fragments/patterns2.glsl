#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;

#include <lib/util.glsl>
#include <lib/shape.glsl>

vec2 grid2(in vec2 st,in float row,in float col){
  vec2 p=vec2(st.x*col,st.y*row);
  // mod(p.y,2.0):取偶数行
  float m = mod(uTime,4.0);

  // 奇数行偏移正的,偶数偏移负的
  p.x+=step(0.0,2.01-m)*step(1.,mod(p.y,2.))*m*1.0;
  p.x-=step(0.0,2.01-m)*(1.0-step(1.,mod(p.y,2.)))*m*1.0;
  
  p.y+=step(0.0,m-2.01)*step(1.,mod(p.x,2.))*m*1.0;
  p.y-=step(0.0,m-2.01)*(1.0-step(1.,mod(p.x,2.)))*m*1.0;

  return fract(p);
}

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  vec3 color=vec3(1.);
  st=grid2(st,20.,20.);
  float cd=sCircle(st,vec2(.5),.3);

  color*=fill(cd);
  
  gl_FragColor.rgb=color;
  gl_FragColor.a=1.;
}