const operations = {
    operate(a, b, operand) {
        switch(operand) {
            case '+':
                return a + b;
                break;
            case '-':
                return a - b;
                break;
            case '÷':
                return a / b;
                break;
            case 'x':
                return a * b;
                break;
            case '%':
                return a % b;
                break;
            default:
                return 'Invalid operand';
        }
    },
    operateSingleOperand(number, operand) {
        switch(operand) {
            case 'x*x':
                return number ** 2;
                break;
            case '&radic;':
                return Math.sqrt(number);
                break;
            case 'x/100':
                return number / 100;
                break;
            case 'x*100':
                return number * 100;
                break;
            default:
                return 'Invalid operation'
        }
    },
};

export default operations;