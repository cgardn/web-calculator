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
    let result = Number(thisOp[0]) + Number(thisOp[2]);
    numbers.splice( ind-1, 3, `${result}`);
}

function subtract(ind) {
    let thisOp = numbers.slice(ind-1, ind+2);
    let result = Number(thisOp[0]) - Number(thisOp[2]);
    numbers.splice( ind-1, 3, `${result}`);
}

function multiply(ind) {
    let thisOp = numbers.slice(ind-1, ind+2);
    let result = Number(thisOp[0]) * Number(thisOp[2]);
    numbers.splice( ind-1, 3, `${result}`);
}

function divide(ind) {
    let thisOp = numbers.slice(ind-1, ind+2);
    let result = Number(thisOp[0]) / Number(thisOp[2]);
    numbers.splice( ind-1, 3, `${result}`);
}

function operate() {
    // manages the whole expression loop and operator precedence

    const nums = '0123456789.';

    // if working number is an operator, don't compute anything 
    // FIXME include in error UI
    if (!nums.includes(numbers[numbers.length-1][0])) return;

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
    //   then something went wrong (the operators functions arent doing anything)
    if (numbers.length > 1) {operate();}
}

function updateDisplay(optionalText = '') {
    if (optionalText) display.textContent = optionalText;
    display.textContent = numbers.join(' ');
}

function backspace() {
    numbers[numbers.length-1] = numbers[numbers.length-1].slice(0,-1);
    if (numbers[numbers.length-1] == '') numbers.pop();
    if (numbers.length == 0) numbers = [''];
}

function clear() {
    numbers = [''];
}

function clickNum(newChar) {
    const nums = '0123456789.';
    
    if (numbers[numbers.length-1].includes(newChar) && newChar == '.') return;

    if (!nums.includes(numbers[numbers.length-1][0])) {
        if (numbers[0] != '') numbers.push('');   
    }
    numbers[numbers.length-1] += newChar;
}

function clickOp(newChar) {
    const ops = '/*-+';
    if (numbers.length == 1 && numbers[numbers.length-1] == '') return;
    if (!ops.includes(numbers[numbers.length-1])) {
        numbers.push('');
    }
    numbers[numbers.length-1] = newChar;
}

function doAction(action) {
    Actions[action]();
}

function handleButton(e) {
    let action = '';

    const nums = '0123456789.'
    const ops = '/*+-';
    const funcs = {
        Backspace: 'backspace',
        Delete: 'clear',
        Enter: 'operate',
    }

    if (e.type == 'click') {
        action = e.target.getAttribute('data-key');
    } else if (e.type == 'keydown') {
        action = e.key;
    }

    if (nums.includes(action)) clickNum(action);
    else if (ops.includes(action)) clickOp(action);
    else if (action in funcs) doAction(funcs[action]);

    updateDisplay();
}

// --> DOC SETUP CODE FOLLOWS <-- //
function docSetup() {
    let btns = Array.from(document.querySelectorAll('.button-num'));
    
    btns.map( btn => {
        btn.style.gridArea = btn.getAttribute('data-name');
        btn.addEventListener('click', handleButton);
    });

    window.addEventListener('keydown', handleButton);
}

docSetup();
// --> END DOC SETUP CODE <-- //