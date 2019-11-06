const coreWords = {
    '(': function() {
        this.state = ForthState.COMMENT;
    },

    ')': function() {
        this.state = ForthState.INTERPRET;
    }
}