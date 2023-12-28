const fsSource = `
      precision mediump float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 offset;
      uniform float zoom;

      vec2 complexSquare(vec2 z) {
        return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
      }

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      vec4 getColor(float iterations) {
        vec3 color = vec3(0.0);
        if (iterations == 10000.0) {
          return vec4(0.0, 0.0, 0.0, 1.0);
        } else {
          float hue = iterations / 100.0;
          color = hsv2rgb(vec3(hue, 1.0, 1.0));
          return vec4(color.xxx, 1.0);
        }
      }

      int mandelbrot(vec2 uv) {
        vec2 z = vec2(0.0, 0.0);
        int i = 0;
        for (int j = 0; j < 256; j++) {
          z = complexSquare(z) + uv;
          if (length(z) > 2.0) {
            break;
          }
          i++;
        }
        return i;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - resolution.xy * 0.5) / resolution.y;
        uv = uv * zoom + offset;
        float iterations = float(mandelbrot(uv * 2.0));
        gl_FragColor = getColor(iterations);
      }
    `;

export { fsSource };
