let buttonsValue = [
    7, 8 , 9, '÷', 'Undo', 'Clear', 
    4, 5, 6, 'x', '(', ')', 
    1, 2, 3, '-', 'x<sup>2</sup>', '&radic;',
    0, ',', '%', '+', '=',
]

const keyboard = document.querySelector('.keyboard .keyboard-buttons');
buttonsValue.forEach((buttonValue) => {
    const button = document.createElement('li');
    button.innerHTML = buttonValue;
    button.dataKeyCode = String(buttonValue).charCodeAt(0);
    button.dataValue = buttonValue;
    button.style.float = 'left';
    button.classList.add('keyboard-button');
    keyboard.appendChild(button);
});