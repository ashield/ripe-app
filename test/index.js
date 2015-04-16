var assert = require("chai").assert;
var http = require('http');
var express = require('express');
var server = require("../app");
var request = require('supertest');
var app = express();
var mongoose = require('mongoose');
var User = require("../models/user");
ripe = require('../ripe'),

// Test routes blocked by auth
it("should redirect to login", function (done) {
    http.get("http://localhost:3000", function (res) {
        res.should.redirectTo('/login'); 
        done();
    });
});

// need to include a test to register a user

describe('login and navigate to a secure page', function(){
    var agent = request.agent(server);
    //before all the tests run, log in
    before(function(done){
        request(server)
        .post('/login')
        .send({
            username: 'a',
            password: 'a'
        })
        .end(function (err, res) {
            if (err) { return done(err); }

            agent.saveCookies(res);
        
            done();
        });
    });

    it('navigate to dashboard', function (done){
        var req = request(server).get('/')
        .expect(200);

        //attach the logged in cookies to the agent
        agent.attachCookies(req);

        req.end(done);
    });

    it('navigate to projects', function (done){
        var req = request(server).get('/projects')
        .expect(200);

        //attach the logged in cookies to the agent
        agent.attachCookies(req);

        req.end(done);
    });

    it('navigate to tasks', function (done){
    	// can user user ID already setup for local tesing
        var req = request(server).get('/users/552fcf93cc57b66cda83aca7')
        .expect(200);

        //attach the logged in cookies to the agent
        agent.attachCookies(req);

        req.end(done);
    });

    it('post project', function (done){
        request(server)
        .post('/projects')
        .send({
            name: 'test',
            description: 'test'
        })
        .end(function (err, res) {
            if (err) { return done(err); }

            agent.saveCookies(res);

            done();
        });
    });

    it('post task', function (done){
        request(server)
        .post('/users/552fcf93cc57b66cda83aca7/552fcf93cc57b66cda83aca7')
        .send({
            taskname: 'test',
            taskdescription: 'test',
            user: 'a'
        })
        .end(function (err, res) {
            if (err) { return done(err); }

            agent.saveCookies(res);

            done();
        });
    });

    // it('update task', function (done){
    //     request(server)
    //     .put('/users/55293ec61db8d47cb2488b05')
    //     .send({
    //         taskname: 'test',
    //         taskdescription: 'test',
    //         user: 'a'
    //     })
    //     .end(function (err, res) {
    //         if (err) { return done(err); }

    //         agent.saveCookies(res);

    //         done();
    //     });
    // });

    // it('delete task', function (done){
    //     request(server)
    //     .delete('/users/55293ec61db8d47cb2488b05')
    //     .send({
    //         taskname: 'test',
    //         taskdescription: 'test',
    //         user: 'a'
    //     })
    //     .end(function (err, res) {
    //         if (err) { return done(err); }

    //         agent.saveCookies(res);

    //         done();
    //     });
    // });

})
