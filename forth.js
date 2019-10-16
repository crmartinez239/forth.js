const ErrorTypes = {
    PARSE: 'ParseError',
    STACK: 'StackError',
    OPERATION: 'OperationError'
};

class ParseError extends Error {
    constructor(message, rawText) {
        super(message);
        this.name = ErrorTypes.PARSE;
        this.rawText = rawText;
    }
}

class StackError extends Error {
    constructor(message) {
        super(message);
        this.name = ErrorTypes.STACK;
    }
}

class OperationError extends Error {
    constructor(message) {
        super(message);
        this.name = ErrorTypes.OPERATION;
    }
}

const MathTypes = {
    INVALID: 0,
    VALUE: 1,
    ADD: 2,
    SUB: 3,
    MUL: 4,
    DIV: 5,
    POWER: 6,
    MODULUS: 7
};

const StatusTypes = {
    OK: 'ok',
    ERROR: '?'
};

// token constructor
const Token = (type, value, text) => 
    ({ type: type, value: value, text: text});

class Fvm {
    constructor() {
        this.stack = [];
        this.status = StatusTypes.OK;
    }

    // main logic function of program
    // all checks and changes to stack should be performed here
    execute(text) {
        const stream = text.split(' ').filter(word => word != '');
        for (let word of stream) {
            let t = this.parseWord(word);

            // invalid syntax
            if (t.type == MathTypes.INVALID) {
                this.status = StatusTypes.ERROR;
                throw new ParseError(t.text, word);
            }

            // push value onto stack
            if (t.type == MathTypes.VALUE) {
                this.stack.push(t);
                continue;
            }

            // empty stack error
            if (this.stack.length == 0) {
                this.status = StatusTypes.ERROR;
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
                    Token(MathTypes.VALUE, newVar, newVar.toString()));
            }
            
        }
        this.status = StatusTypes.OK;
    }

    parseWord(text) {
        let data = text.trim();
        let val = Number(data);
        
        if (!isNaN(val)) {
            return Token(MathTypes.VALUE, val, data);
        }
    
        let type;
    
        switch (data) {
            case '+':
                type = MathTypes.ADD;
                break;
            case '-':
                type = MathTypes.SUB;
                break;
            case '*':
                type = MathTypes.MUL;
                break;
            case '**':
                type = MathTypes.POWER
                break;
            case '/':
                type = MathTypes.DIV;
                break;
            case '%':
                type = MathTypes.MODULUS;
                break;
            default:
                return Token(MathTypes.INVALID, undefined, 'Invalid word');
        }
    
        return Token(type, undefined, 'Operand');
    }

    // will either return a new number value
    operate(var1, var2, type) {
        switch (type) {
            case MathTypes.ADD:
                return var1 + var2;
            case MathTypes.SUB:
                return var1 - var2;
            case MathTypes.MUL:
                return var1 * var2;
            case MathTypes.DIV:
                if (var1 == 0 || var2 == 0) {
                    throw new OperationError('Divide by zero');
                }
                return var1 / var2;
            case MathTypes.POWER:
                return Math.pow(var2, var1);
            case MathTypes.MODULUS:
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







