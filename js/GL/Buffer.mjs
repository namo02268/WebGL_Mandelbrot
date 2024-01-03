import { gl } from "./GL.mjs";

class BufferBase {
  /*---------------------------------------
    パブリック関数
  ---------------------------------------*/
  // コンストラクタ
  constructor(bufferType) {
    this.#m_id = gl.createBuffer();
    this.#m_bufferType = bufferType;
    this.#m_usage = gl.STATIC_DRAW;
    this.#m_dataSize = 0;
  }
  // バッファの解放
  FreeBuffer() {
    if (this.#m_id !== 0) {
      gl.deleteBuffer(this.#m_id);
      this.#m_id = 0;
    }
  }
  // バッファのバインド
  Bind() {
    gl.bindBuffer(this.#m_bufferType, this.#m_id);
  }
  // バッファのアンバインド
  UnBind() {
    gl.bindBuffer(this.#m_bufferType, 0);
  }
  // 頂点データのセット
  SetData(size, data) {
    this.#m_dataSize = size;
    this.Bind();
    gl.bufferData(this.#m_bufferType, new Float32Array(data), this.#m_usage);
  }
  // 頂点データの追加セット
  SetSubData(size, offset, data) {
    if (size + offset <= this.#m_dataSize) {
      this.Bind();
      gl.bufferSubData(this.#m_bufferType, offset, data);
    }
  }
  SetUsage(usage) {
    this.#m_usage = usage;
  }
  // バッファハンドルの取得
  GetHandle() {
    return this.#m_id;
  }

  /*---------------------------------------
    プライベート変数
  ---------------------------------------*/
  #m_id;  // バッファの固有ID
  #m_usage;
  #m_bufferType;
  #m_dataSize;
}

class VertexBuffer extends BufferBase {
  constructor() {
    super(gl.ARRAY_BUFFER);
  }
}

export { VertexBuffer };
