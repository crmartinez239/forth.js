const dataStackWords = {
    '.s': function(self) {
        const stackString = self.stackToString();
        const stackCount = self.dataStack.length;
        self.output = `<${stackCount}> ${stackString}`;
    },

    'drop': function(self){
        self.checkStackUnderflow(0);
        self.dataStack.pop();
    },

    'dup': function(self) {
        self.checkStackUnderflow(0);
        const w = self.dataStack[self.dataStack.length - 1];
        self.dataStack.push(w);      
    },

    'nip': function(self) {
        self.checkStackUnderflow(1);
        const w2 = self.dataStack.pop();
        self.dataStack.pop(); // w1
        self.dataStack.push(w2);
    },

    'over': function(self) {
        self.checkStackUnderflow(1);
        const w1 = self.dataStack[self.dataStack.length - 2];
        self.dataStack.push(w1);
    },

    'tuck': function(self) {
        self.checkStackUnderflow(1);
        const w2 = self.dataStack.pop();
        const w1 = self.dataStack.pop();
        self.dataStack.push(w2, w1, w2);
    },

    'swap': function(self) {
        self.checkStackUnderflow(1);
        const w2 = self.dataStack.pop();
        const w1 = self.dataStack.pop();
        self.dataStack.push(w2, w1);
    },

    'pick': function(self) {
        self.checkStackUnderflow(0);
        const topNumber = self.dataStack.pop();
        self.checkStackUnderflow(topNumber);
        const pickedNumber = self.dataStack[(self.dataStack.length - 1) - topNumber];
        self.dataStack.push(pickedNumber);
    },

    'rot': function(self) {
        self.checkStackUnderflow(2);
        const w3 = self.dataStack.pop();
        const w2 = self.dataStack.pop();
        const w1 = self.dataStack.pop();
        self.dataStack.push(w2, w3, w1);
    },

    '-rot': function(self) {
        self.checkStackUnderflow(2);
        const w3 = self.dataStack.pop();
        const w2 = self.dataStack.pop();
        const w1 = self.dataStack.pop();
        self.dataStack.push(w3, w1, w2);
    },

    '?dup': function(self) {
        self.checkStackUnderflow(0);
        const topNumber = self.dataStack[self.dataStack.length - 1];
        if (topNumber) {
            self.dataStack.push(topNumber);
        }
    },

    'roll': function(self) {
        self.checkStackUnderflow(0);
        const rollAmount = self.dataStack.pop();
        self.checkStackUnderflow(rollAmount);
        
    },

    '2drop': function(self) {
        self.checkStackUnderflow(1);
        self.dataStack.pop(); // w2
        self.dataStack.pop(); // w1
    },

    '2nip': function(self) {
        self.checkStackUnderflow(3);
        const w4 = self.dataStack.pop();
        const w3 = self.dataStack.pop();
        self.dataStack.pop(); // w2
        self.dataStack.pop(); // w1
        self.dataStack.push(w3, w4);
    },

    '2dup': function(self) {
        self.checkStackUnderflow(1);
        const w2 = self.dataStack.pop();
        const w1 = self.dataStack.pop();
        self.dataStack.push(w1, w2, w1, w2);
    },

    '2over': function(self) {
        self.checkStackUnderflow(3);
        const len = self.dataStack.length
        const w1 = self.dataStack[len - 4];
        const w2 = self.dataStack[len - 3];
        self.dataStack.push(w1, w2);
    },

    '2tuck': function(self) {
        self.checkStackUnderflow(3);
        const w4 = self.dataStack.pop();
        const w3 = self.dataStack.pop();
        const w2 = self.dataStack.pop();
        const w1 = self.dataStack.pop();
        self.dataStack.push (
            w3, w4, w1, w2, w3, w4
        );
    },

    '2swap': function(self) {
        self.checkStackUnderflow(3);
        const w4 = self.dataStack.pop();
        const w3 = self.dataStack.pop();
        const w2 = self.dataStack.pop();
        const w1 = self.dataStack.pop();
        self.dataStack.push (
            w3, w4, w1, w2
        );
    },

    '2rot': function(self) {
        self.checkStackUnderflow(5);
        const w6 = self.dataStack.pop();
        const w5 = self.dataStack.pop();
        const w4 = self.dataStack.pop();
        const w3 = self.dataStack.pop();
        const w2 = self.dataStack.pop();
        const w1 = self.dataStack.pop();
        self.dataStack.push (
            w3, w4, w5, w6, w1, w2
        );
    }
}