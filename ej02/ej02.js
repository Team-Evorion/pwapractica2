/* =====================================
   WEB/INTL - EJERCICIO 02
   Lógica de la calculadora
===================================== */

// Obtener los elementos HTML
const display = document.getElementById("display");
const statusText = document.getElementById("status");
const buttons = document.querySelector(".buttons");

// Variables que guardan el estado de la calculadora
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Mostrar un mensaje debajo de la pantalla
function setStatus(message, isError = false) {
    statusText.textContent = message;
    statusText.classList.toggle("error", isError);
}

// Reiniciar la calculadora
function clearCalculator() {
    display.value = "0";
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    setStatus("Sistema listo");
}

// Introducir un número
function inputNumber(number) {
    if (display.value === "Error") {
        clearCalculator();
    }

    if (waitingForSecondOperand) {
        display.value = number;
        waitingForSecondOperand = false;
    } else if (display.value === "0") {
        display.value = number;
    } else {
        display.value += number;
    }

    setStatus("Introduciendo número");
}

// Introducir el punto decimal
function inputDecimal() {
    if (display.value === "Error") {
        clearCalculator();
    }

    if (waitingForSecondOperand) {
        display.value = "0.";
        waitingForSecondOperand = false;
        setStatus("Introduciendo decimal");
        return;
    }

    if (!display.value.includes(".")) {
        display.value += ".";
    }

    setStatus("Introduciendo decimal");
}

// Seleccionar una operación matemática
function chooseOperator(nextOperator) {
    if (display.value === "Error") {
        return;
    }

    const inputValue = Number(display.value);

    // Permite encadenar operaciones, por ejemplo: 2 + 3 * 4
    if (operator !== null && !waitingForSecondOperand) {
        const result = calculate(firstOperand, inputValue, operator);

        if (result === null) {
            return;
        }

        display.value = formatResult(result);
        firstOperand = result;
    } else {
        firstOperand = inputValue;
    }

    operator = nextOperator;
    waitingForSecondOperand = true;

    setStatus("Operación: " + operator);
}

// Realizar el cálculo sin utilizar eval()
function calculate(a, b, op) {
    let result;

    switch (op) {
        case "+":
            result = a + b;
            break;

        case "-":
            result = a - b;
            break;

        case "*":
            result = a * b;
            break;

        case "/":
            if (b === 0) {
                showError("No se puede dividir entre cero");
                return null;
            }

            result = a / b;
            break;

        default:
            return null;
    }

    if (!Number.isFinite(result)) {
        showError("El resultado no es válido");
        return null;
    }

    return result;
}

// Evitar decimales excesivos y errores de precisión habituales
function formatResult(number) {
    return String(Number(number.toPrecision(12)));
}

// Mostrar un error comprensible
function showError(message) {
    display.value = "Error";
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = true;
    setStatus(message, true);
}

// Calcular el resultado al pulsar =
function calculateResult() {
    if (operator === null || waitingForSecondOperand) {
        return;
    }

    const secondOperand = Number(display.value);
    const result = calculate(firstOperand, secondOperand, operator);

    if (result === null) {
        return;
    }

    display.value = formatResult(result);

    firstOperand = null;
    operator = null;
    waitingForSecondOperand = true;

    setStatus("Cálculo completado");
}

// Borrar el último dígito
function deleteLastDigit() {
    if (display.value === "Error") {
        clearCalculator();
        return;
    }

    if (waitingForSecondOperand) {
        return;
    }

    if (display.value.length <= 1 ||
        (display.value.length === 2 && display.value.startsWith("-"))) {
        display.value = "0";
    } else {
        display.value = display.value.slice(0, -1);
    }

    setStatus("Último dígito eliminado");
}

// Detectar los clics en los botones
buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    // Botones numéricos
    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
        return;
    }

    // Botones de operadores
    if (button.dataset.operator !== undefined) {
        chooseOperator(button.dataset.operator);
        return;
    }

    // Acciones especiales
    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteLastDigit();
            break;

        case "decimal":
            inputDecimal();
            break;

        case "equals":
            calculateResult();
            break;
    }
});

// Permitir utilizar el teclado físico
document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
    } else if (key === "." || key === ",") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
    } else if (key === "Backspace") {
        deleteLastDigit();
    } else if (key === "Escape" || key === "Delete") {
        clearCalculator();
    }
});