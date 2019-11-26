"use strict";

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

function add(ind) {
    let thisOp = numbers.slice(ind-1,ind+2);
    numbers.splice( ind-1, 3, thisOp[0] + thisOp[1] );
}

function subtract(ind) {
    let thisOp = numbers.slice(ind-1, ind+2);
    numbers.splice( ind-1, 3, thisOp[0] - thisOp[1]);
}

function multiply(ind) {
    let thisOp = numbers.slice(ind-1, ind+2);
    numbers.splice( ind-1, 3, thisOp[0] * thisOp[1]);
}

function divide(ind) {
    let thisOp = numbers.slice(ind-1, ind-2);
    if (thisOp[1] == 0) {
        updateDisplay("No dividing by 0!");
        return;
    }
    numbers.splice( ind-1, 3, thisOp[0] / thisOp[1]);
}

function operate() {
    // manages the whole expression loop and operator precedence
    // can probably do this recursively instead of a while loop
    //throw Error("FIXME - operate not implemented");

    const nums = '0123456789.';

    // if working number is an operator, don't compute anything 
    // FIXME include in error UI
    if (!nums.includes(numbers[numbers.length-1])) return;

    let ind = numbers.findIndex( (element) => (element == '/' || element == '*'));
    if (ind>0) {
        if (numbers[ind] == '/') divide(ind);
        else if (numbers[ind] == '*') multiply(ind);
    } else if (ind == -1) {
        ind = numbers.findIndex((element) => (element == '+' || element == '-'));
        if (ind > 0) {
            if (numbers[ind] == '+') add(ind);
            else if (numbers[ind] == '-') multiply(ind);
        }
    }
    if (numbers.length > 1) {operate();}

    // with no parentheses available:
    //  - left to right, find / or * (same precedence)
    //  - if find one, pass index of operator to divide or multiply func
    //  - func takes preceding and following nums, does thing, shrinks array (removes those nums and the operator) and replaces result into new slot, so 3 slots becomes one, with operators on either side
    //  - return now-smaller array and continue searching for operators according to left-to-right and precedence rules
    // when only 1 number left, you're done, calling function updates display

}

function updateDisplay(optionalText = '') {
    if (optionalText) display.textContent = optionalText;
    display.textContent = numbers.join(' ');
}

function backspace() {
    throw Error("FIXME backspace not implemented");
}

function clear() {
    numbers = [''];
    workingNumber = '';
}

function clickNum(newChar) {
    const nums = '0123456789.';
    
    if (numbers[numbers.length-1].includes(newChar) && newChar == '.') return;

    if (!nums.includes(numbers[numbers.length-1])) {
        numbers.push('');   
    }
    numbers[numbers.length-1] += newChar;
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