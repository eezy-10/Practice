// const Calculator = (function (){
//   let expression = "";
//   let mode = "DEG"; // DEG or RAD

//   return {
//     add(value) {
//       expression += value;
//     },

//     clear() {
//       expression = "";
//     },

//     getExpression() {
//       return expression;
//     },

//     toggleMode() {
//       mode = mode === "DEG" ? "RAD" : "DEG";
//     },

//     setMode(newMode) {
//       mode = newMode;
//     },

//     getMode() {
//       return mode;
//     }
//   };
// })();

// const precedence = {
//   "+": 1,
//   "-": 1,
//   "*": 2,
//   "/": 2,
//   "^": 3,
//   "!": 4
// };

// const PI = 3.141592653589793, E = 2.718281828459045;

// const display = document.getElementById("display");
// const buttons = document.querySelectorAll(".btn");

// display.focus();

// display.addEventListener("input", () => {
//   let value = display.value;

//   // Remove invalid characters
//   value = value.replace(/[^0-9+\-*/^().!πe]/g, "");

//   // Fix multiple decimals in each number
//   value = value.split(/([+\-*/^()])/).map(token => {
//     if (token.includes(".")) {
//       const parts = token.split(".");
//       return parts[0] + "." + parts.slice(1).join(""); // keep only first dot
//     }
//     return token;
//   }).join("");

//   Calculator.clear();
//   Calculator.add(value);
//   display.value = value;
// });

// function isValidInput(expr) {
//   // No consecutive operators
//   if (/[+\-*/^]{2,}/.test(expr)) return false;

//   // Balanced parentheses
//   let balance = 0;
//   for (let ch of expr) {
//     if (ch === "(") balance++;
//     if (ch === ")") balance--;
//     if (balance < 0) return false;
//   }

//   return true;
// }

// buttons.forEach(btn => {
//   btn.addEventListener("click", () => {
//     const rawValue = btn.textContent;
//     const value = mapInput(rawValue);

//     if (value === "AC") {
//       Calculator.clear();
//     }

//     else if (value === "=") {
//       try {
//         const result = evaluateExpression(Calculator.getExpression());
//         Calculator.clear();
//         Calculator.add(result.toString());
//       } catch (e) {
//         Calculator.clear();
//         Calculator.add(e);
//       }
//     }

//     else {
//       handleInput(value);
//     }

//     display.value = Calculator.getExpression();
//   });
// });

// function updateDisplay() {
//   display.value = Calculator.getExpression();
// }

// function mapInput(val) {
//   switch (val) {
//     case "π": return "π";
//     case "√": return "sqrt(";
//     case "sin": return "sin(";
//     case "cos": return "cos(";
//     case "tan": return "tan(";
//     case "log": return "log(";
//     case "ln": return "ln(";
//     case "x²": return "^2";
//     default: return val;
//   }
// }

// function tokenize(expr) {
//   return expr.match(/(\d+(\.\d+)?)|[+\-*/^()!]|sin|cos|tan|log|ln|sqrt|π|e/g);
// }

// function toPostfix(tokens) {
//   const output = [];
//   const stack = [];

//   tokens.forEach(token => {

//     if (!isNaN(token)) {
//       output.push(token);
//     }

//     else if (["sin","cos","tan","log","ln","√"].includes(token)) {
//       stack.push(token);
//     }

//     else if (token === "(") {
//       stack.push(token);
//     }

//     else if (token === ")") {
//       while (stack.length && stack[stack.length - 1] !== "(") {
//         output.push(stack.pop());
//       }
//       stack.pop();
//     }

//     else if (token === "^") {
//       while (
//         stack.length &&
//         precedence[stack[stack.length - 1]] >= precedence[token]
//       ) {
//         output.push(stack.pop());
//       }
//       stack.push(token);
//     }

//     else {
//       while (
//         stack.length &&
//         precedence[stack[stack.length - 1]] >= precedence[token]
//       ) {
//         output.push(stack.pop());
//       }
//       stack.push(token);
//     }

//   });

//   while (stack.length) output.push(stack.pop());

//   return output;
// }

// function evaluatePostfix(postfix) {
//   const stack = [];

//   postfix.forEach(token => {

//     if (!isNaN(token)) {
//       stack.push(parseFloat(token));
//     }

//     else if (token === "π") {
//       stack.push(PI);
//     }

