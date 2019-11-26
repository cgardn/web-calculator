"use strict";

//  design intent: the only place data is stores is numbers[] and lastResult
//      all operations actually happen on the data, display functions only read

let numbers = [''];
let lastResult = 0;

const display = document.querySelector('#calc-display');

const Actions = {
    add,subtract,multiply,divide,operate,
    backspace, clear,
}

function add(ind) {
    let thisOp = numbers.slice(ind-1,ind+2);
    numbers.splice( ind-1, 3, Number(thisOp[0]) + Number(thisOp[2]) );
}

function subtract(ind) {
    let thisOp = numbers.slice(ind-1, ind+2);
    numbers.splice( ind-1, 3, Number(thisOp[0]) - Number(thisOp[2]));
}

function multiply(ind) {
    let thisOp = numbers.slice(ind-1, ind+2);
    numbers.splice( ind-1, 3, Number(thisOp[0]) * Number(thisOp[2]));
}

function divide(ind) {
    let thisOp = numbers.slice(ind-1, ind+2);
    if (thisOp[1] == 0) {
        updateDisplay("No dividing by 0!");
        return;
    }
    numbers.splice( ind-1, 3, Number(thisOp[0]) / Number(thisOp[2]));
}

function operate() {
    // manages the whole expression loop and operator precedence

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
    // could track length of numbers here, if it doesnt change on next iteration
    //   then something went wrong (the operators arent doing anything)
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
}

function clickNum(newChar) {
    const nums = '0123456789.';
    
    if (numbers[numbers.length-1].includes(newChar) && newChar == '.') return;

    if (!nums.includes(numbers[numbers.length-1])) {
        numbers.push('');   
    }
    numbers[numbers.length-1] += newChar;
}

function clickOp(newChar) {
    const ops = '/*-+';

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
// --> END DOC SETUP CODE <-- //