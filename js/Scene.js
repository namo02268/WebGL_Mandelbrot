let cubeRotation = 0.0;

class Scene {
  #shader;
  #buffers;

  Init() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const vsSource = `
      attribute vec4 a_position;

      void main() {
        gl_Position = a_position;
      }
    `;

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
        if (iterations == 100.0) {
          return vec4(0.0, 0.0, 0.0, 1.0);
        } else {
          float hue = iterations / 100.0;
          color = hsv2rgb(vec3(hue, 1.0, 1.0));
          return vec4(color.zyx, 1.0);
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

    this.#shader = new Shader(vsSource, fsSource);
    this.#shader.Bind();

    // Buffer
    const positionBuffer = new VertexBuffer();
    const positions = [
      -1, -1,
      -1, 1,
      1, 1,
      1, -1,
    ];
    positionBuffer.SetData(positions);

    const positionAttributeLocation = this.#shader.GetAttribLocation("a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = this.#shader.GetUniformLocation("resolution");
    const mousePositionLocation = this.#shader.GetUniformLocation("offset");
    const scrollLocation = this.#shader.GetUniformLocation("zoom");

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    let zoom = 1.0;
    let zoomStep = 0.9;
    gl.uniform1f(scrollLocation, zoom);
    function onMouseScroll(event) {
      const rect = gl.canvas.getBoundingClientRect();
      if (event.deltaY > 0) {
        zoom /= zoomStep;
      } else {
        zoom *= zoomStep;
      }
      gl.uniform1f(scrollLocation, zoom);
      document.querySelector(".zoom").textContent = `Zoom: ${(1 / zoom).toFixed(5)}`;
    }
    document.querySelector(".zoom").textContent = `Zoom: ${(1 / zoom).toFixed(5)}`;

    function onMouseDown(event) {
      gl.canvas.addEventListener('mousemove', onMouseMove);
      gl.canvas.addEventListener('mouseup', onMouseUp);
      gl.canvas.addEventListener('mouseleave', onMouseUp);
    }

    function onMouseUp(event) {
      gl.canvas.removeEventListener('mousemove', onMouseMove);
      gl.canvas.removeEventListener('mouseup', onMouseUp);
      gl.canvas.removeEventListener('mouseleave', onMouseUp);
    }

    let offset = [0, 0];
    function onMouseMove(event) {
      offset[0] -= event.movementX / gl.canvas.clientHeight * zoom;
      offset[1] += event.movementY / gl.canvas.clientHeight * zoom;
      gl.uniform2f(mousePositionLocation, offset[0], offset[1]);
      document.querySelector(".center").textContent = `Center: (${offset[0].toFixed(5)}, ${offset[1].toFixed(5)})`;
    }
    document.querySelector(".center").textContent = `Center: (${offset[0].toFixed(5)}, ${offset[1].toFixed(5)})`;

    let initialX, initialY, currentX, currentY;

    gl.canvas.addEventListener('touchstart', function (e) {
      initialX = e.touches[0].clientX;
      initialY = e.touches[0].clientY;
    });

    gl.canvas.addEventListener('touchmove', function (e) {
      if (e.touches.length === 1) {
        e.preventDefault();

        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;

        offset[0] -= currentX / gl.canvas.clientHeight * zoom;
        offset[1] += currentY / gl.canvas.clientHeight * zoom;;
        gl.uniform2f(mousePositionLocation, offset[0], offset[1]);
        document.querySelector(".center").textContent = `Center: (${offset[0].toFixed(5)}, ${offset[1].toFixed(5)})`;

      } else if (e.touches.length === 2) {
        e.preventDefault();

        let touch1 = e.touches[0];
        let touch2 = e.touches[1];
        let distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        zoom = zoom + distance * 0.001;

        gl.uniform1f(scrollLocation, zoom);
        document.querySelector(".zoom").textContent = `Zoom: ${(1 / zoom).toFixed(5)}`;
      }
    });

    gl.canvas.addEventListener('touchend', function (e) {
      initialX = currentX;
      initialY = currentY;
    });

    gl.canvas.addEventListener('mousedown', onMouseDown);
    gl.canvas.addEventListener('wheel', onMouseScroll);
  }

  Draw(deltaTime) {
    this.#Resize();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }

  #Resize() {
    const displayWidth = gl.canvas.clientWidth;
    const displayHeight = gl.canvas.clientHeight;

    if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
      gl.canvas.width = displayWidth;
      gl.canvas.height = displayHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      const resolutionLocation = this.#shader.GetUniformLocation("resolution");
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    }
  }

}
