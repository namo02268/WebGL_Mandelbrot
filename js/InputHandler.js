class InputHandler {
  #X = 0;
  #Y = 0;
  #deltaX = 0;
  #deltaY = 0;
  #scroll = 0;
  #isMouseDown = false;

  constructor() {
    gl.canvas.addEventListener('pointermove', (event) => {
      this.#deltaX = this.#X - event.clientX;
      this.#deltaY = this.#Y - event.clientY;
      this.#X = event.clientX;
      this.#Y = event.clientY;
    });

    window.addEventListener('pointerdown', () => {
      this.#isMouseDown = true
    });

    window.addEventListener('pointerup', () => {
      this.#isMouseDown = false
    });

    window.addEventListener('wheel', (event) => {
      this.#scroll = event.deltaY;
    });
  }

  Update() {
    this.#deltaX = 0;
    this.#deltaY = 0;
    this.#scroll = 0;
  }

  X() {
    return this.#X;
  }

  Y() {
    return this.#Y;
  }

  DeltaX() {
    return this.#deltaX;
  }

  DeltaY() {
    return this.#deltaY;
  }

  Scroll() {
    return this.#scroll;
  }

  IsMouseDown() {
    return this.#isMouseDown;
  }
}
