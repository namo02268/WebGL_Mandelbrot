import { gl } from "./GL/GL.mjs";
import { InputHandler } from "./InputHandler.mjs";
import { GLWindow } from "./GL/GLWindow.mjs";
import { Shader } from "./GL/Shader.mjs";
import { fsSource } from "./fragmentShader.mjs";
import { vsSource } from "./vertexShader.mjs";
import { VertexBuffer } from "./GL/Buffer.mjs";

let zoom = 1.0;
let offset = [0, 0];

class Scene {
  /*---------------------------------------
    パブリック関数
  ---------------------------------------*/
  // 初期化
  Init() {
    // Window
    this.#m_window = new GLWindow();

    // Shader
    this.#m_shader = new Shader();
    this.#m_shader.Compile(vsSource, fsSource);
    this.#m_shader.Bind();

    // InputHandler
    this.#m_inputHandler = new InputHandler();

    // Buffer
    const positionBuffer = new VertexBuffer();
    const positions = [
      -1, -1,
      -1, 1,
      1, 1,
      1, -1,
    ];
    positionBuffer.SetData(positions.length, positions);

    const positionAttributeLocation = this.#m_shader.GetAttribLocation("a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    document.querySelector(".resetButton").addEventListener("click", () => {
      this.#m_inputHandler.SetZoom(1.0);
      offset = [0, 0];
    });
  }

  // 描画
  Draw() {
    zoom = this.#m_inputHandler.Zoom();
    if (this.#m_inputHandler.IsPointerHeld()) {
      offset[0] += this.#m_inputHandler.DeltaX() / gl.canvas.height * zoom;
      offset[1] -= this.#m_inputHandler.DeltaY() / gl.canvas.height * zoom;
    }
    this.#m_shader.SetUniform1f("iteration", 256);
    this.#m_shader.SetUniform1f("zoom", zoom);
    this.#m_shader.SetUniform2f("offset", offset[0], offset[1]);
    this.#m_shader.SetUniform2f("resolution", gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    document.querySelector(".zoom").innerHTML = `${(1 / zoom).toFixed(5)}`;
    document.querySelector(".posX").innerHTML = `X: ${offset[0].toFixed(5)}`; document.querySelector(".posY").innerHTML = `Y: ${offset[1].toFixed(5)}`;
  }

  // 更新
  Update(deltaTime) {
    if (this.#m_inputHandler.IsKeyPressed(187)) {
      console.log("test");
    }
    this.#m_window.Resize();
    this.#m_inputHandler.Update();
  }

  /*---------------------------------------
    プライベート変数
  ---------------------------------------*/
  #m_shader;
  #m_inputHandler;
  #m_window;;
}

export { Scene };
