class VertexBuffer {
  // private member variables
  #m_handle;

  constructor(type) {
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
}
