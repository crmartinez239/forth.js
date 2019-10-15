const errorTypes = {
    PARSE: 'ParseError',
    STACK: 'StackError',
    OPERATION: 'OperationError'
};

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

const dataTypes = {
    INVALID: 0,
    VALUE: 1,
    ADD: 2,
    SUB: 3,
    MUL: 4,
    DIV: 5,
    POWER: 6,
    MODULUS: 7
};

const statusTypes = {
    OK: 'ok',
    ERROR: '?'
};

// token constructor
const Token = (type, value, text) => 
    ({ type: type, value: value, text: text});

class Fvm {
    constructor() {
        this.stack = [];
        this.status = statusTypes.OK;
    }

    // main logic function of program
    // all checks and changes to stack should be performed here
    execute(text) {
        const stream = text.split(' ').filter(word => word != '');
        for (let word of stream) {
            let t = this.parseWord(word);

            // invalid syntax
            if (t.type == dataTypes.INVALID) {
                this.status = statusTypes.ERROR;
                throw new ParseError(t.text, word);
            }

            // push value onto stack
            if (t.type == dataTypes.VALUE) {
                this.stack.push(t);
                continue;
            }

            // empty stack error
            if (this.stack.length == 0) {
                this.status = statusTypes.ERROR;
                throw new StackError('Stack underflow');
            }
            if (this.stack.length == 1) {
                this.stack.pop();
                continue;
            }

            // perform operation on stack
            let topVar = this.stack.pop();
            let bottomVar = this.stack.pop();
            let newVar = this.operate(topVar.value, bottomVar.value, t.type);

            // I don't think newVar will ever be NaN
            // but just in case??
            if (!isNaN(newVar)) {
                this.stack.push(
                    Token(dataTypes.VALUE, newVar, newVar.toString()));
            }
            
        }
        this.status = statusTypes.OK;
    }

    parseWord(text) {
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
            case '**':
                type = dataTypes.POWER
                break;
            case '/':
                type = dataTypes.DIV;
                break;
            case '%':
                type = dataTypes.MODULUS;
                break;
            default:
                return Token(dataTypes.INVALID, undefined, 'Invalid word');
        }
    
        return Token(type, undefined, 'Operand');
    }

    // will either return a new number value
    operate(var1, var2, type) {
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
            case dataTypes.POWER:
                return Math.pow(var2, var1);
            case dataTypes.MODULUS:
                return var1 % var2;
        }
    }

    stackToString() {
        let ret = '';
        this.stack.forEach(obj => {
            ret += obj.value + ' '
        })
        return ret.trim();
    }
}







