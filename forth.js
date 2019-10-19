"use strict";

const ErrorTypes = {
    PARSE: 'ParseError',
    STACK: 'StackError',
    OPERATION: 'OperationError'
};

const ErrorMessages = {
    INVALID_WORD: 'Invalid word',
    STACK_UNDERFLOW: 'Stack underflow',
    DIV_BY_ZERO: 'Divide by zero'
}

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

const WordTypes = {
    DOT_S: 0,
    DROP: 1,
    DUP: 2,
    NIP: 3,
    OVER: 4,
    TUCK: 5,
    SWAP: 6
}

class Word {
    constructor(rawText, callback) {
        this.rawText = rawText;
        this.callback = callback
    }
}

class MathWord extends Word {
    constructor(rawText, type) {
        super(rawText, type);
    }
}

class NumberWord extends Word {
    constructor(rawText, value) {
        super(rawText);
        this.value = value;
    }
}

class InvalidWord extends Word {
    constructor(rawText) {
        super(rawText);
    }
}


class Fvm {


    constructor() {
        this.numberStack = [];
        this.status = StatusTypes.OK;
        this.output = '';
        
        this.words = {
            '.s': function(self) {
                let stackString = self.stackToString();
                let stackCount = self.numberStack.length;
                self.output = `<${stackCount}> ${stackString}`;
            },
    
            'drop': function(self){
                self.checkStackUnderflow(0);
                self.numberStack.pop();
            },
    
            'dup': function(self) {
                self.checkStackUnderflow(0);
                let topNumber = self.numberStack[self.numberStack.length - 1];
                self.numberStack.push(topNumber);      
            },
    
            'nip': function(self) {
                self.checkStackUnderflow(1);
                let topNumber = self.numberStack.pop();
                self.numberStack.pop();
                self.numberStack.push(topNumber);
            }
        }
    }

    // main logic function of program
    // all checks and changes to stack should be performed here
    execute(text) {
        const wordStream = text.split(' ').filter(word => word != '');
        this.output = '';

        for (let word of wordStream) {
            const w = this.parseWord(word);

            if (w instanceof InvalidWord) {
                this.status = StatusTypes.ERROR;
                throw new ParseError(ErrorMessages.INVALID_WORD, w.rawText)
            }

            if (w instanceof NumberWord) {
                this.numberStack.push(w.value);
                continue;
            }

            if (w instanceof MathWord) {
                this.attemptMathOperation(w.type)
                continue;
            }

            if (w instanceof Word) {
                w.callback(this);
                continue;
            }
            
        }

        this.status = StatusTypes.OK;
    }

    parseWord(text) {
        let word = text.trim();
        let val = Number(word);
        
        if (!isNaN(val)) {
            return new NumberWord(word, val)
        }
    
        if (this.isMathOperator(word)) {
            const type = this.getMathOperatorType(word)
            return new MathWord(word, type)
        }
        
        if (word in this.words) {
            return new Word(word, this.words[word])
        }

        return new InvalidWord(word);
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
                    throw new OperationError(ErrorMessages.DIV_BY_ZERO);
                }
                return var1 / var2;
            case MathTypes.POWER:
                return Math.pow(var2, var1);
            case MathTypes.MODULUS:
                return var1 % var2;
        }
    }

    isMathOperator(word) {
        switch (word) {
            case '+': 
            case '-':
            case '*': 
            case '**': 
            case '/': 
            case '%':
                return true;
           default:
                return false;
        }
    }

    getMathOperatorType(word) {
        switch (word) {
            case '+':
                return MathTypes.ADD;
            case '-':
                return MathTypes.SUB;
            case '*':
                return MathTypes.MUL;
            case '**':
                return MathTypes.POWER
            case '/':
                return MathTypes.DIV;
            case '%':
                return MathTypes.MODULUS;
        }
    }

    attemptMathOperation(type) {
        // empty stack error
        if (this.numberStack.length == 0) {
            this.status = StatusTypes.ERROR;
            throw new StackError(ErrorMessages.STACK_UNDERFLOW);
        }
        
        if (this.numberStack.length == 1) {
            this.numberStack.pop();
            return;
        }

        // perform operation on stack
        const topVar = this.numberStack.pop();
        const bottomVar = this.numberStack.pop();
        const newVar = this.operate(topVar, bottomVar, type);

        this.numberStack.push(newVar);
    }

    checkStackUnderflow(equalToOrLessThan) {
        if (this.numberStack.length <= equalToOrLessThan) {
            this.status = StatusTypes.ERROR;
            throw new StackError(ErrorMessages.STACK_UNDERFLOW);
        }
    }

    stackToString() {
        let ret = '';
        this.numberStack.forEach(n => {
            ret += n + ' '
        })
        return ret.trim();
    }
}