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

class Word {
    constructor(rawText, callback) {
        this.rawText = rawText;
        this.callback = callback
    }
}

class MathWord extends Word {
    constructor(rawText, type) {
        super(rawText);
        this.type = type;
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
        this.dataStack = [];
        this.status = StatusTypes.OK;
        this.output = '';
        
        this.words = {
            '.s': function(self) {
                let stackString = self.stackToString();
                let stackCount = self.dataStack.length;
                self.output = `<${stackCount}> ${stackString}`;
            },
    
            'drop': function(self){
                self.checkStackUnderflow(0);
                self.dataStack.pop();
            },
    
            'dup': function(self) {
                self.checkStackUnderflow(0);
                let w = self.dataStack[self.dataStack.length - 1];
                self.dataStack.push(w);      
            },
    
            'nip': function(self) {
                self.checkStackUnderflow(1);
                let w2 = self.dataStack.pop();
                self.dataStack.pop(); // w1
                self.dataStack.push(w2);
            },

            'over': function(self) {
                self.checkStackUnderflow(1);
                let w1 = self.dataStack[self.dataStack.length - 2];
                self.dataStack.push(w1);
            },

            'tuck': function(self) {
                self.checkStackUnderflow(1);
                let w2 = self.dataStack.pop();
                let w1 = self.dataStack.pop();
                self.dataStack.push(w2, w1, w2);
            },

            'swap': function(self) {
                self.checkStackUnderflow(1);
                let w2 = self.dataStack.pop();
                let w1 = self.dataStack.pop();
                self.dataStack.push(w2, w1);
            },

            'pick': function(self) {
                self.checkStackUnderflow(0);
                let topNumber = self.dataStack.pop();
                self.checkStackUnderflow(topNumber);
                let pickedNumber = self.dataStack[(self.dataStack.length - 1) - topNumber];
                self.dataStack.push(pickedNumber);
            },

            'rot': function(self) {
                self.checkStackUnderflow(2);
                let w3 = self.dataStack.pop();
                let w2 = self.dataStack.pop();
                let w1 = self.dataStack.pop();
                self.dataStack.push(w2, w3, w1);
            },

            '-rot': function(self) {
                self.checkStackUnderflow(2);
                let w3 = self.dataStack.pop();
                let w2 = self.dataStack.pop();
                let w1 = self.dataStack.pop();
                self.dataStack.push(w3, w1, w2);
            },

            '?dup': function(self) {
                self.checkStackUnderflow(0);
                let topNumber = self.dataStack[self.dataStack.length - 1];
                if (topNumber) {
                    self.dataStack.push(topNumber);
                }
            },

            'roll': function(self) {
                self.checkStackUnderflow(0);
                let rollAmount = self.dataStack.pop();
                self.checkStackUnderflow(rollAmount);
                
            },

            '2drop': function(self) {
                self.checkStackUnderflow(1);
                self.dataStack.pop(); // w2
                self.dataStack.pop(); // w1
            },

            '2nip': function(self) {
                self.checkStackUnderflow(3);
                let w4 = self.dataStack.pop();
                let w3 = self.dataStack.pop();
                self.dataStack.pop(); // w2
                self.dataStack.pop(); // w1
                self.dataStack.push(w3, w4);
            },

            '2dup': function(self) {
                self.checkStackUnderflow(1);
                let w2 = self.dataStack.pop();
                let w1 = self.dataStack.pop();
                self.dataStack.push(w1, w2, w1, w2);
            },

            '2over': function(self) {
                self.checkStackUnderflow(3);
                let len = self.dataStack.length
                let w1 = self.dataStack[len - 4];
                let w2 = self.dataStack[len - 3];
                self.dataStack.push(w1, w2);
            },

            '2tuck': function(self) {
                self.checkStackUnderflow(3);
                let w4 = self.dataStack.pop();
                let w3 = self.dataStack.pop();
                let w2 = self.dataStack.pop();
                let w1 = self.dataStack.pop();
                self.dataStack.push (
                    w3, w4, w1, w2, w3, w4
                );
            },

            '2swap': function(self) {
                self.checkStackUnderflow(3);
                let w4 = self.dataStack.pop();
                let w3 = self.dataStack.pop();
                let w2 = self.dataStack.pop();
                let w1 = self.dataStack.pop();
                self.dataStack.push (
                    w3, w4, w1, w2
                );
            },

            '2rot': function(self) {
                self.checkStackUnderflow(5);
                let w6 = self.dataStack.pop();
                let w5 = self.dataStack.pop();
                let w4 = self.dataStack.pop();
                let w3 = self.dataStack.pop();
                let w2 = self.dataStack.pop();
                let w1 = self.dataStack.pop();
                self.dataStack.push (
                    w3, w4, w5, w6, w1, w2
                );
            }

        }

    }

    // main logic function of program
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
                this.dataStack.push(w.value);
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
        if (this.dataStack.length == 0) {
            this.status = StatusTypes.ERROR;
            throw new StackError(ErrorMessages.STACK_UNDERFLOW);
        }
        
        if (this.dataStack.length == 1) {
            this.dataStack.pop();
            return;
        }

        // perform operation on stack
        const topVar = this.dataStack.pop();
        const bottomVar = this.dataStack.pop();
        const newVar = this.operate(topVar, bottomVar, type);

        this.dataStack.push(newVar);
    }

    checkStackUnderflow(equalToOrLessThan) {
        if (this.dataStack.length <= equalToOrLessThan) {
            this.status = StatusTypes.ERROR;
            throw new StackError(ErrorMessages.STACK_UNDERFLOW);
        }
    }

    stackToString() {
        let ret = '';
        this.dataStack.forEach(n => {
            ret += n + ' '
        })
        return ret.trim();
    }
}