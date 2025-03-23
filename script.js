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
        if (this.operation !== undefined && !this.shouldResetScreen) {
            this.calculate();
        }

        if (operator === 'equals') {
            this.calculate();
            this.operation = undefined;
            this.previousOperand = '';
        } else {
            this.operation = operator;
            this.previousOperand = this.currentOperand;
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
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add':
                this.currentOperand = (prev + current).toString();
                break;
            case 'subtract':
                this.currentOperand = (prev - current).toString();
                break;
            case 'multiply':
                this.currentOperand = (prev * current).toString();
                break;
            case 'divide':
                if (current === 0) {
                    this.currentOperand = 'Error';
                } else {
                    this.currentOperand = (prev / current).toString();
                }
                break;
        }
        
        if (this.currentOperand === 'Error') {
            setTimeout(() => this.clear(), 1500);
        }
    }

    formatNumber(number) {
        if (number === 'Error') return number;
        
        const [integerPart, decimalPart] = number.toString().split('.');
        const formattedInteger = parseInt(integerPart).toLocaleString();
        
        if (decimalPart != null) {
            return `${formattedInteger}.${decimalPart}`;
        }
        return formattedInteger;
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