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
    square(a) {
        return Math.pow(a, 2);
    },
    squareroot(a) {
        if (a <= 0) return 'Error';
        return Math.sqrt(a);
    },
};

export default operations;