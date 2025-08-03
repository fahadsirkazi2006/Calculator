// Calculator state variables
        let currentInput = '0';
        let previousInput = '';
        let operator = '';
        let waitingForNewNumber = false;

        // DOM elements
        const currentDisplay = document.getElementById('currentDisplay');
        const previousDisplay = document.getElementById('previousDisplay');

        // Update the display
        function updateDisplay() {
            currentDisplay.textContent = formatNumber(currentInput);
            
            if (previousInput && operator) {
                previousDisplay.textContent = `${formatNumber(previousInput)} ${getOperatorSymbol(operator)}`;
            } else {
                previousDisplay.textContent = '';
            }
        }

        // Format numbers for display
        function formatNumber(num) {
            if (num.length > 12) {
                return parseFloat(num).toExponential(6);
            }
            return num;
        }

        // Get display symbol for operator
        function getOperatorSymbol(op) {
            switch(op) {
                case '+': return '+';
                case '-': return '−';
                case '*': return '×';
                case '/': return '÷';
                default: return '';
            }
        }

        // Handle number input
        function inputNumber(num) {
            if (waitingForNewNumber) {
                currentInput = num;
                waitingForNewNumber = false;
            } else {
                if (currentInput === '0') {
                    currentInput = num;
                } else {
                    currentInput += num;
                }
            }
            updateDisplay();
        }

        // Handle decimal input
        function inputDecimal() {
            if (waitingForNewNumber) {
                currentInput = '0.';
                waitingForNewNumber = false;
            } else if (currentInput.indexOf('.') === -1) {
                currentInput += '.';
            }
            updateDisplay();
        }

        // Handle operator input
        function inputOperator(nextOperator) {
            const inputValue = parseFloat(currentInput);

            if (previousInput === '') {
                previousInput = currentInput;
            } else if (operator) {
                const result = performCalculation();
                
                if (result === null) return;
                
                currentInput = String(result);
                previousInput = String(result);
            } else {
                previousInput = currentInput;
            }

            waitingForNewNumber = true;
            operator = nextOperator;
            updateDisplay();
        }

        // Perform the calculation
        function performCalculation() {
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);

            if (isNaN(prev) || isNaN(current)) return null;

            let result;
            switch (operator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        alert('Error: Cannot divide by zero');
                        return null;
                    }
                    result = prev / current;
                    break;
                default:
                    return null;
            }

            // Handle very large or very small numbers
            if (!isFinite(result)) {
                alert('Error: Result is too large');
                return null;
            }

            // Round to avoid floating point precision issues
            result = Math.round(result * 1000000000000) / 1000000000000;
            
            return result;
        }

        // Handle equals button
        function calculate() {
            if (operator && previousInput !== '' && !waitingForNewNumber) {
                const result = performCalculation();
                
                if (result !== null) {
                    currentInput = String(result);
                    previousInput = '';
                    operator = '';
                    waitingForNewNumber = true;
                    updateDisplay();
                }
            }
        }

        // Clear all
        function clearAll() {
            currentInput = '0';
            previousInput = '';
            operator = '';
            waitingForNewNumber = false;
            updateDisplay();
        }

        // Clear current entry
        function clearEntry() {
            currentInput = '0';
            updateDisplay();
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            // Prevent default behavior for calculator keys
            if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
                event.preventDefault();
            }
            
            // Numbers
            if (key >= '0' && key <= '9') {
                inputNumber(key);
            }
            
            // Operators
            else if (key === '+') {
                inputOperator('+');
            }
            else if (key === '-') {
                inputOperator('-');
            }
            else if (key === '*') {
                inputOperator('*');
            }
            else if (key === '/') {
                inputOperator('/');
            }
            
            // Decimal
            else if (key === '.') {
                inputDecimal();
            }
            
            // Equals
            else if (key === '=' || key === 'Enter') {
                calculate();
            }
            
            // Clear
            else if (key === 'Escape') {
                clearAll();
            }
            else if (key === 'Backspace') {
                clearEntry();
            }
        });

        // Initialize display
        updateDisplay();