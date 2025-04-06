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
    win.innerHTML = "<b>Mod Window</b><br><small>By XPDevs</small><br><p id='modStatus' style='color: red;'>Mod: false</p>";
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

  // Object to track previous states of D-pad buttons
  let prevButtonStates = {
    12: false, // D-pad up
    13: false, // D-pad down
    14: false, // D-pad left
    15: false, // D-pad right
  };

  // Function to handle the D-pad input
  function handleDPadInput(gamepad) {
    handleDPadDirection(gamepad, 12, "w");
    handleDPadDirection(gamepad, 13, "s");
    handleDPadDirection(gamepad, 14, "a");
    handleDPadDirection(gamepad, 15, "d");
  }

  // Helper function to handle individual D-pad directions
  function handleDPadDirection(gamepad, buttonIndex, key) {
    const buttonState = gamepad.buttons[buttonIndex].pressed;
    if (buttonState && !prevButtonStates[buttonIndex]) {
      simulateKeyPress(key); // Simulate key press when button is first pressed
    } 
    if (!buttonState && prevButtonStates[buttonIndex]) {
      stopKeyPress(key); // Stop key press when the button is released
    }
    prevButtonStates[buttonIndex] = buttonState; // Update button state
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

  // Function to continuously monitor the gamepad input for D-pad events
  function handleGamepadInput() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

    if (gamepads[0]) {
      const gamepad = gamepads[0];
      handleDPadInput(gamepad); // Call the function to handle D-pad input
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

        // Handle D-pad input
        handleDPadInput(gamepad);

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
