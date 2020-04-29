import operations from './operations.js';

// Populating the keyboard
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

// Setting the initial state
let state = {
    display: undefined,
    operand: undefined,
    curentResult: 0,
    ecuation: [],
};
const buttons = document.querySelectorAll('.keyboard-button');
[...buttons].forEach((button) => button.addEventListener('mousedown', operate));

function operate({target}) {
    event.stopPropagation();
    const display = document.querySelector('.calculator .display input');
    const pressedButton = String(target.dataValue);
    if (pressedButton === 'Clear') {
        clear();
    } else if (pressedButton === 'Undo') {
        undo();
    } else if (isOperand(pressedButton)) {
        if (state.ecuation.length > 0) {
            if (isSingleOperand(pressedButton)) {
                let negative = 1;
                if (+state.ecuation < 0) {
                    state.ecuation = [Math.abs(+state.ecuation.join(''))];
                    negative = -1;
                }
                state.display = (pressedButton === 'x<sup>2</sup>') 
                    ? operations.square(+state.ecuation.join(''))
                    : operations.squareroot(+state.ecuation.join(''));
                state.display = String(state.display).substring(0, 6);
                if (negative < 0) state.display = state.display * negative;
                state.ecuation = [state.display];
                state.operand = undefined;
                display.value = state.display;
            } else if (state.curentResult > 0) {
                //operate between result and equation with pressedButton
                console.log(operations.operate(7, 8, 'x'));
                state.display = String(operations.operate(+state.curentResult, +state.ecuation.join(''), state.operand));
                state.curentResult = state.display;
                state.operand - pressedButton;
                state.ecuation = [];
                display.value = state.display;
                if (pressedButton === '=') state.operand = undefined;
            } else {
                state.operand = pressedButton;
                state.curentResult = state.ecuation.join('');
                state.ecuation = [];
            }
        } else {
            if (isSingleOperand(pressedButton) && state.curentResult > 0) {
                state.display = (pressedButton === 'x<sup>2</sup>') 
                    ? operations.square(+state.curentResult)
                    : operations.squareroot(+state.curentResult);
                state.display = String(state.display).substring(0, 6);
                state.ecuation = [state.display];
                state.operand = undefined;
                display.value = state.display;
            } else {
                state.operand = pressedButton;
            }
        }   
    } else if (!isOperand(pressedButton)){
            state.display = (state.display) 
            ? state.ecuation.join('') + String(pressedButton)
            : String(pressedButton);
            state.ecuation.push(pressedButton)
            display.value = state.display;
    }
    console.table(state);
}


function isOperand(char) {
    return !/^\d+$/.test(char);
}

function isSingleOperand(operand) {
    return operand.length > 1;
}

function clear() {
    const display = document.querySelector('.calculator .display input');
    state = {
        display: undefined,
        operand: undefined,
        curentResult: 0,
        ecuation: [],
    }
    display.value = 0;
}

function undo() {
    const display = document.querySelector('.calculator .display input');
    state = {
        display: state.display.substring(0, state.display.length - 1),
        ecuation: state.ecuation.slice(0, state.ecuation.length - 1),
    }
    console.log(state.ecuation);
    display.value = state.display;
}