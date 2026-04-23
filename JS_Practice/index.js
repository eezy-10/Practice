// let events = new Set();
// let event1 = { type: "concert", day: "Saturday" };
// let event2 = { type: "book launch", day: "Wednesday"};
// let event3 = { type: "conference", day: "Thursday"};
// let event4 = { type: "meet up", day: "Monday" };
// Let's add each event to the set
// events.add(event1);
// events.add(event2);
// events.add(event3);
// events.add(event4);

// console.log(events);
// for (let item of events.values()) {
//   console.log(item);
// }

// let arr2 = [9, 15, "a string", {"objectKey": "objectValue"}];

// let arr2converted = [...new Set(arr2)];

// console.log(typeof arr2converted);

// console.log(Array.isArray(arr2converted));

// let arr = [], set = new Set();
// let users = ["John", "Murray", "Jane", "Jane", "Anne", "John", "Murray", "Jane", "Jane", "Anne"];

// for (let i = 0; i < users.length; i++) {
//   arr.push(users[i]);
//   set.add(users[i]);
// }

// let result;

// console.time('Array'); 
// result = arr.indexOf("Anne") !== -1; 
// console.timeEnd('Array');

// console.time('Set'); 
// result = set.has("Anne"); 
// console.timeEnd('Set');

// let users = [{
//     id: 1,
//     name: 'John'
//   },
//   {
//     id: 2,
//     name: 'Murray'
//   },
//   {
//     id: 3,
//     name: 'Jane'
//   },
//   {
//     id: 4,
//     name: 'Wilson'
//   },
//   {
//     id: 5,
//     name: 'Anne'
//   }
// ]

// let userNames = users.map(function(user) {
//   console.log(user.name)
// });

// const user1 = new Map();
// user1.set('id', 1);
// user1.set('name', 'John');

// console.log(user1.get('id'));

// let iterator = user1.entries();

// console.log(iterator.next().value);
// console.log(iterator.next().value);

// const arr = [1,2,2,3];
// const unique = [...new Set(arr)];
// console.log(unique);

// function greet(name) {
//   console.log(name + " with id " + this.id + " from " + this.city);
// }

// const user = { id: 12, city: "NY" };
// greet.apply(user, ['Ali']);
// greet.call(user, "Ali");

// console.log(3 + 10 * 2); // 23
// console.log(3 + (10 * 2)); // 23, because parentheses here are superfluous
// console.log((3 + 10) * 2); // 26, because the parentheses change the order

// let text = "Visit Microsoft!";

// let text = "Black, green, white, red, yellow, blue.";
// console.log(text.match(/red|green|blue/g));

// const arr = [1, 2, 3, 4];
// const doubles = arr.map(a => a * 2);

// console.log(doubles);
// console.log(arr);

// function outer() {
//   let count = 0;
//   return function() {
//     return ++count;
//   };
// }
// const fn = outer();
// console.log(fn(), fn());

// function A() {}
// A.prototype.x = 10;

// const obj = new A();
// console.log(obj.x);

// for (let a in [10,20]) {
//   console.log(a);
// }

// const arr = [1,2];
// const copy1 = [...arr];
// let copy2 = arr;
// copy1[0] = 100;

// console.log(arr[0]);
// copy2[0] = 200;
// console.log(arr[0]);

function shuntingYard(infix) {
  const operators = {
    '+': { precedence: 2, associativity: 'L' },
    '-': { precedence: 2, associativity: 'L' },
    '*': { precedence: 3, associativity: 'L' },
    '/': { precedence: 3, associativity: 'L' },
    '^': { precedence: 4, associativity: 'R' }
  };

  const outputQueue = [];
  const operatorStack = [];
  const tokens = infix.match(/\d+|[+/*^()-]/g); // Basic tokenizer

  tokens.forEach(token => {
    if (/\d+/.test(token)) {
      outputQueue.push(token);
    } else if (token in operators) {
      let o1 = token;
      let o2 = operatorStack[operatorStack.length - 1];
      while (o2 in operators && (
        (operators[o1].associativity === 'L' && operators[o1].precedence <= operators[o2].precedence) ||
        (operators[o1].associativity === 'R' && operators[o1].precedence < operators[o2].precedence)
      )) {
        outputQueue.push(operatorStack.pop());
        o2 = operatorStack[operatorStack.length - 1];
      }
      operatorStack.push(o1);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.pop(); // Remove '('
    }
  });

  return outputQueue.concat(operatorStack.reverse()).join(' ');
}

console.log(shuntingYard("3 + 4 * 2 / ( 1 - 5 ) ^ 2")); 
// Expected Postfix: "3 4 2 * 1 5 - 2 ^ / +"
