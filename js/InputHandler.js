class InputHandler {
  // メンバ変数
  #X = 0;
  #Y = 0;
  #deltaX = 0;
  #deltaY = 0;
  #scroll = 0;
  #targetPointerId = -1;
  #isPointerPressed = false;
  #isPointerHeld = false;
  #isPointerReleased = false;

  // コンストラクタ
  constructor() {
    window.addEventListener('pointerdown', this.#HandlePointerDown);
    window.addEventListener('pointermove', this.#HandlePointerMove);
    window.addEventListener('pointerup', this.#HandlePointerUp);
    window.addEventListener('wheel', this.#HandleWheel);
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });
  }

  // アップデート・変数のリセット
  Update() {
    this.#isPointerPressed = false;
    this.#isPointerReleased = false;
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
  // ポインタが押されたか
  IsPointerPressed() {
    return this.#isPointerPressed;
  }
  // ポインタが押されているか
  IsPointerHeld() {
    return this.#isPointerHeld;
  }
  // ポインタが離されたか
  IsPointerReleased() {
    return this.#isPointerReleased;
  }

  // ポインタハンドラー関数
  #HandlePointerDown = (event) => {
    if (event.isPrimary) {
      this.#isPointerPressed = true;
      this.#isPointerHeld = true;
      this.#isPointerReleased = false;
      this.#X = event.clientX;
      this.#Y = event.clientY;
      /*
      switch (event.pointerType) {
        case "mouse":
          break;
        case "touch":
          break;
      }
      */
    }
  }
  #HandlePointerMove = (event) => {
    if (event.isPrimary) {
      this.#UpdatePosition(event.clientX, event.clientY);
    }
  }
  #HandlePointerUp = (event) => {
    if (event.isPrimary) {
      this.#isPointerPressed = false;
      this.#isPointerHeld = false;
      this.#isPointerReleased = true;
    }
  }

  #HandleWheel = (event) => {
    this.#scroll = event.deltaY;
  }

  #UpdatePosition(clientX, clientY) {
    this.#deltaX = this.#X - clientX;
    this.#deltaY = this.#Y - clientY;
    this.#X = clientX;
    this.#Y = clientY;
  }
}
