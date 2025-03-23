class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.shouldResetScreen = false;
        
        this.initializeDOM();
        this.setupEventListeners();
    }

    initializeDOM() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.numberButtons = document.querySelectorAll('.number');
        this.operatorButtons = document.querySelectorAll('.operator');
        this.specialButtons = document.querySelectorAll('.special');
    }

    setupEventListeners() {
        // Add touchstart event for better mobile response
        const addButtonListener = (button, handler) => {
            const eventTypes = ['click', 'touchstart'];
            eventTypes.forEach(eventType => {
                button.addEventListener(eventType, (e) => {
                    if (eventType === 'touchstart') {
                        e.preventDefault(); // Prevent double-firing on mobile
                    }
                    handler();
                });
            });
        };

        this.numberButtons.forEach(button => {
            addButtonListener(button, () => this.appendNumber(button.textContent));
        });

        this.operatorButtons.forEach(button => {
            addButtonListener(button, () => this.handleOperator(button.dataset.action));
        });

        this.specialButtons.forEach(button => {
            addButtonListener(button, () => this.handleSpecial(button.dataset.action));
        });

        // Add viewport height fix for mobile browsers
        const setVH = () => {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
        setVH();
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    handleOperator(operator) {
        if (operator === 'equals') {
            if (this.operation !== undefined) {
                this.calculate();
            }
            this.operation = undefined;
            this.previousOperand = '';
            this.shouldResetScreen = true;
        } else {
            if (this.operation !== undefined && !this.shouldResetScreen) {
                this.calculate();
            } else if (this.operation === undefined) {
                this.previousOperand = this.currentOperand;
            }
            this.operation = operator;
            this.shouldResetScreen = true;
        }
        this.updateDisplay();
    }

    handleSpecial(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'plusMinus':
                this.toggleSign();
                break;
            case 'percent':
                this.percentage();
                break;
        }
        this.updateDisplay();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    toggleSign() {
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
    }

    percentage() {
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
    }

    calculate() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Handle floating point precision
        result = parseFloat(result.toFixed(10));
        this.currentOperand = result.toString();
        this.previousOperand = '';
        
        if (this.currentOperand === 'Error') {
            setTimeout(() => this.clear(), 1500);
        }
    }

    formatNumber(number) {
        if (number === 'Error') return number;
        if (number === '0') return '0'; // Add this line to handle zero specifically
        
        const maxDigits = 10; // Maximum digits to display
        let [integerPart, decimalPart] = number.toString().split('.');
        
        // Handle very large or very small numbers
        if (Math.abs(parseFloat(number)) >= 1e10 || Math.abs(parseFloat(number)) <= 1e-7) {
            return parseFloat(number).toExponential(5);
        }
        
        // Format integer part with commas
        integerPart = parseInt(integerPart).toLocaleString();
        
        // Handle decimal part
        if (decimalPart != null) {
            // Limit decimal places
            decimalPart = decimalPart.slice(0, maxDigits - integerPart.replace(/,/g, '').length);
            return `${integerPart}.${decimalPart}`;
        }
        return integerPart;
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.formatNumber(this.currentOperand);
        if (this.operation) {
            this.previousOperandElement.textContent = `${this.formatNumber(this.previousOperand)} ${this.getOperatorSymbol(this.operation)}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    getOperatorSymbol(operator) {
        const symbols = {
            add: '+',
            subtract: '−',
            multiply: '×',
            divide: '÷'
        };
        return symbols[operator] || '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});