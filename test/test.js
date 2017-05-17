
var Nightmare = require('nightmare');
var should = require('chai').should();
var expect = require('chai').expect;

var url = 'http://localhost:8080';

describe('BootCruit Demo', function() {

    beforeEach(function() {
        var server = require('../server');
    });


    describe('Open Homepage', function() {
        this.timeout(10000);
        it('should open the homepage', function(done) {
            var nightmare = Nightmare({ show: true });
            nightmare
                .goto(url)
                .evaluate(function() {
                    return document.querySelectorAll('.btn').length;
                }).then(function(result) {
                    result.should.equal(2);
                    done();
                })
        });
    })

    describe('Open Student Signin', function() {
        this.timeout(10000);
        it('should open student signin form', function(done) {
            var nightmare = Nightmare({ show: true });
            nightmare
                .goto(url)
                .wait('#studentBtn')
                .click('#studentBtn')
                .wait('#signin')
                .evaluate(function() {
                    return document.querySelectorAll('.md-form').length;
                }).then(function(result) {
                    result.should.equal(2);
                    done();
                })
        })
    })

    describe('Open Recruiter Signin', function() {
        this.timeout(10000);
        it('should open recruiter signin form', function(done) {
            var nightmare = Nightmare({ show: true });
            nightmare
                .goto(url)
                .wait('#recruiterBtn')
                .click('#recruiterBtn')
                .wait('#signin')
                .evaluate(function() {
                    return document.querySelectorAll('.md-form').length;
                }).then(function(result) {
                    result.should.equal(2);
                    done();
                })
        })
    })

})

