const operations = {
    operate(a, b, operand) {
        switch(operand) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '÷':
                return a / b;
            case 'x':
                return a * b;
            default:
                return 'Invalid operand';
        }
    },
    square(a) {
        return a ** 2;
    },
    squareroot(a) {
        return Math.sqrt(a);
    },
};

export default operations;