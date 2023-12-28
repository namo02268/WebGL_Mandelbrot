import { gl } from "./GL.mjs";

class VertexBuffer {
  /*---------------------------------------
    パブリック関数
  ---------------------------------------*/
  constructor() {
    this.#m_handle = gl.createBuffer();
  }

  Bind() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#m_handle);
  }

  SetData(data) {
    this.Bind();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  }

  GetID() {
    return this.#m_handle;
  }

  /*---------------------------------------
  プライベート変数
  ---------------------------------------*/
  #m_handle;
}

export { VertexBuffer };
