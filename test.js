function modWindow() {
  document.addEventListener('selectstart', e => e.preventDefault());
  alert("Please Press any button on the controller to start the mod");

  console.log('%cVersion 1.4.0', 'color: red; font-style: italic;');
  console.log(`%cFile: ${document.location.pathname}`, 'color: red; font-style: italic;');
  console.warn("The mod has been started this may cause the game to lag as the longer you play!");

  document.addEventListener('contextmenu', e => {
    if (!e.shiftKey) e.preventDefault();
  });

  let joystickState = { x: 0, y: 0 };
  let modWindowVisible = false;

  function handleJoystickInput(gamepad) {
    const xAxis = gamepad.axes[0];
    const yAxis = gamepad.axes[1];

    joystickState.x = xAxis;
    joystickState.y = yAxis;

    if (xAxis < -0.5) simulateKeyPress("a");
    else if (xAxis > 0.5) simulateKeyPress("d");

    if (yAxis < -0.5) simulateKeyPress("w");
    else if (yAxis > 0.5) simulateKeyPress("s");

    if (Math.abs(xAxis) < 0.5) {
      stopKeyPress("a");
      stopKeyPress("d");
    }

    if (Math.abs(yAxis) < 0.5) {
      stopKeyPress("w");
      stopKeyPress("s");
    }
  }

  function simulateKeyPress(key) {
    const event = new KeyboardEvent('keydown', {
      key: key,
      keyCode: keyCodeForKey(key),
      code: key,
      which: keyCodeForKey(key),
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  function stopKeyPress(key) {
    const event = new KeyboardEvent('keyup', {
      key: key,
      keyCode: keyCodeForKey(key),
      code: key,
      which: keyCodeForKey(key),
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  function keyCodeForKey(key) {
    const keyCodes = {
      w: 87, a: 65, s: 83, d: 68, e: 69, p: 80,
    };
    return keyCodes[key] || 0;
  }

  // Create draggable window
  function createModWindow() {
    const windowDiv = document.createElement('div');
    windowDiv.id = "mod-ui";
    windowDiv.style.cssText = `
      position: fixed;
      top: 100px;
      left: 100px;
      width: 300px;
      background: #222;
      color: white;
      border: 2px solid red;
      padding: 10px;
      border-radius: 10px;
      z-index: 9999;
      cursor: move;
      user-select: none;
    `;
    windowDiv.innerHTML = `
      <div id="mod-ui-header" style="font-weight: bold; margin-bottom: 5px;">
        Mod Menu 
        <button id="mod-ui-exit" style="float: right; background: red; color: white; border: none; padding: 2px 5px; cursor: pointer;">X</button>
      </div>
      <div>Use the controller to move and trigger actions.</div>
    `;
    document.body.appendChild(windowDiv);

    const header = document.getElementById("mod-ui-header");
    let offsetX, offsetY, isDragging = false;

    header.onmousedown = function(e) {
      isDragging = true;
      offsetX = e.clientX - windowDiv.offsetLeft;
      offsetY = e.clientY - windowDiv.offsetTop;
    };

    document.onmousemove = function(e) {
      if (isDragging) {
        windowDiv.style.left = e.clientX - offsetX + 'px';
        windowDiv.style.top = e.clientY - offsetY + 'px';
      }
    };

    document.onmouseup = () => isDragging = false;

    document.getElementById("mod-ui-exit").onclick = toggleModWindow;
  }

  function toggleModWindow() {
    const existing = document.getElementById("mod-ui");
    if (existing) {
      existing.remove();
      modWindowVisible = false;
    } else {
      createModWindow();
      modWindowVisible = true;
    }
  }

  function checkControllerInput() {
    let gamepadIndex = null;

    window.addEventListener("gamepadconnected", e => {
      gamepadIndex = e.gamepad.index;
    });

    function gamepadCheck() {
      const gamepads = navigator.getGamepads();
      if (gamepadIndex !== null && gamepads[gamepadIndex]) {
        const gamepad = gamepads[gamepadIndex];

        handleJoystickInput(gamepad);

        if (gamepad.buttons[3].pressed) simulateKeyPress("e");
        else stopKeyPress("e");

        if (gamepad.buttons[2].pressed) simulateKeyPress("p");
        else stopKeyPress("p");

        // START button toggle (button 9)
        if (gamepad.buttons[9].pressed && !toggleModWindow.debounce) {
          toggleModWindow();
          toggleModWindow.debounce = true;
          setTimeout(() => toggleModWindow.debounce = false, 500); // debounce 500ms
        }
      }

      requestAnimationFrame(gamepadCheck);
    }

    gamepadCheck();
  }

  checkControllerInput();
}
modWindow();
