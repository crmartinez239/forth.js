const dataStackWords = {
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