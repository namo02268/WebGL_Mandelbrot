let gl;
window.onload = main;

//
// Start here
//
function main() {
  //-------------------Init GL-------------------//
  const canvas = document.createElement('canvas');
  //  const canvas = document.querySelector("#glCanvas");
  gl = canvas.getContext("webgl");
  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }
  document.body.appendChild(canvas);
  document.querySelector(".version").textContent = `Version: ${2.6.toFixed(1)}`;

  //-------------------Init Scene-------------------//
  const scene = new Scene();
  scene.Init();

  //-------------------Render Loop-------------------//
  let lastFrame = 0;
  function render(currentFrame) {
    currentFrame *= 0.001;
    const deltaTime = currentFrame - lastFrame;
    lastFrame = currentFrame;
    document.querySelector(".fps").textContent = `FPS: ${(1 / deltaTime).toFixed(2)}`;

    scene.Draw(deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
