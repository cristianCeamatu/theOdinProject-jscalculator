// Functions to do the maths
import operations from './operations.js';

// Values used to populate the calculator keyboard
let buttonsValue = [
    '7', '8' , '9', '÷', 'Undo', 'Clear', 
    '4', '5', '6', 'x', 'x/100', 'x*100', 
    '1', '2', '3', '-', 'x*x', '&radic;',
    '0', ',', '%', '+', '=',
]
// Populating the calculator keyboard
const keyboard = document.querySelector('.keyboard .keyboard-buttons');
buttonsValue.forEach((buttonValue) => {
    const button = document.createElement('li');
    button.innerHTML = (buttonValue === 'x*x') ? 'x<sup>2</sup>' : buttonValue;
    button.dataValue = buttonValue;
    button.style.float = 'left';
    button.className = 'keyboard-button';
    keyboard.appendChild(button);
});

/** Setting the initial state 
 *  We used currentNumbar as array because it is easier to work with 
 *  arrays when adding buttons pressed */ 
let state = {
    display: undefined,
    operand: undefined,
    currentResult: '0',
    currentNumber: [],
};

// Get all created buttons
const buttons = document.querySelectorAll('.keyboard-button');

// Adding event listeneres for buttons, both keyboard and mouse use
const keyDownListener = document.addEventListener('keydown', operate);
const buttonClickedListener = [...buttons].forEach((button) => button.addEventListener('mousedown', operate));


function operate(event) {
    // To avoid unwanted behaviour
    event.stopPropagation();
    event.preventDefault();

    const display = document.querySelector('.calculator .display input');
    let pressedButton;
    
    // Is the event is a keyboard button
    if (event.key) {
        // convertKeyboardKeys() return nothing if the key pressed is not a button value, in this case we stop the function
        if (!convertKeyboardKeys(event.key, buttonsValue)) return;

        // For example: convert 'Enter' to '=', 'Backspace' to 'Undo';   
        else pressedButton = convertKeyboardKeys(event.key, buttonsValue);

    // If the event is a mouse click there is no need to convert
    } else {
        pressedButton = event.target.dataValue;
    }

    // Iterate the possible cases after we set the buttonPressed
    if (pressedButton === 'Clear') {
        clear(state, display);
    } else if (pressedButton === 'Undo') {
        undo(state, display);
    } else if (pressedButton === ',') {
        pressedDot(state, display);
    } else if (isNaN(pressedButton)) {
        // If we have a current number
        if (state.currentNumber.length > 0) {
            if (isSingleOperand(pressedButton)) {
                console.log(pressedButton);
                state.display = operations.operateSingleOperand(+state.currentNumber.join(''), pressedButton);
                state.display = String(state.display).substring(0, 15);
                state.currentNumber = [state.display];
                state.operand = undefined;
                display.value = state.display;
            // If we have both a currentResult and a currentNumber
            } else if (state.currentResult !== '0') {
                state.display = String(operations.operate(+state.currentResult, +state.currentNumber.join(''), state.operand));
                state.currentResult = state.display;
                state.currentNumber = [];
                display.value = state.display;

                // When pressedButton is '=' we don`t add an operand in the state
                state.operand = (pressedButton === '=') ? undefined : pressedButton;

            // If we only have a currentNumber we make it a currentResult and we start a new currentNumber
            } else {
                state.currentResult = state.currentNumber.join('');
                state.currentNumber = [];
                console.log('not single operan ' + pressedButton);
                // When pressedButton is '=' we don`t add an operand in the state
                state.operand = (pressedButton === '=') ? undefined : pressedButton;
            }

        // If we don`t have a current number but we have a current result
        } else {
            if (isSingleOperand(pressedButton) && state.currentResult > 0) {
                state.display = operations.operateSingleOperand(+state.currentResult, pressedButton);
                state.display = String(state.display).substring(0, 15);
                state.currentNumber = [state.display];
                state.operand = undefined;
                state.currentResult = '0';
                display.value = state.display;
            } else {
                // When pressedButton is '=' we don`t add an operand in the state
                state.operand = (pressedButton === '=') ? undefined : pressedButton;
            }
        }   
    // If a digit was pressed
    } else if (!isNaN(pressedButton)){
            // When we don`t have an operator and a current number but we have a current result we transform the current result in a current number
            if (state.operand === undefined && state.currentNumber.length === 0 && +state.currentResult > 0) {
                state.currentNumber = state.currentResult.split('');
                state.currentResult = '0';
                state.display = state.currentNumber.join('');
                display.value = state.display;
            }

            // If the current number is 0 we replace it with the digit
            state.display = (state.currentNumber.length > 0 && state.currentNumber.join('') > 0) 
            ? state.currentNumber.join('') + String(pressedButton)
            : String(pressedButton);
            if (state.currentNumber) console.log(state.currentNumber.join('') > 0)
            state.currentNumber = [state.display];
            display.value = state.display;
    }
    console.table(state);
}

// Single operands have a bigger length then 1 in our cases
function isSingleOperand(operand) {
    return operand && operand.length > 1;
}

function clear(state, display) {
    state.display = undefined;
    state.operand = undefined;
    state.currentResult = '0';
    state.currentNumber = [];
    display.value = '0';
}

function undo(state, display) {
    if (state.currentNumber.length > 1) {
        state.display = state.display.substring(0, state.display.length - 1);
        state.currentNumber = state.currentNumber.slice(0, state.currentNumber.length - 1);
    } else if (state.currentNumber.length === 1 && state.currentNumber[0].length > 1) {
        state.display = state.display.substring(0, state.display.length - 1);
        state.currentNumber = [String(state.currentNumber[0].substring(0, state.currentNumber[0].length - 1))];
    } else if (state.currentResult > 0) {
        state.display = state.display.substring(0, state.display.length - 1);
        state.currentNumber = state.currentResult.split('').slice(0, state.currentResult.length - 1);
        state.currentResult = '0';
    } else {
        state.display = '0';
        state.currentNumber = [];
        state.currentResult = '0';
        display.value = '0';
        console.log('zero')
    }
    display.value = state.display;
}

function convertKeyboardKeys(key, possibleValues = []) {
    // If 'Enter' was pressed we replace with '='
    if (key === 'Enter') {
        return '=';
    } else if (key === 'Backspace' || key === 'Delete') {
        return 'Undo';
    } else if (key === '/') {
        return '÷';
    } else if (key === '*') {
        return 'x';
    } else if (key === '.') {
        return ',';
    // If the key pressed is not from the possibleValues
    } else if (buttonsValue.indexOf(key) === -1) {
        return;
    // Set the pressedbButton
    } else {
        return key;
    }
}

function pressedDot(state, display) {
    // If the value is 0 or there is no value set we add '0.'
    if (state.display === undefined || +state.display === 0) {
        state.currentNumber = [0, '.'];
        state.display = '0.';
        display.value = state.display;
    // If we have a currentNumber and no dot
    } else if (state.currentNumber.length > 0 && state.currentNumber.indexOf('.') === -1) {
        state.currentNumber.push('.');
        state.display = state.currentNumber.join('');
        display.value = state.display;
    // If we have a currentResult with no dot
    } else if (state.currentResult.length > 0 && state.currentResult.indexOf('.') === -1) {
        state.currentNumber = [...state.currentResult.split(''), '.'];
        state.display = state.currentNumber.join('');
        state.currentResult = '0';
        display.value = state.display;
    }
}