class InputHandler {
  #X = 0;
  #Y = 0;
  #deltaX = 0;
  #deltaY = 0;
  #scroll = 0;
  #isMouseDown = false;

  constructor() {
    window.addEventListener('pointermove', (event) => {
      this.#deltaX = this.#X - event.clientX;
      this.#deltaY = this.#Y - event.clientY;
      this.#X = event.clientX;
      this.#Y = event.clientY;
    });

    window.addEventListener('pointerdown', (event) => {
      this.#isMouseDown = true
      this.#X = event.clientX;
      this.#Y = event.clientY;
    });

    window.addEventListener('pointerup', () => {
      this.#isMouseDown = false
    });

    window.addEventListener('wheel', (event) => {
      this.#scroll = event.deltaY;
    });

    window.addEventListener('touchmove', (event) => {
      if (e.touches.length > 1) {
        w_abs_move = Math.abs(event.touches[1].pageX - event.touches[0].pageX);
        h_abs_move = Math.abs(event.touches[1].pageY - event.touches[0].pageY);
        touchmove_bar = w_abs_move * h_abs_move;
        area_bar = touchstart_bar - touchmove_bar;
        // 拡大
        if (area_bar < 0) {
          this.#scroll = 1.0;
        }
        // 縮小
        else if (area_bar > 0) {
          this.#scroll = -1.0;
        }
      }
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
