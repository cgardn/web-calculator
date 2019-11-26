const Display = {
    
    updateDisplay,
    
    update: () => {
        let displayContent = '';
        if (firstNum) displayContent += firstNum;
        if (operator) displayContent += ` ${operator} `;
        if (secondNum) displayContent += secondNum;
        display.textContent = displayContent;
    },

    clear: () => {
        displayContent = '';
        display.textContent = '';
    }
}

//  design intent: the only place data is stores is numbers[], operators[], and 
//    lastResult
//      all operations actually happen on the data, display functions only read

let numbers = [''];
let operators = [];
let workingNumber = '';
let lastResult = 0;

const display = document.querySelector('#calc-display');

const Actions = {
    add,subtract,multiply,divide,operate,
    backspace, clear,
}

function add(a,b) {
    return a+b;
}

function subtract(a,b) {
    return a-b;
}

function multiply(a,b) {
    return a*b;
}

function divide(a,b) {
    return a/b;
}

function operate(a,b,opr) {
    // FIXME
    throw Error("operate not implemented");
    switch (opr) {
        case 'add': return add(a,b);
        case 'subtract': return subtract(a,b);
        case 'multiply': return multiply(a,b);
        case 'divide': return divide(a,b);
    }
}

function updateDisplay() {
    display.textContent = numbers.join(' ');
    // display.textContent = " " + ` ${numbers.join(' ')} ${workingNumber}` + ' ';
}

function backspace() {
    throw Error("backspace not implemented");
}

function clear() {
    numbers = [' '];
    //operators = [''];
    workingNumber = '';
}

function clickNum(newChar) {
    if (numbers[numbers.length-1].includes(newChar) && newChar == '.') return;
    else {
        numbers[numbers.length-1] += newChar;
    }
    // if (workingNumber.includes(newChar) && newChar == '.') return;
    // else {
    //     workingNumber += newChar;
    // }
}

function clickOp(newChar) {
    const ops = '/*-+';

    // if (!ops.includes(workingNumber)) {
    //     numbers.push(workingNumber);
    // }
    // workingNumber = newChar;
    if (!ops.includes(numbers[numbers.length-1])) {
        numbers.push('');
    }
    numbers[numbers.length-1] = newChar;
}

function doAction(action) {
    Actions[action]();
}

function handleButton(char, e) {

    let newChar = e.target.textContent;
    let action = e.target.getAttribute('data-key');

    const nums = '0123456789.'
    const ops = '/*+-';
    const funcs = '<C=';

    if (nums.includes(newChar)) clickNum(newChar);
    else if (ops.includes(newChar)) clickOp(newChar);
    else if (funcs.includes(newChar)) doAction(action);

    updateDisplay();
}

// --> DOC SETUP CODE FOLLOWS <-- //
function placeButtons() {
    let btns = Array.from(document.querySelectorAll('.button-num'));
    
    btns.map( btn => {
        btn.style.gridArea = btn.getAttribute('data-key');
        btn.addEventListener('click', (e) => handleButton(btn.textContent, e));
    });
}

placeButtons();
// --> END STYLING CODE <-- //