//     else if (token === "e") {
//       stack.push(E);
//     }

//     else if (token === "+") {
//       stack.push(stack.pop() + stack.pop());
//     }

//     else if (token === "-") {
//       let b = stack.pop();
//       let a = stack.pop();
//       stack.push(a - b);
//     }

//     else if (token === "*") {
//       stack.push(stack.pop() * stack.pop());
//     }

//     else if (token === "/") {
//       let b = stack.pop();
//       if (b === 0) throw "Divide by zero";
//       stack.push(stack.pop() / b);
//     }

//     else if (token === "^") {
//       let b = stack.pop();
//       let a = stack.pop();
//       stack.push(power(a, b));
//     }

//     else if (token === "sqrt") {
//       stack.push(sqrt(stack.pop()));
//     }

//     else if (token === "log") {
//       stack.push(log10(stack.pop()));
//     }

//     else if (token === "ln") {
//       stack.push(ln(stack.pop()));
//     }

//     else if (token === "sin") {
//       stack.push(sin(convertAngle(stack.pop())));
//     }

//     else if (token === "cos") {
//       stack.push(cos(convertAngle(stack.pop())));
//     }

//     else if (token === "tan") {
//       stack.push(tan(convertAngle(stack.pop())));
//     }

//     else if (token === "!") {
//       let x = stack.pop();
//       stack.push(factorial(x));
//     }

//   });

//   return stack.pop();
// }

// function factorial(n) {
//   if (n < 0) throw "Invalid factorial";
//   if (n === 0 || n === 1) return 1;
//   return n * factorial(n - 1);
// }

// function evaluateExpression(expr) {
//   expr = preprocess(expr);
//   const tokens = tokenize(expr);
//   const postfix = toPostfix(tokens);
//   return evaluatePostfix(postfix);
// }

// function power(base, exp) {
//   if (exp === 0) return 1;

//   // integer exponent
//   if (Number.isInteger(exp)) {
//     let result = 1;
//     for (let i = 0; i < Math.abs(exp); i++) {
//       result *= base;
//     }
//     return exp < 0 ? 1 / result : result;
//   }

//   // fallback (for now)
//   throw "Only integer powers supported (for now)";
// }

// function sin(x) {
//   x = normalizeAngle(x);
//   let result = 0;
//   let terms = 10;

//   for (let n = 0; n < terms; n++) {
//     let term = power(-1, n) *
//       power(x, 2 * n + 1) /
//       factorial(2 * n + 1);
//     result += term;
//   }

//   return result;
// }

// function cos(x) {
//   x = normalizeAngle(x);
//   let result = 0;
//   let terms = 10;

//   for (let n = 0; n < terms; n++) {
//     let term = power(-1, n) *
//       power(x, 2 * n) /
//       factorial(2 * n);
//     result += term;
//   }

//   return result;
// }

// function tan(x) {
//   let c = cos(x);
//   if (c === 0) throw "Undefined tan";
//   return sin(x) / c;
// }

// function sqrt(S) {
//   console.log(S);
//   if (S < 0) throw "Invalid sqrt";
//   if (S === 0) return 0;

//   let x = S;
//   for (let i = 0; i < 20; i++) {
//     x = 0.5 * (x + S / x);
//   }

//   return x;
// }

// function ln(x) {
//   console.log(x);
//   if (x <= 0) throw "Domain Error";

//   let n = 100;
//   let result = 0;

//   let y = (x - 1) / (x + 1);

//   for (let i = 1; i <= n; i += 2) {
//     result += (1 / i) * power(y, i);
//   }

//   return 2 * result;
// }

// function log10(x) {
//   return ln(x) / ln(10);
// }

// function convertAngle(x) {
//   return Calculator.getMode() === "DEG"
//     ? x * PI / 180
//     : x;
// }

// function normalizeAngle(x) {
//   while (x > 2 * PI) x -= 2 * PI;
//   while (x < -2 * PI) x += 2 * PI;
//   return x;
// }

// const modeToggle = document.getElementById("modeToggle");

// modeToggle.addEventListener("change", () => {
//   if (modeToggle.checked) {
//     Calculator.setMode("RAD");
//   } else {
//     Calculator.setMode("DEG");
//   }
// });

// document.addEventListener("keydown", (e) => {
//   const allowedKeys = "0123456789+-*/^().!";
//   const controlKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

