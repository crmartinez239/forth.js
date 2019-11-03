const dataStackWords = {
    '.s': function() {
        const stackString = this.stackToString();
        const stackCount = this.dataStack.length;
        this.output = `<${stackCount}> ${stackString}`;
    },

    'drop': function(){
        this.checkStackUnderflow(0);
        this.dataStack.pop();
    },

    'dup': function() {
        this.checkStackUnderflow(0);
        const w = this.dataStack[this.dataStack.length - 1];
        this.dataStack.push(w);      
    },

    'nip': function() {
        this.checkStackUnderflow(1);
        const w2 = this.dataStack.pop();
        this.dataStack.pop(); // w1
        this.dataStack.push(w2);
    },

    'over': function() {
        this.checkStackUnderflow(1);
        const w1 = this.dataStack[this.dataStack.length - 2];
        this.dataStack.push(w1);
    },

    'tuck': function() {
        this.checkStackUnderflow(1);
        const w2 = this.dataStack.pop();
        const w1 = this.dataStack.pop();
        this.dataStack.push(w2, w1, w2);
    },

    'swap': function() {
        this.checkStackUnderflow(1);
        const w2 = this.dataStack.pop();
        const w1 = this.dataStack.pop();
        this.dataStack.push(w2, w1);
    },

    'pick': function() {
        this.checkStackUnderflow(0);
        const topNumber = this.dataStack.pop();
        this.checkStackUnderflow(topNumber);
        const pickedNumber = this.dataStack[(this.dataStack.length - 1) - topNumber];
        this.dataStack.push(pickedNumber);
    },

    'rot': function() {
        this.checkStackUnderflow(2);
        const w3 = this.dataStack.pop();
        const w2 = this.dataStack.pop();
        const w1 = this.dataStack.pop();
        this.dataStack.push(w2, w3, w1);
    },

    '-rot': function() {
        this.checkStackUnderflow(2);
        const w3 = this.dataStack.pop();
        const w2 = this.dataStack.pop();
        const w1 = this.dataStack.pop();
        this.dataStack.push(w3, w1, w2);
    },

    '?dup': function() {
        this.checkStackUnderflow(0);
        const topNumber = this.dataStack[this.dataStack.length - 1];
        if (topNumber) {
            this.dataStack.push(topNumber);
        }
    },

    'roll': function() {
        this.checkStackUnderflow(0);
        const rollAmount = this.dataStack.pop();
        this.checkStackUnderflow(rollAmount);
        
    },

    '2drop': function() {
        this.checkStackUnderflow(1);
        this.dataStack.pop(); // w2
        this.dataStack.pop(); // w1
    },

    '2nip': function() {
        this.checkStackUnderflow(3);
        const w4 = this.dataStack.pop();
        const w3 = this.dataStack.pop();
        this.dataStack.pop(); // w2
        this.dataStack.pop(); // w1
        this.dataStack.push(w3, w4);
    },

    '2dup': function() {
        this.checkStackUnderflow(1);
        const w2 = this.dataStack.pop();
        const w1 = this.dataStack.pop();
        this.dataStack.push(w1, w2, w1, w2);
    },

    '2over': function() {
        this.checkStackUnderflow(3);
        const len = this.dataStack.length
        const w1 = this.dataStack[len - 4];
        const w2 = this.dataStack[len - 3];
        this.dataStack.push(w1, w2);
    },

    '2tuck': function() {
        this.checkStackUnderflow(3);
        const w4 = this.dataStack.pop();
        const w3 = this.dataStack.pop();
        const w2 = this.dataStack.pop();
        const w1 = this.dataStack.pop();
        this.dataStack.push (
            w3, w4, w1, w2, w3, w4
        );
    },

    '2swap': function() {
        this.checkStackUnderflow(3);
        const w4 = this.dataStack.pop();
        const w3 = this.dataStack.pop();
        const w2 = this.dataStack.pop();
        const w1 = this.dataStack.pop();
        this.dataStack.push (
            w3, w4, w1, w2
        );
    },

    '2rot': function() {
        this.checkStackUnderflow(5);
        const w6 = this.dataStack.pop();
        const w5 = this.dataStack.pop();
        const w4 = this.dataStack.pop();
        const w3 = this.dataStack.pop();
        const w2 = this.dataStack.pop();
        const w1 = this.dataStack.pop();
        this.dataStack.push (
            w3, w4, w5, w6, w1, w2
        );
    }
}