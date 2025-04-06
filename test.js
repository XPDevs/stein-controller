function modWindow() {
  // Prevent text selection globally
  document.addEventListener('selectstart', function(e) {
    e.preventDefault();
  });

  // Tell the user about having to press a button to start the mod
  alert("Please Press any button on the controller to start the mod");

  // Show version in the console for version control
  console.log('%cVersion 1.4.0', 'color: red; font-style: italic;');

  // Log the current HTML file and its file path
  console.log(`%cFile: ${document.location.pathname}`, 'color: red; font-style: italic;');

  // Prevent context menu unless Shift is held
  document.addEventListener('contextmenu', function (e) {
    if (!e.shiftKey) {
      e.preventDefault();
    }
  });

  // Create window for the mod
  function createModWindow() {
    const win = document.createElement("div");
    win.style.position = "fixed";
    win.style.top = "100px";
    win.style.left = "100px";
    win.style.width = "200px";
    win.style.height = "150px";
    win.style.background = "#222";
    win.style.color = "#fff";
    win.style.border = "2px solid #444";
    win.style.borderRadius = "10px";
    win.style.padding = "10px";
    win.style.zIndex = "10000";
    win.style.boxShadow = "0 0 15px rgba(0,0,0,0.5)";
    win.style.fontFamily = "Arial, sans-serif";
    win.style.cursor = "move";
    win.innerHTML = "<b>Mod Window</b><small> V1.4.0</small><br><small>By XPDevs</small><br><p id='modStatus' style='color: red;'>Mod: false</p>";
    document.body.appendChild(win);

    // Dragging functionality
    let isDragging = false, offsetX = 0, offsetY = 0;

    win.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        win.style.left = (e.clientX - offsetX) + "px";
        win.style.top = (e.clientY - offsetY) + "px";
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  // Object to track joystick movement
  let joystickState = {
    x: 0, // Left joystick X-axis (left-right)
    y: 0, // Left joystick Y-axis (up-down)
  };

  // Function to handle joystick input (left joystick movement)
  function handleJoystickInput(gamepad) {
    // Joystick axes are usually at indices 0 (left-right) and 1 (up-down)
    const xAxis = gamepad.axes[0]; // Left joystick X-axis (left-right)
    const yAxis = gamepad.axes[1]; // Left joystick Y-axis (up-down)

    // Update joystick state
    joystickState.x = xAxis;
    joystickState.y = yAxis;

    // Map joystick movement to keyboard keys (W, A, S, D)
    // Horizontal movement (left-right)
    if (xAxis < -0.5) {
      simulateKeyPress("a"); // Left movement
    } else if (xAxis > 0.5) {
      simulateKeyPress("d"); // Right movement
    }

    // Vertical movement (up-down)
    if (yAxis < -0.5) {
      simulateKeyPress("w"); // Up movement
    } else if (yAxis > 0.5) {
      simulateKeyPress("s"); // Down movement
    }

    // If joystick is near the center, stop key presses
    if (Math.abs(xAxis) < 0.5) {
      stopKeyPress("a");
      stopKeyPress("d");
    }

    if (Math.abs(yAxis) < 0.5) {
      stopKeyPress("w");
      stopKeyPress("s");
    }
  }

  // Function to simulate key press events
  function simulateKeyPress(key) {
    const event = new KeyboardEvent('keydown', {
      key: key,
      keyCode: keyCodeForKey(key),
      code: key,
      which: keyCodeForKey(key),
      bubbles: true,
    });

    // Dispatch the event to simulate the key press
    document.dispatchEvent(event);
  }

  // Function to simulate key release events
  function stopKeyPress(key) {
    const event = new KeyboardEvent('keyup', {
      key: key,
      keyCode: keyCodeForKey(key),
      code: key,
      which: keyCodeForKey(key),
      bubbles: true,
    });

    // Dispatch the event to simulate the key release
    document.dispatchEvent(event);
  }

  // Function to get keyCode based on the key
  function keyCodeForKey(key) {
    const keyCodes = {
      w: 87,  // W key code
      a: 65,  // A key code
      s: 83,  // S key code
      d: 68,  // D key code
    };

    return keyCodes[key] || 0;
  }

  // Function to continuously monitor the gamepad input for joystick events
  function handleGamepadInput() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

    if (gamepads[0]) {
      const gamepad = gamepads[0];
      handleJoystickInput(gamepad); // Handle joystick input
    }

    // Re-run the function to continuously monitor the gamepad input
    requestAnimationFrame(handleGamepadInput);
  }

  // Start the process when the gamepad is connected
  window.addEventListener('gamepadconnected', function (event) {
    handleGamepadInput(); // Start handling the gamepad input
  });

  // Function to check for controller button press
  function checkControllerInput() {
    let gamepadIndex = null;

    // Look for a connected gamepad
    window.addEventListener("gamepadconnected", (e) => {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
      gamepadIndex = e.gamepad.index;
    });

    function gamepadCheck() {
      if (gamepadIndex !== null) {
        const gamepad = navigator.getGamepads()[gamepadIndex];

        // Handle joystick input
        handleJoystickInput(gamepad);

        // Check if any button is pressed
        for (let i = 0; i < gamepad.buttons.length; i++) {
          if (gamepad.buttons[i].pressed) {
            // Button pressed, activate mod
            document.getElementById('modStatus').textContent = "Mod: true";
            document.getElementById('modStatus').style.color = "green";
            console.log('%cMod is active!', 'color: #00FF00; font-size: 16px; font-weight: bold;');
            return; // Stop checking after the button is pressed
          }
        }
      }

      requestAnimationFrame(gamepadCheck);
    }

    gamepadCheck(); // Start checking for button press
  }

  // Start the process
  createModWindow(); // Show the mod window
  checkControllerInput(); // Start checking for gamepad input
}

modWindow();
