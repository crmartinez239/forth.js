export const core = {
    '(': function() {
        this.state = ForthState.COMMENT;
    },

    ')': function() {
        this.state = ForthState.INTERPRET;
    }
}