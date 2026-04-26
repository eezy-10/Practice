const Calculator = (function () {
  let expression = "", mode = "DEG"; // DEG or RAD 
  return {
    add(value) {
      expression += value;
    },
    clear() {
      expression = "";
    },
    getExpression() {
      return expression;
    },
    setMode(newMode) {
      mode = newMode;
    },
    getMode() {
      return mode;
    }
  };
})();

const precedence = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "^": 3,
  "!": 4
};

const PI = 3.141592653589793, E = 2.718281828459045;
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

display.focus();

display.addEventListener("input", () => {
  display.value = Calculator.getExpression();
});

function isValidInput(expr) {
  if (/[+\-*/^]{2,}/.test(expr)) return false;

  let balance = 0;

  for (let ch of expr) {
    if (ch === "(") balance++;
    if (ch === ")") balance--;
    if (balance < 0) return false;
  }

  return true;
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const rawValue = btn.textContent;
    const value = mapInput(rawValue);

    if (value === "AC") {
      Calculator.clear();
    }
    else if (value === "=") {
      triggerEquals();
    }
    else if ("+-*/^".includes(value)) {
      const updated = handleOperatorInput(
        Calculator.getExpression(),
        value
      );

      Calculator.clear();
      Calculator.add(updated);
    }
    else if (value === ".") {
      const expr = Calculator.getExpression();

      const currentNumber = expr.split(/[+\-*/^()]/).pop();
      if (!currentNumber.includes(".")) {
        Calculator.add(value);
      }

    }
    else {
      Calculator.add(value);
    }

    display.value = Calculator.getExpression();
  });
});

function updateDisplay() {
  display.value = Calculator.getExpression();
}

function mapInput(val) {
  switch (val) {
    case "π": return "π";
    case "√": return "√";
    case "sin": return "sin(";
    case "cos": return "cos(";
    case "tan": return "tan(";
    case "log": return "log(";
    case "ln": return "ln(";
    case "x²": return "^2";
    default: return val;
  }
}

function factorial(n) {
  if (n < 0) throw "Invalid factorial";
  if (n === 0 || n === 1) return 1;

  return n * factorial(n - 1);
}

function evaluateExpression(expr) {
  expr = preprocess(expr);
  let i = 0;

  function peek() {
    return expr[i] || "";
  }

  function consume() {
    return expr[i++];
  }

  function parseNumber() {
    let start = i;

    while (/[0-9.]/.test(peek())) consume();

    return parseFloat(expr.slice(start, i));
  }

  function parseFactor() {
  let ch = peek();
  let value;

  // Unary minus
  if (ch === "-") {
    consume();
    value = -parseFactor();
  }

  // Parentheses
  else if (ch === "(") {
    consume();
    value = parseExpression();

    if (peek() !== ")") throw "Missing )";
    consume();
  }

  // Constants
  else if (ch === "π") {
    consume();
    value = PI;
  }

  else if (ch === "e") {
    consume();
    value = E;
  }

  // Functions (sin, cos, etc.)
  else if (/[a-z]/i.test(ch)) {
    let start = i;

    while (/[a-z]/i.test(peek())) consume();

    let func = expr.slice(start, i);

    if (peek() !== "(") throw "Missing ( after function";
    consume(); // (

    let arg = parseExpression();

    if (peek() !== ")") throw "Missing ) after function";
    consume(); // )

    if (func === "sin") value = sin(convertAngle(arg));
    else if (func === "cos") value = cos(convertAngle(arg));
    else if (func === "tan") value = tan(convertAngle(arg));
    else if (func === "log") value = log10(arg);
    else if (func === "ln") value = ln(arg);
    else throw "Unknown function";
  }

  // Square root
  else if (ch === "√") {
    consume();
    value = sqrt(parseFactor());
  }

  // Number
  else if (/[0-9.]/.test(ch)) {
    value = parseNumber();
  }

  else {
    throw "Invalid input";
  }

  // 🔥 Factorial support (IMPORTANT)
  while (peek() === "!") {
    consume();
    value = factorial(value);
  }

  return value;
}

  function parsePower() {
    let base = parseFactor();

    while (peek() === "^") {
      consume();
      let exponent = parsePower(); // right associative
      base = power(base, exponent);
    }

    return base;
  }

  function parseTerm() {
    let value = parsePower();

    while (peek() === "*" || peek() === "/") {
      let op = consume();
      let right = parsePower();

      if (op === "*") value *= right;
      else {
        if (right === 0) throw "Divide by zero";
        value /= right;
      }
    }

    return value;
  }

  function parseExpression() {
    let value = parseTerm();

    while (peek() === "+" || peek() === "-") {
      let op = consume();
      let right = parseTerm();

      if (op === "+") value += right;
      else value -= right;
    }

    return value;
  }

  let result = parseExpression();

  return parseFloat(result.toPrecision(10));
}

function power(base, exp) {
  if (exp === 0) return 1;

  if (Number.isInteger(exp)) {
    let result = 1;

    for (let i = 0; i < Math.abs(exp); i++) {
      result *= base;
    }

    return exp < 0 ? 1 / result : result;
  }

  throw "Only integer powers supported (for now)";
}

