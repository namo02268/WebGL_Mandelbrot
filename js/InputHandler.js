class InputHandler {
  // メンバ変数
  #X = 0;
  #Y = 0;
  #deltaX = 0;
  #deltaY = 0;
  #scroll = 0;
  #isMouseDown = false;
  #isTouching = false;

  // コンストラクタ
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

    window.addEventListener("touchstart", (e) => {
      if (e.touches.length == 1) {
        // Only one finger is touching, handle movement
        this.#isTouching = true;
        this.#X = e.touches[0].clientX;
        this.#Y = e.touches[0].clientY;
      } else {
        // Multiple fingers are touching, prevent default action
        e.preventDefault();
      }
    }, { passive: false });

    window.addEventListener("touchmove", (e) => {
      if (e.touches.length == 1) {
        this.#deltaX = this.#X - e.touches[0].clientX;
        this.#deltaY = this.#Y - e.touches[0].clientY;
        this.#X = e.touches[0].clientX;
        this.#Y = e.touches[0].clientY;
      }
    });

    window.addEventListener("touchend", () => {
      this.#isTouching = false;
    });
  }

  // アップデート・変数のリセット
  Update() {
    this.#deltaX = 0;
    this.#deltaY = 0;
    this.#scroll = 0;
  }

  // X座標の取得
  X() {
    return this.#X;
  }

  // Y座標の取得
  Y() {
    return this.#Y;
  }

  // X変化量の取得
  DeltaX() {
    return this.#deltaX;
  }

  // Y変化量の取得
  DeltaY() {
    return this.#deltaY;
  }

  // スクロール量の取得
  Scroll() {
    return this.#scroll;
  }


  IsMouseDown() {
    return this.#isMouseDown;
  }
}
