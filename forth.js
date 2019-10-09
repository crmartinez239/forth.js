const errorTypes = {
    PARSE: 'ParseError',
    STACK: 'StackError',
    OPERATION: 'OperationError'
};

// error classes
class ParseError extends Error {
    constructor(message, rawText) {
        super(message);
        this.name = errorTypes.PARSE;
        this.rawText = rawText;
    }
}

class StackError extends Error {
    constructor(message) {
        super(message);
        this.name = errorTypes.STACK;
    }
}

class OperationError extends Error {
    constructor(message) {
        super(message);
        this.name = errorTypes.OPERATION;
    }
}

// extend Array functionality for our stack data structure
Array.prototype.peek = function () {
   return this[this.length - 1];
} 

Array.prototype.string = function() {
    let ret = '';
    this.forEach(obj => {
        ret += obj.value + ' '
    })
    return ret.trim();
};

const dataTypes = {
    ADD: 0,
    SUB: 1,
    MUL: 2,
    DIV: 3,
    VALUE: 4,
    INVALID: 5
};

// token constructor
const Token = (type, value, text) => 
    ({ type: type, value: value, text: text});

function parseData(text) {
    let data = text.trim();
    let val = Number(data);
    
    if (!isNaN(val)) {
        return Token(dataTypes.VALUE, val, data);
    }

    let type;

    switch (data) {
        case '+':
            type = dataTypes.ADD;
            break;
        case '-':
            type = dataTypes.SUB;
            break;
        case '*':
            type = dataTypes.MUL;
            break;
        case '/':
            type = dataTypes.DIV;
            break;
        default:
            return Token(dataTypes.INVALID, undefined, 'Invalid word');
    }

    return Token(type, undefined, 'Operand');
}

// will either return a new number value
function operate(var1, var2, type) {
    switch (type) {
        case dataTypes.ADD:
            return var1 + var2;
        case dataTypes.SUB:
            return var1 - var2;
        case dataTypes.MUL:
            return var1 * var2;
        case dataTypes.DIV:
            if (var1 == 0 || var2 == 0) {
                throw new OperationError('Divide by zero');
            }
            return var1 / var2;
    }
}

// main logic function of program
// all checks and changes to stack should be performed here
function execute(text, dataStack) {
    const stream = text.split(' ').filter(word => word != '');
    for (word of stream) {
        t = parseData(word);

        // invalid syntax
        if (t.type == dataTypes.INVALID) {
            throw new ParseError(t.text, word);
        }

        // push value onto stack
        if (t.type == dataTypes.VALUE) {
            dataStack.push(t);
            continue;
        }

        // empty stack error
        if (dataStack.length == 0) {
            throw new StackError('Stack underflow');
        }
        if (dataStack.length == 1) {
            dataStack.pop();
            continue;
        }

        // perform operation on stack
        let topVar = dataStack.pop();
        let bottomVar = dataStack.pop();
        let newVar = operate(topVar.value, bottomVar.value, t.type);

        // I don't think newVar will ever be NaN
        // but just in case??
        if (!isNaN(newVar)) {
            dataStack.push(
                Token(dataTypes.VALUE, newVar, newVar.toString()));
        }
    }
}


