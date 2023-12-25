class InputHandler {
  // メンバ変数
  #X = 0;
  #Y = 0;
  #deltaX = 0;
  #deltaY = 0;
  #scroll = 0;
  #isPointerPressed = false;
  #isPointerHeld = false;
  #isPointerReleased = false;
  #updated = false;

  // コンストラクタ
  constructor() {
    window.addEventListener('pointerdown', this.HandlePointerDown);
    window.addEventListener('pointermove', this.HandlePointerMove);
    window.addEventListener('pointerup', this.HandlePointerUp);
    window.addEventListener('wheel', this.HandleWheel);

    window.addEventListener("touchstart", this.HandleTouchStart, { passive: false });
    window.addEventListener("touchmove", this.HandleTouchMove, { passive: false });
    window.addEventListener("touchend", this.HandleTouchEnd, { passive: false });
  }

  // マウスハンドラー関数
  HandlePointerDown = (event) => {
    this.#isPointerPressed = true;
    this.#isPointerHeld = true;
    this.#isPointerReleased = false;
    this.#X = event.clientX;
    this.#Y = event.clientY;
  }
  HandlePointerMove = (event) => {
    this.UpdatePosition(event.clientX, event.clientY);
  }
  HandlePointerUp = (event) => {
    this.#isPointerPressed = false;
    this.#isPointerHeld = false;
    this.#isPointerReleased = true;
  }
  HandleWheel = (event) => {
    this.#scroll = event.deltaY;
  }

  // タッチハンドラー関数
  HandleTouchStart = (event) => {
    if (event.touches.length === 1) {
      this.UpdatePosition(event.touches[0].clientX, event.touches[0].clientY);
      this.#isPointerPressed = true;
      this.#isPointerHeld = true;
      this.#isPointerReleased = false;
    } else {
      event.preventDefault();
    }
  }
  HandleTouchMove = (event) => {
    if (event.touches.length === 1) {
      this.UpdatePosition(event.clientX, event.clientY);
    } else {
      event.preventDefault();
    }
  }
  HandleTouchEnd = (event) => {
    if (event.touches.length === 1) {
      this.#isPointerPressed = false;
      this.#isPointerHeld = false;
      this.#isPointerReleased = true;
    } else {
      event.preventDefault();
    }
  }

  // アップデート・変数のリセット
  UpdatePosition(clientX, clientY) {
    if (!this.#updated) {
      this.#deltaX = this.#X - clientX;
      this.#deltaY = this.#Y - clientY;
      this.#X = clientX;
      this.#Y = clientY;
      this.#updated = true;
    }
  }

  Update() {
    this.#isPointerPressed = false;
    this.#isPointerReleased = false;
    this.#deltaX = 0;
    this.#deltaY = 0;
    this.#scroll = 0;
    this.#updated = false;
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

}
