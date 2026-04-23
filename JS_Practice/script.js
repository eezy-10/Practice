let display = document.getElementById("display");
const e = 2.71828, pi = 3.14159;

window.onload = function() {
  display.focus();
};

function press(val) {
  display.value += val;
}

function delPrevious(){
    display.value = display.value.slice(0, -1);
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  let result = parseExpression(display.value);
  display.value = result;
}

// Simple parser (supports + - * /)
function parseExpression(expr) {
  let tokens = tokenize(expr);
  return compute(tokens);
}

function tokenize(expr) {
  let tokens = [];
  let num = "";

  for (let i = 0; i < expr.length; i++) {
    let ch = expr[i];

    if ((ch >= '0' && ch <= '9') || ch === '.') {
      num += ch;
    } else {
      if (num !== "") {
        tokens.push(parseFloat(num));
        num = "";
      }
      tokens.push(ch);
    }
  }

  if (num !== "") tokens.push(parseFloat(num));
  return tokens;
}

function compute(tokens) {
  // First pass: * and /
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '*' || tokens[i] === '/') {
      let a = tokens[i - 1];
      let b = tokens[i + 1];

      let result = tokens[i] === '*' ? a * b : a / b;

      tokens.splice(i - 1, 3, result);
      i--;
    }
  }

  // Second pass: + and -
  let result = tokens[0];
  for (let i = 1; i < tokens.length; i += 2) {
    let op = tokens[i];
    let val = tokens[i + 1];

    if (op === '+') result += val;
    else result -= val;
  }

  return result;
}


function sin() {
  let x = parseFloat(display.value);
  display.value = sine(x);
}

// Taylor Series approximation
function sine(x) {
  let term = x;
  let sum = x;

  for (let i = 1; i < 10; i++) {
    term *= -1 * x * x / ((2 * i) * (2 * i + 1));
    sum += term;
  }

  return sum;
}

function cos() {
  let x = parseFloat(display.value);
  display.value = cosine(x);
}

function cosine(x) {

  let term = 1;
  let sum = 1;

  for (let i = 1; i < 10; i++) {
    term *= -1 * x * x / ((2 * i - 1) * (2 * i));
    sum += term;
  }

  return sum;
}

document.addEventListener("keydown", function(e) {
  let key = e.key;

  // Allow numbers
  if ((key >= '0' && key <= '9') || key === '.') {
    e.preventDefault();
    press(key);
    console.log(document.value);
  }

  // Operators
  else if (key === '+' || key === '-' || key === '*' || key === '/') {
    e.preventDefault();
    press(key);
  }

  // Enter = calculate
  else if (key === 'Enter') {
    e.preventDefault();
    calculate();
  }

  // Backspace = delete last character
  else if (key === 'Backspace') {
    e.preventDefault();
    delPrevious();
  }

  // Escape = clear
  else if (key === 'Escape') {
    clearDisplay();
  }

  // Scientific functions shortcuts
  else if (key === 's') {
    sin();
  }

  else if (key === 'c') {
    cos();
  }
});