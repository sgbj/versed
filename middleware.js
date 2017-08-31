"use strict";

class Middleware {

    use(fn) {
        this.run = ((stack) => (context, next) => stack(context, () => fn.call(this, context, next.bind(this, context))))(this.run);
    }
    
    run(context, next) {
        next(context);
    }
}

module.exports = Middleware;
