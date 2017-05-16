/**
 * Created by esterlingaccime on 5/16/17.
 */
"use strict";

var should = require("chai").should();

var multiply = function (x, y) {
    if(typeof x !== 'number' || typeof y !== 'number'){
        throw new Error("X or y is not a number");
    }
    if (typeof x !== "number" || typeof y !== "number") {
        throw new Error("x or y is not a number.");
    }
    else return x * y;
};

describe("Test", function () {
    it("should multiply 4 * 5", function () {
       multiply(4, 5).should.equal(20);
    });

    it("should throw when not passed numbers", function() {
        (function() {
            multiply(2, "4");
        }).should.throw(Error);
    });
});