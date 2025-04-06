let prevJoystickStates = {
  x: 0, // Joystick X-axis (left/right)
  y: 0, // Joystick Y-axis (up/down)
};

// Object to track previous states of D-pad buttons
let prevButtonStates = {
  12: false, // D-pad up
  13: false, // D-pad down
  14: false, // D-pad left
  15: false, // D-pad right
};

// Modal elements
let modal, loadingBar, loadingText;

// Function to create and show the modal
function createLoadingModal() {
  modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '9999';

  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '30px';
  modalContent.style.borderRadius = '10px';
  modalContent.style.textAlign = 'center';

  const modalTitle = document.createElement('h2');
  modalTitle.textContent = 'Controller Support Mod';
  modalContent.appendChild(modalTitle);

  loadingText = document.createElement('p');
  loadingText.textContent = 'Applying controller support...';
  modalContent.appendChild(loadingText);

  loadingBar = document.createElement('div');
  loadingBar.style.width = '100%';
  loadingBar.style.height = '20px';
  loadingBar.style.backgroundColor = '#ddd';
  loadingBar.style.borderRadius = '10px';
  loadingBar.style.marginTop = '20px';

  const progressBar = document.createElement('div');
  progressBar.style.height = '100%';
  progressBar.style.backgroundColor = '#4caf50';
  progressBar.style.width = '0%';
  loadingBar.appendChild(progressBar);

  modalContent.appendChild(loadingBar);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Simulate loading
  let progress = 0;
  let loadingInterval = setInterval(() => {
    progress += 1;
    progressBar.style.width = `${progress}%`;
    if (progress >= 100) {
      clearInterval(loadingInterval);
      setTimeout(() => {
        modal.style.display = 'none'; // Hide the modal after loading is complete
        handleGamepadInput(); // Start the gamepad input handling
        createControllerSupportMessage(); // Display the "Controller Support mod" message
      }, 500); // Delay before starting the gamepad input (for effect)
    }
  }, 30); // Adjust the interval speed to control loading time
}

// Function to handle the gamepad input
function handleGamepadInput() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

  if (gamepads[0]) {
    const gamepad = gamepads[0];

    // Handle Left Joystick for WASD movement
    const leftJoystickX = gamepad.axes[0]; // Left joystick X-axis (horizontal movement)
    const leftJoystickY = gamepad.axes[1]; // Left joystick Y-axis (vertical movement)

    const joystickThreshold = 0.2; // Threshold to detect significant movement

    // Handle left joystick horizontal movement (A/D keys)
    if (leftJoystickX < -joystickThreshold && prevJoystickStates.x !== -1) {
      simulateKeyPress("a");
      prevJoystickStates.x = -1; // Mark joystick moved left
    } else if (leftJoystickX > joystickThreshold && prevJoystickStates.x !== 1) {
      simulateKeyPress("d");
      prevJoystickStates.x = 1; // Mark joystick moved right
    }

    // Handle left joystick vertical movement (W/S keys)
    if (leftJoystickY < -joystickThreshold && prevJoystickStates.y !== -1) {
      simulateKeyPress("w");
      prevJoystickStates.y = -1; // Mark joystick moved up
    } else if (leftJoystickY > joystickThreshold && prevJoystickStates.y !== 1) {
      simulateKeyPress("s");
      prevJoystickStates.y = 1; // Mark joystick moved down
    }

    // Handle D-pad for WASD movement
    // D-pad up
    if (gamepad.buttons[12].pressed && !prevButtonStates[12]) {
      simulateKeyPress("w");
      prevButtonStates[12] = true;
    }
    if (!gamepad.buttons[12].pressed && prevButtonStates[12]) {
      prevButtonStates[12] = false;
    }

    // D-pad down
    if (gamepad.buttons[13].pressed && !prevButtonStates[13]) {
      simulateKeyPress("s");
      prevButtonStates[13] = true;
    }
    if (!gamepad.buttons[13].pressed && prevButtonStates[13]) {
      prevButtonStates[13] = false;
    }

    // D-pad left
    if (gamepad.buttons[14].pressed && !prevButtonStates[14]) {
      simulateKeyPress("a");
      prevButtonStates[14] = true;
    }
    if (!gamepad.buttons[14].pressed && prevButtonStates[14]) {
      prevButtonStates[14] = false;
    }

    // D-pad right
    if (gamepad.buttons[15].pressed && !prevButtonStates[15]) {
      simulateKeyPress("d");
      prevButtonStates[15] = true;
    }
    if (!gamepad.buttons[15].pressed && prevButtonStates[15]) {
      prevButtonStates[15] = false;
    }
  }

  // Re-run the function to continuously monitor the gamepad input
  requestAnimationFrame(handleGamepadInput);
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

// Display message when the controller is connected
function createControllerSupportMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = 'Controller Support Mod';

  const windowDiv = document.createElement('div');
  windowDiv.style.position = 'fixed';
  windowDiv.style.top = '10px';
  windowDiv.style.left = '10px';
  windowDiv.style.padding = '10px';
  windowDiv.style.backgroundColor = 'black';
  windowDiv.style.borderRadius = '8px';
  windowDiv.style.zIndex = '9999';
  windowDiv.style.pointerEvents = 'none';

  messageDiv.style.color = '#fff';
  messageDiv.style.fontSize = '14px';
  messageDiv.style.fontFamily = 'Arial, sans-serif';

  windowDiv.appendChild(messageDiv);
  document.body.appendChild(windowDiv);
}

// Start the process when the gamepad is connected
window.addEventListener('gamepadconnected', function (event) {
  createLoadingModal(); // Show the loading modal first
});

// Check for gamepad connections and disconnections
if (navigator.getGamepads) {
  window.addEventListener('gamepaddisconnected', function (event) {
    console.log('Gamepad disconnected:', event.gamepad);
  });
}

