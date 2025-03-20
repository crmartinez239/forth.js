"use strict";

import * as words from './words';

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

const ForthState = {
    INTERPRET: 0,
    COMMENT: 1,
    COMPILE: 2
}

export class Fvm {

    constructor() {
        this.dataStack = [];
        this.status = StatusTypes.OK;
        this.state = ForthState.INTERPRET;
        this.output = '';
        this.words = {...words.coreWords, ...words.dataStackWords}
    }

    // main logic function of program
    execute(text) {
        const wordStream = text.split(' ').filter(word => word != '');
        this.output = '';

        for (let word of wordStream) {
            const w = this.parseWord(word);

            this.checkForComment(w);

            if (this.state === ForthState.INTERPRET) {
                if (w instanceof words.InvalidWord) {
                    this.status = StatusTypes.ERROR;
                    throw new ParseError(ErrorMessages.INVALID_WORD, w.rawText)
                }
    
                if (w instanceof words.NumberWord) {
                    this.dataStack.push(w.value);
                    continue;
                }
    
                if (w instanceof words.MathWord) {
                    this.attemptMathOperation(w.type)
                    continue;
                }
    
                if (w instanceof words.Word) {
                    w.callback.call(this);
                    continue;
                }
            }
            
        }

        this.status = StatusTypes.OK;
        this.state = ForthState.INTERPRET;
    }

    parseWord(text) {
        let word = text.trim();
        let val = Number(word);
        
        if (!isNaN(val)) {
            return new words.NumberWord(word, val)
        }
    
        if (this.isMathOperator(word)) {
            const type = this.getMathOperatorType(word)
            return new words.MathWord(word, type)
        }
        
        if (word in this.words) {
            return new words.Word(word, this.words[word])
        }

        return new words.InvalidWord(word);
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

    checkForComment(word) {
        if (word.rawText === '(' || word.rawText === ')') {
            word.callback.call(this)
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