//   // Allow control keys
//   if (controlKeys.includes(e.key)) return;

//   if (e.key === "Backspace") {
//     e.preventDefault();

//     let expr = Calculator.getExpression();
//     expr = expr.slice(0, -1);

//     Calculator.clear();
//     Calculator.add(expr);
//     display.value = expr;

//     return;
//   }
//   // Handle Enter
//   if (e.key === "Enter") {
//     e.preventDefault();
//     try {
//       const result = evaluateExpression(Calculator.getExpression());
//       Calculator.clear();
//       Calculator.add(result.toString());
//     } catch (err) {
//       Calculator.clear();
//       Calculator.add(err);
//     }
//     display.value = Calculator.getExpression();
//     return;
//   }

//   // Block everything else not allowed
//   if (!allowedKeys.includes(e.key)) {
//     e.preventDefault();
//     return;
//   }

//   // ✅ Normal number / parentheses
//   e.preventDefault();
//   handleInput(e.key);
//   display.value = Calculator.getExpression();
// });

// const modeLabel = document.getElementById("modeLabel");

// modeToggle.addEventListener("change", () => {
//   const mode = modeToggle.checked ? "RAD" : "DEG";
//   Calculator.setMode(mode);
//   modeLabel.textContent = mode;
// });

// document.addEventListener("click", () => {
//   display.focus();
// });

// function preprocess(expr) {
//   // Handle unary minus
//   if (expr[0] === "-") {
//     expr = "0" + expr;
//   }
//   expr = expr.replace(/\(\-/g, "(0-");

//   // 🔥 IMPLICIT MULTIPLICATION RULES

//   // 1. number followed by (
//   expr = expr.replace(/(\d)\(/g, "$1*(");

//   // 2. ) followed by number
//   expr = expr.replace(/\)(\d)/g, ")*$1");

//   // 3. ) followed by (
//   expr = expr.replace(/\)\(/g, ")*(");

//   // 4. number followed by function
//   expr = expr.replace(/(\d)(sin|cos|tan|log|ln|√)/g, "$1*$2");

//   // 5. number followed by constant
//   expr = expr.replace(/(\d)(π|e)/g, "$1*$2");

//   // 6. constant followed by number
//   expr = expr.replace(/(π|e)(\d)/g, "$1*$2");

//   // 7. constant followed by (
//   expr = expr.replace(/(π|e)\(/g, "$1*(");

//   // 8. ) followed by function
//   expr = expr.replace(/\)(sin|cos|tan|log|ln|√)/g, ")*$1");

//   // 9. Explicitly adding ( 
//   expr = expr.replace(/(sin|cos|tan|log|ln|√)(\d+)/g, "$1($2)");

//   expr = expr.replace(/√/g, "sqrt");
//   expr = expr.replace(/sqrt(\d+)/g, "sqrt($1)");
//   expr = expr.replace(/sqrt\(/g, "sqrt(");
//   expr = expr.replace(/(\d+|\))\^2/g, "($1)^2");

//   return expr;
// }

// function handleOperatorInput(expr, newOp) {
//   if (expr.length === 0) return newOp;

//   const lastChar = expr[expr.length - 1];
//   const operators = "+-*/^";

//   // Allow negative after "("
//   if (lastChar === "(" && newOp === "-") {
//     return expr + newOp;
//   }

//   // Replace last operator
//   if (operators.includes(lastChar)) {
//     return expr.slice(0, -1) + newOp;
//   }

//   return expr + newOp;
// }

// function handleInput(value) {
//   const expr = Calculator.getExpression();

//   // Operators
//   if ("+-*/^".includes(value)) {
//     const updated = handleOperatorInput(expr, value);
//     Calculator.clear();
//     Calculator.add(updated);
//     return;
//   }

//   // Decimal control
//   if (value === ".") {
//     const lastNumber = expr.split(/[\+\-\*\/\^\(\)]/).pop();

//     if (lastNumber.includes(".")) return;

//     Calculator.add(".");
//     return;
//   }

//   // Allow numbers, parentheses, constants
//   if (/^[0-9()!πe]$/.test(value) || value.includes("(")) {
//     Calculator.add(value);
//   }
// }

