let cubeRotation = 0.0;
let zoom = 1.0;
let zoomStep = 0.9;
let offset = [0, 0];

class Scene {
  #shader;
  inputHandler = new InputHandler();

  Init() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Shader
    this.#shader = new Shader(vsSource, fsSource);
    this.#shader.Bind();

    // Resize
    this.#Resize();

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
  }

  Draw(deltaTime) {
    if (this.inputHandler.Scroll() > 0) {
      zoom /= zoomStep;
    } else if (this.inputHandler.Scroll() < 0) {
      zoom *= zoomStep;
    }

    gl.uniform1f(this.#shader.GetUniformLocation("zoom"), zoom);

    if (this.inputHandler.IsPointerHeld()) {
      offset[0] += this.inputHandler.DeltaX() / gl.canvas.height * zoom;
      offset[1] -= this.inputHandler.DeltaY() / gl.canvas.height * zoom;
      gl.uniform2f(this.#shader.GetUniformLocation("offset"), offset[0], offset[1]);
    }

    this.#Resize();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    document.querySelector(".IsPointerPressed").textContent = `IsPointerPressed: ${this.inputHandler.IsPointerPressed()}`;
    document.querySelector(".IsPointerHeld").textContent = `IsPointerHeld: ${this.inputHandler.IsPointerHeld()}`;
    document.querySelector(".IsPointerReleased").textContent = `IsPointerReleased: ${this.inputHandler.IsPointerReleased()}`;

    this.inputHandler.Update();
  }

  #Resize() {
    const displayWidth = gl.canvas.parentElement.clientWidth;
    const displayHeight = gl.canvas.parentElement.clientHeight;

    if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
      gl.canvas.width = displayWidth;
      gl.canvas.height = displayHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      this.#shader.SetUniform2f("resolution", gl.canvas.width, gl.canvas.height);
    }
  }

}
