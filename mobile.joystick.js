// ------------------------------------------------------------
// mobile.joystick.js — Bottom D‑Pad Joystick with Real Movement
// ------------------------------------------------------------
window.MobileJoystick = {
  name: "mobileJoystick",
  mobileMove: null,
  isHeld: false,

  init(app) {
    // Joystick now lives in MOBILE FOOTER (.m-joy)
    const joyButtons = document.querySelectorAll("#mobile-footer .m-joy");
    if (!joyButtons.length) return;

    joyButtons.forEach(btn => {
      const moveType = btn.dataset.move;

      // Touch start → begin movement
      btn.addEventListener("touchstart", () => {
        this.mobileMove = moveType;
        this.isHeld = true;
      });

      // Touch end → stop movement
      btn.addEventListener("touchend", () => {
        this.mobileMove = null;
        this.isHeld = false;
      });

      btn.addEventListener("touchcancel", () => {
        this.mobileMove = null;
        this.isHeld = false;
      });
    });
  },

  // ------------------------------------------------------------
  // Inject movement directly into MovementMod.update()
  // ------------------------------------------------------------
  update(app, dt) {
    if (!this.mobileMove) return;

    const moveSpeed = 1.0; // same as WASD base speed

    // Camera forward direction
    const forward = new THREE.Vector3();
    app.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    // Camera right direction
    const right = new THREE.Vector3();
    right.crossVectors(forward, app.camera.up).normalize();

    const move = new THREE.Vector3();

    switch (this.mobileMove) {
      case "forward": // W
        move.add(forward);
        break;

      case "back": // S
        move.sub(forward);
        break;

      case "left": // A
        move.sub(right);
        break;

      case "right": // D
        move.add(right);
        break;
    }

    // Apply movement to camera + orbit target
    app.camera.position.addScaledVector(move, moveSpeed);
    app.controls.target.addScaledVector(move, moveSpeed);
  }
};

// ------------------------------------------------------------
// Auto‑init when DOM is ready
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (window.App) {
      MobileJoystick.init(App);
      App.register(MobileJoystick); // ensure update() runs every frame
    }
  }, 50);
});