const Calculator = (function (){
  let expression = "";
  let mode = "DEG"; // DEG or RAD

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

    toggleMode() {
      mode = mode === "DEG" ? "RAD" : "DEG";
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
  let value = display.value;

  // Remove invalid characters
  value = value.replace(/[^0-9+\-*/^().!πe]/g, "");

  // Fix multiple decimals in each number
  value = value.split(/([+\-*/^()])/).map(token => {
    if (token.includes(".")) {
      const parts = token.split(".");
      return parts[0] + "." + parts.slice(1).join(""); // keep only first dot
    }
    return token;
  }).join("");

  Calculator.clear();
  Calculator.add(value);
  display.value = value;
});

function isValidInput(expr) {
  // No consecutive operators
  if (/[+\-*/^]{2,}/.test(expr)) return false;

  // Balanced parentheses
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
      try {
        const result = evaluateExpression(Calculator.getExpression());
        Calculator.clear();
        Calculator.add(result.toString());
      } catch (e) {
        Calculator.clear();
        Calculator.add(e);
      }
    }

    else {
      handleInput(value);
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
    case "√": return "sqrt(";
    case "sin": return "sin(";
    case "cos": return "cos(";
    case "tan": return "tan(";
    case "log": return "log(";
    case "ln": return "ln(";
    case "x²": return "^2";
    default: return val;
  }
}

function tokenize(expr) {
  return expr.match(/(\d+(\.\d+)?)|[+\-*/^()!]|sin|cos|tan|log|ln|sqrt|π|e/g);
}

function toPostfix(tokens) {
  const output = [];
  const stack = [];

  tokens.forEach(token => {

    if (!isNaN(token)) {
      output.push(token);
    }

    // FIX: was "√", must be "sqrt" to match tokenizer output
    else if (["sin","cos","tan","log","ln","sqrt"].includes(token)) {
      stack.push(token);
    }

    else if (token === "π" || token === "e") {
      output.push(token);
    }

    else if (token === "(") {
      stack.push(token);
    }

    else if (token === ")") {
      while (stack.length && stack[stack.length - 1] !== "(") {
        output.push(stack.pop());
      }
      stack.pop();
      // If top of stack is a function, pop it to output
      if (stack.length && ["sin","cos","tan","log","ln","sqrt"].includes(stack[stack.length - 1])) {
        output.push(stack.pop());
      }
    }

    else if (token === "^") {
      // Right-associative: strict greater than only
      while (
        stack.length &&
        precedence[stack[stack.length - 1]] > precedence[token]
      ) {
        output.push(stack.pop());
      }
      stack.push(token);
    }

    else {
      while (
        stack.length &&
        precedence[stack[stack.length - 1]] >= precedence[token]
      ) {
        output.push(stack.pop());
      }
      stack.push(token);
    }

  });

  while (stack.length) output.push(stack.pop());

  return output;
}

function evaluatePostfix(postfix) {
  const stack = [];

  postfix.forEach(token => {

    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    }

    else if (token === "π") {
      stack.push(PI);
    }

    else if (token === "e") {
      stack.push(E);
    }

    else if (token === "+") {
      stack.push(stack.pop() + stack.pop());
    }

    else if (token === "-") {
      let b = stack.pop();
      let a = stack.pop();
      stack.push(a - b);
    }

    else if (token === "*") {
      stack.push(stack.pop() * stack.pop());
    }

    else if (token === "/") {
      let b = stack.pop();
      if (b === 0) throw "Divide by zero";
      stack.push(stack.pop() / b);
    }

    else if (token === "^") {
      let b = stack.pop();
      let a = stack.pop();
      stack.push(power(a, b));
    }

    else if (token === "sqrt") {
      stack.push(sqrt(stack.pop()));
    }

    else if (token === "log") {
      stack.push(log10(stack.pop()));
    }

    else if (token === "ln") {
      stack.push(ln(stack.pop()));
    }

    else if (token === "sin") {
      stack.push(sin(convertAngle(stack.pop())));
    }

    else if (token === "cos") {
      stack.push(cos(convertAngle(stack.pop())));
    }

    // FIX: was calling cos() instead of tan()
    else if (token === "tan") {
      stack.push(tan(convertAngle(stack.pop())));
    }

    else if (token === "!") {
      let x = stack.pop();
      stack.push(factorial(x));
    }

  });

  return stack.pop();
}

