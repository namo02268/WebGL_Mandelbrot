import { gl } from "./GL/GL.mjs";
import { InputHandler } from "./InputHandler.mjs";
import { Shader } from "./GL/Shader.mjs";
import { fsSource } from "./fragmentShader.mjs";
import { vsSource } from "./vertexShader.mjs";
import { VertexBuffer } from "./GL/Buffer.mjs";
let zoom = 1.0;
let offset = [0, 0];

class Scene {
  #shader;
  inputHandler = new InputHandler();

  Init() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

  Draw() {
    zoom = this.inputHandler.Zoom();
    if (this.inputHandler.IsPointerHeld()) {
      offset[0] += this.inputHandler.DeltaX() / gl.canvas.height * zoom;
      offset[1] -= this.inputHandler.DeltaY() / gl.canvas.height * zoom;
    }
    this.#shader.SetUniform1f("zoom", zoom);
    this.#shader.SetUniform2f("offset", offset[0], offset[1]);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    document.querySelector(".zoom").innerHTML = `${(1 / zoom).toFixed(5)}`;
    document.querySelector(".posX").innerHTML = `X: ${offset[0].toFixed(5)}`; document.querySelector(".posY").innerHTML = `Y: ${offset[1].toFixed(5)}`;
  }

  Update(deltaTime) {
    this.#Resize();
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

export { Scene };
