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

const keyDown = document.addEventListener('keypress', operate);
function test (event) {
    console.log(event.key);
}

// Setting the initial state
let state = {
    display: undefined,
    operand: undefined,
    curentResult: '0',
    ecuation: [],
};
const buttons = document.querySelectorAll('.keyboard-button');
[...buttons].forEach((button) => button.addEventListener('mousedown', operate));

function operate(event) {
    event.stopPropagation();
    const display = document.querySelector('.calculator .display input');
    let pressedButton = (event.key) ? event.key : String(event.target.dataValue);
    if (pressedButton === 'Enter') pressedButton = '=';
    if (pressedButton === 'Clear') {
        clear();
    } else if (pressedButton === 'Undo') {
        undo();
    } else if (pressedButton === ',') {
        pressedButton = '.';
        if (state.display === undefined || +state.display === 0) {
            state.ecuation = [0, '.'];
            state.display = '0.';
            display.value = state.display;
        }else if (state.ecuation.length  > 0 && state.ecuation.indexOf('.') === -1) {
            if (state.ecuation.length > 0) {
                state.ecuation.push(pressedButton);
                state.display = state.ecuation.join('');
                display.value = state.display;

            } else if (state.curentResult.length > 0 && state.curentResult.indexOf('.') === -1) {
                state.ecuation = [...state.curentResult.split(''), '.'];
                state.display = state.ecuation.join('');
                state.curentResult = '0';
            }
            console.log(state.ecuation);
        }
    } else if (isNaN(pressedButton)) {
        if (state.ecuation.length > 0) {
            if (isSingleOperand(pressedButton)) {
                console.log(state.ecuation);
                state.display = (pressedButton === '&radic;') 
                    ? operations.squareroot(+state.ecuation.join(''))
                    : operations.square(+state.ecuation.join(''));
                state.display = String(state.display).substring(0, 6);
                state.ecuation = [state.display];
                display.value = state.display;
            } else if (state.curentResult > 0) {
                state.display = String(operations.operate(+state.curentResult, +state.ecuation.join(''), state.operand));
                state.curentResult = state.display;
                state.operand = (pressedButton === '=') ? undefined : pressedButton;
                state.ecuation = [];
                display.value = state.display;
            } else {
                state.operand = pressedButton;
                if (pressedButton === '=') state.operand = undefined;
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
                state.curentResult = '0';
                display.value = state.display;
            } else {
                state.operand = (pressedButton === '=') ? undefined : pressedButton;
            }
        }   
    } else if (!isNaN(pressedButton)){
            if (state.operand === undefined && state.ecuation.length === 0 && state.curentResult > 0) {
                state.ecuation = state.curentResult.split('');
                //state.ecuation.push(pressedButton);
                state.curentResult = '0';
                state.display = state.ecuation.join('');
                display.value = state.display;
            }
            state.display = (state.ecuation.length > 0) 
            ? state.ecuation.join('') + String(pressedButton)
            : String(pressedButton);
            state.ecuation.push(pressedButton)
            display.value = state.ecuation.join('');
    }
    console.table(state);
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
    if (state.ecuation.length > 1) {
        state.display = state.display.substring(0, state.display.length - 1);
        state.ecuation = state.ecuation.slice(0, state.ecuation.length - 1);
    } else if (state.curentResult > 0) {
        state.display = state.display.substring(0, state.display.length - 1);
        state.ecuation = state.curentResult.split('').slice(0, state.curentResult.length - 1);
        state.curentResult = '0';
    } else {
        state.display = '0';
        state.ecuation = [];
        state.curentResult = '0';
        display.value = '0';
        console.log('zero')
    }
    console.log(state.ecuation);
    display.value = state.display;
}