function factorial(n) {
  if (n < 0) throw "Invalid factorial";
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

function evaluateExpression(expr) {
  expr = preprocess(expr);
  const tokens = tokenize(expr);
  const postfix = toPostfix(tokens);
  return evaluatePostfix(postfix);
}

// FIX: support fractional exponents via Math.pow fallback
function power(base, exp) {
  if (exp === 0) return 1;

  if (Number.isInteger(exp)) {
    let result = 1;
    for (let i = 0; i < Math.abs(exp); i++) {
      result *= base;
    }
    return exp < 0 ? 1 / result : result;
  }

  // Fractional exponent fallback (needed by sin/cos Taylor series internals)
  return Math.pow(base, exp);
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
  if (Math.abs(c) < 1e-10) throw "Undefined tan";
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

  let n = 100;
  let result = 0;

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
  return Calculator.getMode() === "DEG"
    ? x * PI / 180
    : x;
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
  } else {
    Calculator.setMode("DEG");
  }
});

document.addEventListener("keydown", (e) => {
  const allowedKeys = "0123456789+-*/^().!";
  const controlKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

  // Allow control keys
  if (controlKeys.includes(e.key)) return;

  if (e.key === "Backspace") {
    e.preventDefault();

    let expr = Calculator.getExpression();
    expr = expr.slice(0, -1);

    Calculator.clear();
    Calculator.add(expr);
    display.value = expr;

    return;
  }
  // Handle Enter
  if (e.key === "Enter") {
    e.preventDefault();
    try {
      const result = evaluateExpression(Calculator.getExpression());
      Calculator.clear();
      Calculator.add(result.toString());
    } catch (err) {
      Calculator.clear();
      Calculator.add(err);
    }
    display.value = Calculator.getExpression();
    return;
  }

  // Block everything else not allowed
  if (!allowedKeys.includes(e.key)) {
    e.preventDefault();
    return;
  }

  e.preventDefault();
  handleInput(e.key);
  display.value = Calculator.getExpression();
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
  // Handle unary minus
  if (expr[0] === "-") {
    expr = "0" + expr;
  }
  expr = expr.replace(/\(\-/g, "(0-");

  // IMPLICIT MULTIPLICATION RULES

  // 1. number followed by (
  expr = expr.replace(/(\d)\(/g, "$1*(");

  // 2. ) followed by number
  expr = expr.replace(/\)(\d)/g, ")*$1");

  // 3. ) followed by (
  expr = expr.replace(/\)\(/g, ")*(");

  // FIX: rules 4 and 8 now include "sqrt" alongside the other functions
  // 4. number followed by function
  expr = expr.replace(/(\d)(sin|cos|tan|log|ln|sqrt)/g, "$1*$2");

  // 5. number followed by constant
  expr = expr.replace(/(\d)(π|e)/g, "$1*$2");

  // 6. constant followed by number
  expr = expr.replace(/(π|e)(\d)/g, "$1*$2");

  // 7. constant followed by (
  expr = expr.replace(/(π|e)\(/g, "$1*(");

  // 8. ) followed by function
  expr = expr.replace(/\)(sin|cos|tan|log|ln|sqrt)/g, ")*$1");

  // 9. Explicitly wrapping bare function args in parens
  expr = expr.replace(/(sin|cos|tan|log|ln|sqrt)(\d+)/g, "$1($2)");

  expr = expr.replace(/(\d+|\))\^2/g, "($1)^2");

  return expr;
}

function handleOperatorInput(expr, newOp) {
  if (expr.length === 0) return newOp;

  const lastChar = expr[expr.length - 1];
  const operators = "+-*/^";

  // Allow negative after "("
  if (lastChar === "(" && newOp === "-") {
    return expr + newOp;
  }

  // Replace last operator
  if (operators.includes(lastChar)) {
    return expr.slice(0, -1) + newOp;
  }

  return expr + newOp;
}

function handleInput(value) {
  const expr = Calculator.getExpression();

  // Operators
  if ("+-*/^".includes(value)) {
    const updated = handleOperatorInput(expr, value);
    Calculator.clear();
    Calculator.add(updated);
    return;
  }

  // Decimal control
  if (value === ".") {
    const lastNumber = expr.split(/[\+\-\*\/\^\(\)]/).pop();

    if (lastNumber.includes(".")) return;

    Calculator.add(".");
    return;
  }

  // Allow numbers, parentheses, constants, and anything containing "("
  if (/^[0-9()!πe]$/.test(value) || value.includes("(")) {
    Calculator.add(value);
  }
}