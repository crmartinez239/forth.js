const coreWords = {
    ':': function() {
        this.state = ForthState.COMPILE;
    },

    ';': function() {

    },

    '(': function() {
        this.state = ForthState.COMMENT;
    },

    ')': function() {
        this.state = ForthState.NORMAL;
    }
}