function sin(x) {
  x = normalizeAngle(x);
  let result = 0;
  let terms = 10;

  for (let n = 0; n < terms; n++) {
    let term = power(-1, n) *
      power(x, 2 * n + 1) /
      factorial(2 * n + 1);

    result += term;
  }

  return result;
}

function cos(x) {
  x = normalizeAngle(x);
  let result = 0;
  let terms = 10;

  for (let n = 0; n < terms; n++) {
    let term = power(-1, n) *
      power(x, 2 * n) /
      factorial(2 * n);

    result += term;
  }

  return result;
}

function tan(x) {
  let c = cos(x);

  if (Math.abs(c) < 1e-9) throw "Domain Error";

  return sin(x) / c;
}

function sqrt(S) {
  if (S < 0) throw "Invalid sqrt";
  if (S === 0) return 0;

  let x = S;

  for (let i = 0; i < 20; i++) {
    x = 0.5 * (x + S / x);
  }

  return x;
}

function ln(x) {
  if (x <= 0) throw "Domain Error";

  if (x === 1) return 0;

  let n = 100, result = 0;

  let y = (x - 1) / (x + 1);

  for (let i = 1; i <= n; i += 2) {
    result += (1 / i) * power(y, i);
  }

  return 2 * result;
}

function log10(x) {
  return ln(x) / ln(10);
}

function convertAngle(x) {
  return Calculator.getMode() === "DEG" ? x * PI / 180 : x;
}

function normalizeAngle(x) {
  while (x > 2 * PI) x -= 2 * PI;
  while (x < -2 * PI) x += 2 * PI;

  return x;
}

const modeToggle = document.getElementById("modeToggle");

modeToggle.addEventListener("change", () => {
  if (modeToggle.checked) {
    Calculator.setMode("RAD");
  }
  else {
    Calculator.setMode("DEG");
  }
});

document.addEventListener("keydown", (e) => {
  const operators = "+-*/^";

  if (e.key === "Enter") {
    e.preventDefault();
    triggerEquals();
  }
  else if (operators.includes(e.key)) {
    e.preventDefault();
    const updated = handleOperatorInput(Calculator.getExpression(), e.key);
    Calculator.clear();
    Calculator.add(updated);
    display.value = Calculator.getExpression();
  }
  else if (e.key === "Backspace") {
    e.preventDefault();
    const expr = Calculator.getExpression();
    Calculator.clear();
    Calculator.add(expr.slice(0, -1));
    display.value = Calculator.getExpression();
  }
  else if (/^[\d().π]$/.test(e.key)) {
    e.preventDefault();
    Calculator.add(e.key);
    display.value = Calculator.getExpression();
  }
  else {
    e.preventDefault();
  }
});

const modeLabel = document.getElementById("modeLabel");

modeToggle.addEventListener("change", () => {
  const mode = modeToggle.checked ? "RAD" : "DEG";
  Calculator.setMode(mode);
  modeLabel.textContent = mode;
});

document.addEventListener("click", () => {
  display.focus();
});

function preprocess(expr) {

  if (expr[0] === "-") expr = "0" + expr;

  expr = expr.replace(/(\d)\(/g, "$1*(");

  expr = expr.replace(/\)(\d)/g, ")*$1");

  expr = expr.replace(/\)\(/g, ")*(");

  expr = expr.replace(/(\d)(sin|cos|tan|log|ln|√)/g, "$1*$2");

  expr = expr.replace(/(\d)(π|e)/g, "$1*$2");

  expr = expr.replace(/(π|e)(\d)/g, "$1*$2");

  expr = expr.replace(/(π|e)\(/g, "$1*(");

  expr = expr.replace(/\)(sin|cos|tan|log|ln|√)/g, ")*$1");

  expr = expr.replace(/(sin|cos|tan|log|ln|√)(-?\d+)/g, "$1($2)");

  expr = expr.replace(/\(\-/g, "(0-");

  return expr;
}

function handleOperatorInput(expr, newOp) {
  if (expr.length === 0) {
    if (newOp === "-") return newOp;
    return expr;
  }

  const lastChar = expr[expr.length - 1];
  const operators = "+-*/^";


  if (lastChar === "(") {
    if (newOp === "-") return expr + newOp;
    return expr;
  }

  if (operators.includes(lastChar)) {
    return expr.slice(0, -1) + newOp;
  }

  return expr + newOp;
}

function triggerEquals() {
  const currentExpr = Calculator.getExpression();
  if ("+-*/^".includes(currentExpr[currentExpr.length - 1])) return;
  if (/^[\(\)\s]+$/.test(currentExpr)) {
    Calculator.clear();
    Calculator.add("Format Error");
    display.value = Calculator.getExpression();
    return;
  }
  try {
    const result = evaluateExpression(currentExpr);
    const rounded = Math.abs(result) < 1e-9 ? 0 : parseFloat(result.toPrecision(10));
    Calculator.clear();
    Calculator.add(rounded.toString());
  } catch (e) {
    Calculator.clear();
    Calculator.add(e);
  }
  display.value = Calculator.getExpression();
}